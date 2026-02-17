'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ToolPageLayout from '../../ui/ToolPageLayout';
import styles from '../../styles/QR.module.css';
import form from '../../styles/FormControls.module.css';

type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
type CornerDotType = 'square' | 'dot';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface QRCodeInstance {
  append: (element: HTMLElement) => void;
  update: (options: object) => void;
}

const dotStyles: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
];

const cornerSquareStyles: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

const cornerDotStyles: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
];

export default function QRPage() {
  const [url, setUrl] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>('square');
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#ffffff');
  const [cornerDotColor, setCornerDotColor] = useState('#ffffff');
  const [isClient, setIsClient] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeInstance | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createQRCode = useCallback(async () => {
    if (!isClient) return;

    const QRCodeStylingModule = await import('qr-code-styling');
    const QRCodeStylingClass = QRCodeStylingModule.default;
    qrCode.current = new QRCodeStylingClass({
      width: size,
      height: size,
      data: url,
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareStyle,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotStyle,
      },
      qrOptions: {
        errorCorrectionLevel: errorLevel,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [isClient, size, url, fgColor, dotStyle, bgColor, cornerSquareColor, cornerSquareStyle, cornerDotColor, cornerDotStyle, errorLevel]);

  useEffect(() => {
    createQRCode();
  }, [createQRCode]);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        width: size,
        height: size,
        data: url,
        dotsOptions: {
          color: fgColor,
          type: dotStyle,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: cornerSquareColor,
          type: cornerSquareStyle,
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: cornerDotStyle,
        },
        qrOptions: {
          errorCorrectionLevel: errorLevel,
        },
      });
    }
  }, [url, fgColor, bgColor, size, errorLevel, dotStyle, cornerSquareStyle, cornerDotStyle, cornerSquareColor, cornerDotColor]);

  const downloadQR = async () => {
    const QRCodeStylingModule = await import('qr-code-styling');
    const QRCodeStylingClass = QRCodeStylingModule.default;
    const tempQR = new QRCodeStylingClass({
      width: size,
      height: size,
      data: url,
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
      backgroundOptions: {
        color: 'transparent',
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareStyle,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotStyle,
      },
      qrOptions: {
        errorCorrectionLevel: errorLevel,
      },
    });
    tempQR.download({ name: 'qrcode', extension: 'png' });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };

  const getContrastRatio = () => {
    const fg = hexToRgb(fgColor);
    const bg = hexToRgb(bgColor);

    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(fg.r, fg.g, fg.b);
    const l2 = getLuminance(bg.r, bg.g, bg.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  const contrastRatio = getContrastRatio();
  const isLowContrast = contrastRatio < 3;

  return (
    <ToolPageLayout
      title="QR Generator"
      subtitle="Styled QR Code Tool"
      innerClassName={styles.content}
      headerClassName={styles.header}
    >
      <main className={styles.main}>
        <div className={styles.preview}>
          <div className={styles.qrContainer} style={{ backgroundColor: bgColor }}>
            <div ref={qrRef} />
          </div>
          <button className={form.downloadButton} onClick={downloadQR}>
            Download PNG
          </button>
        </div>

        <div className={styles.controls}>
          <div className={form.controlGroup}>
            <label htmlFor="url" className={form.controlLabel}>URL / Text</label>
            <input
              id="url"
              type="text"
              className={form.textInput}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or text"
            />
          </div>

          <div className={form.sectionTitle}>Colors</div>

          <div className={form.controlGroup}>
            <label htmlFor="fgColor" className={form.controlLabel}>Dot Color</label>
            <div className={form.colorInput}>
              <input
                id="fgColor"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className={`${form.textInput} ${form.colorText}`}
              />
            </div>
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="cornerSquareColor" className={form.controlLabel}>Corner Square Color</label>
            <div className={form.colorInput}>
              <input
                id="cornerSquareColor"
                type="color"
                value={cornerSquareColor}
                onChange={(e) => setCornerSquareColor(e.target.value)}
              />
              <input
                type="text"
                value={cornerSquareColor}
                onChange={(e) => setCornerSquareColor(e.target.value)}
                className={`${form.textInput} ${form.colorText}`}
              />
            </div>
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="cornerDotColor" className={form.controlLabel}>Corner Dot Color</label>
            <div className={form.colorInput}>
              <input
                id="cornerDotColor"
                type="color"
                value={cornerDotColor}
                onChange={(e) => setCornerDotColor(e.target.value)}
              />
              <input
                type="text"
                value={cornerDotColor}
                onChange={(e) => setCornerDotColor(e.target.value)}
                className={`${form.textInput} ${form.colorText}`}
              />
            </div>
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="bgColor" className={form.controlLabel}>Background Color</label>
            <div className={form.colorInput}>
              <input
                id="bgColor"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className={`${form.textInput} ${form.colorText}`}
              />
            </div>
            <small className={form.controlHint}>Download will have transparent background</small>
          </div>

          {isLowContrast && (
            <div className={form.warning}>
              Low contrast may cause scanning issues
            </div>
          )}

          <div className={form.sectionTitle}>Styles</div>

          <div className={form.controlGroup}>
            <label htmlFor="dotStyle" className={form.controlLabel}>Dot Style</label>
            <select
              id="dotStyle"
              className={form.select}
              value={dotStyle}
              onChange={(e) => setDotStyle(e.target.value as DotType)}
            >
              {dotStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="cornerSquareStyle" className={form.controlLabel}>Corner Square Style</label>
            <select
              id="cornerSquareStyle"
              className={form.select}
              value={cornerSquareStyle}
              onChange={(e) => setCornerSquareStyle(e.target.value as CornerSquareType)}
            >
              {cornerSquareStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="cornerDotStyle" className={form.controlLabel}>Corner Dot Style</label>
            <select
              id="cornerDotStyle"
              className={form.select}
              value={cornerDotStyle}
              onChange={(e) => setCornerDotStyle(e.target.value as CornerDotType)}
            >
              {cornerDotStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className={form.sectionTitle}>Size & Quality</div>

          <div className={form.controlGroup}>
            <label htmlFor="size" className={form.controlLabel}>Size: {size}px</label>
            <input
              id="size"
              type="range"
              className={form.rangeSlider}
              min="128"
              max="512"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          <div className={form.controlGroup}>
            <label htmlFor="errorLevel" className={form.controlLabel}>Error Correction</label>
            <select
              id="errorLevel"
              className={form.select}
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
            <small className={form.controlHint}>Higher levels allow more damage but increase density</small>
          </div>
        </div>
      </main>
    </ToolPageLayout>
  );
}
