'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface DitherImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
}

// Marathon 2026 design language neon yellow-green
const MARATHON_COLOR = '#bfff00';
const BACKGROUND_COLOR = '#0a0a0a';

// Infrared colors
const IR_RED = '#cc1818';
const IR_GREEN_LIGHT = '#20ff40';
const IR_GREEN_DARK = '#0a6618';
const IR_BLUE = '#1830dd';

const BLOCK_SIZE = 6; // Size of infrared blocks in pixels
const QUADRANT_DELAY = 80; // ms between each quadrant reveal
const INFRARED_DURATION = 500; // ms to show infrared first
const SCAN_DURATION = 150; // ms for rapid scan animation
const DITHER_DURATION = 800; // ms to show dither before final image

type Phase = 'infrared' | 'scanning' | 'dither' | 'reveal';

export default function DitherImage({ src, alt, fill, sizes, className }: DitherImageProps) {
  const [phase, setPhase] = useState<Phase>('infrared');
  const [ditherReady, setDitherReady] = useState(false);
  const [ditherDataUrl, setDitherDataUrl] = useState<string | null>(null);
  const [infraredDataUrl, setInfraredDataUrl] = useState<string | null>(null);
  const [hiddenQuadrants, setHiddenQuadrants] = useState<boolean[]>([false, false, false, false]);
  const [scanProgress, setScanProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infraredCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scanStartRef = useRef<number | null>(null);

  useEffect(() => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get container dimensions for display
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Set canvas to container size
      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // Calculate object-fit: cover cropping
      const containerAspect = containerWidth / containerHeight;
      const imgAspect = img.width / img.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (imgAspect > containerAspect) {
        sourceWidth = img.height * containerAspect;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        sourceHeight = img.width / containerAspect;
        sourceY = (img.height - sourceHeight) / 2;
      }

      // Draw scaled image to canvas
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, containerWidth, containerHeight);

      // Get image data
      const imageData = ctx.getImageData(0, 0, containerWidth, containerHeight);
      const data = imageData.data;

      // Convert to grayscale and apply Floyd-Steinberg dithering
      const grayscale: number[] = new Array(containerWidth * containerHeight);

      // First pass: convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
      }

      // Floyd-Steinberg dithering
      for (let y = 0; y < containerHeight; y++) {
        for (let x = 0; x < containerWidth; x++) {
          const idx = y * containerWidth + x;
          const oldPixel = grayscale[idx];
          const newPixel = oldPixel < 128 ? 0 : 255;
          grayscale[idx] = newPixel;
          const error = oldPixel - newPixel;

          if (x + 1 < containerWidth) {
            grayscale[idx + 1] += error * 7 / 16;
          }
          if (y + 1 < containerHeight) {
            if (x > 0) {
              grayscale[idx + containerWidth - 1] += error * 3 / 16;
            }
            grayscale[idx + containerWidth] += error * 5 / 16;
            if (x + 1 < containerWidth) {
              grayscale[idx + containerWidth + 1] += error * 1 / 16;
            }
          }
        }
      }

      // Parse marathon color
      const mr = parseInt(MARATHON_COLOR.slice(1, 3), 16);
      const mg = parseInt(MARATHON_COLOR.slice(3, 5), 16);
      const mb = parseInt(MARATHON_COLOR.slice(5, 7), 16);

      // Parse background color
      const br = parseInt(BACKGROUND_COLOR.slice(1, 3), 16);
      const bg = parseInt(BACKGROUND_COLOR.slice(3, 5), 16);
      const bb = parseInt(BACKGROUND_COLOR.slice(5, 7), 16);

      // Apply dithered result with marathon color
      for (let i = 0; i < grayscale.length; i++) {
        const pixelIdx = i * 4;
        if (grayscale[i] > 128) {
          // Light pixel - use marathon color
          data[pixelIdx] = mr;
          data[pixelIdx + 1] = mg;
          data[pixelIdx + 2] = mb;
        } else {
          // Dark pixel - use background
          data[pixelIdx] = br;
          data[pixelIdx + 1] = bg;
          data[pixelIdx + 2] = bb;
        }
        data[pixelIdx + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);

      // Store dither as data URL
      setDitherDataUrl(canvas.toDataURL());

      // Generate infrared version
      const irCanvas = infraredCanvasRef.current;
      if (irCanvas) {
        const irCtx = irCanvas.getContext('2d');
        if (irCtx) {
          irCanvas.width = containerWidth;
          irCanvas.height = containerHeight;

          // Redraw original image for infrared processing
          irCtx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, containerWidth, containerHeight);
          const irImageData = irCtx.getImageData(0, 0, containerWidth, containerHeight);
          const irData = irImageData.data;

          // Clear canvas for block drawing
          irCtx.fillStyle = BACKGROUND_COLOR;
          irCtx.fillRect(0, 0, containerWidth, containerHeight);

          // Compute heat per block using red vs blue channel difference
          // Red visor glow → hot, white armor → warm, blue fog → cold
          const blockHeats: { bx: number; by: number; heat: number }[] = [];

          for (let by = 0; by < containerHeight; by += BLOCK_SIZE) {
            for (let bx = 0; bx < containerWidth; bx += BLOCK_SIZE) {
              let totalR = 0, totalB = 0, count = 0;

              for (let py = by; py < Math.min(by + BLOCK_SIZE, containerHeight); py++) {
                for (let px = bx; px < Math.min(bx + BLOCK_SIZE, containerWidth); px++) {
                  const idx = (py * containerWidth + px) * 4;
                  totalR += irData[idx];
                  totalB += irData[idx + 2];
                  count++;
                }
              }

              const avgR = totalR / count;
              const avgB = totalB / count;

              // Heat = red channel strength relative to blue
              // Higher red or lower blue = hotter
              const heat = avgR - avgB * 0.8;

              blockHeats.push({ bx, by, heat });
            }
          }

          // Find min/max heat for normalization
          let minHeat = Infinity, maxHeat = -Infinity;
          for (const block of blockHeats) {
            if (block.heat < minHeat) minHeat = block.heat;
            if (block.heat > maxHeat) maxHeat = block.heat;
          }
          const heatRange = maxHeat - minHeat || 1;

          // Draw blocks as heat map
          for (const block of blockHeats) {
            const blockWidth = Math.min(BLOCK_SIZE, containerWidth - block.bx);
            const blockHeight = Math.min(BLOCK_SIZE, containerHeight - block.by);

            // Normalize heat to 0-1
            const normalizedHeat = (block.heat - minHeat) / heatRange;

            if (normalizedHeat < 0.33) {
              // Cold (blue areas) - blue
              irCtx.fillStyle = IR_BLUE;
              irCtx.fillRect(block.bx, block.by, blockWidth, blockHeight);
            } else if (normalizedHeat < 0.66) {
              // Warm - red or solid green
              if (normalizedHeat < 0.5) {
                irCtx.fillStyle = IR_RED;
                irCtx.fillRect(block.bx, block.by, blockWidth, blockHeight);
              } else {
                irCtx.fillStyle = IR_GREEN_LIGHT;
                irCtx.fillRect(block.bx, block.by, blockWidth, blockHeight);
              }
            } else {
              // Hot - green with diagonal
              const useDiagonal = normalizedHeat > 0.83;

              if (useDiagonal) {
                irCtx.fillStyle = IR_GREEN_LIGHT;
                irCtx.fillRect(block.bx, block.by, blockWidth, blockHeight);

                irCtx.fillStyle = IR_GREEN_DARK;
                irCtx.beginPath();
                irCtx.moveTo(block.bx, block.by);
                irCtx.lineTo(block.bx + blockWidth, block.by);
                irCtx.lineTo(block.bx + blockWidth, block.by + blockHeight);
                irCtx.closePath();
                irCtx.fill();
              } else {
                irCtx.fillStyle = IR_GREEN_LIGHT;
                irCtx.fillRect(block.bx, block.by, blockWidth, blockHeight);
              }
            }
          }

          setInfraredDataUrl(irCanvas.toDataURL());
        }
      }

      setDitherReady(true);

      // Phase transitions: infrared → scanning → dither → reveal
      setTimeout(() => {
        setPhase('scanning');
        scanStartRef.current = null;

        const animateScan = (timestamp: number) => {
          if (scanStartRef.current === null) {
            scanStartRef.current = timestamp;
          }

          const elapsed = timestamp - scanStartRef.current;
          const progress = Math.min(elapsed / SCAN_DURATION, 1);
          setScanProgress(progress);

          if (progress < 1) {
            requestAnimationFrame(animateScan);
          } else {
            setPhase('dither');

            setTimeout(() => {
              setPhase('reveal');

              // Reveal quadrants in sequence: top-right, bottom-left, bottom-right, top-left
              [1, 2, 3, 0].forEach((quadrant, i) => {
                setTimeout(() => {
                  setHiddenQuadrants(prev => {
                    const next = [...prev];
                    next[quadrant] = true;
                    return next;
                  });
                }, i * QUADRANT_DELAY);
              });
            }, DITHER_DURATION);
          }
        };

        requestAnimationFrame(animateScan);
      }, INFRARED_DURATION);
    };
  }, [src]);

  // Quadrant clip paths: top-left, top-right, bottom-left, bottom-right
  const quadrantClips = [
    'inset(0 50% 50% 0)',
    'inset(0 0 50% 50%)',
    'inset(50% 50% 0 0)',
    'inset(50% 0 0 50%)',
  ];

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Hidden canvases for computation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={infraredCanvasRef} style={{ display: 'none' }} />

      {/* Real image underneath */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
        style={{ opacity: ditherReady ? 1 : 0, objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Dithered overlay - scan reveals it, then quadrant reveal during reveal phase */}
      {ditherReady && ditherDataUrl && (
        quadrantClips.map((clip, i) => (
          <div
            key={`dither-${i}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${ditherDataUrl})`,
              backgroundSize: '100% 100%',
              clipPath: phase === 'reveal' ? clip : undefined,
              opacity: phase === 'infrared' ? 0 : (phase === 'reveal' && hiddenQuadrants[i] ? 0 : 1),
              transition: phase === 'reveal' ? 'opacity 0.12s ease' : undefined,
              pointerEvents: 'none',
            }}
          />
        ))
      )}

      {/* Infrared overlay - shows first, scan line wipes it away */}
      {ditherReady && infraredDataUrl && (phase === 'infrared' || phase === 'scanning') && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${infraredDataUrl})`,
            backgroundSize: '100% 100%',
            clipPath: phase === 'scanning' ? `inset(0 0 0 ${scanProgress * 100}%)` : undefined,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Scan line */}
      {phase === 'scanning' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${scanProgress * 100}%`,
            width: '2px',
            background: MARATHON_COLOR,
            boxShadow: `0 0 8px ${MARATHON_COLOR}, 0 0 16px ${MARATHON_COLOR}`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
