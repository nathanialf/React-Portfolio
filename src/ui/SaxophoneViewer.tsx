'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MIDIController } from '../lib/midi/midi-controller';
import { AudioSynth } from '../lib/midi/audio-synth';
import { getFingeringForNote, getNoteForMesh, isClickableKey } from '../lib/midi/note-mapping';
import styles from '../styles/SaxophoneViewer.module.css';

// Parts that use specific materials
const rollerParts = [
  'nurbsToPoly138', 'nurbsToPoly139', 'nurbsToPoly860', 'nurbsToPoly861', 'nurbsToPoly862',
];

const pearlParts = [
  'nurbsToPoly265', 'nurbsToPoly267', 'nurbsToPoly269', 'nurbsToPoly273',
  'nurbsToPoly280', 'nurbsToPoly282', 'nurbsToPoly284', 'nurbsToPoly286', 'nurbsToPoly314',
];

const keyParts = [
  'nurbsToPoly30', 'nurbsToPoly266', 'nurbsToPoly268', 'nurbsToPoly270', 'nurbsToPoly274',
  'nurbsToPoly281', 'nurbsToPoly283', 'nurbsToPoly285', 'nurbsToPoly287', 'nurbsToPoly290',
  'nurbsToPoly315', 'nurbsToPoly459', 'nurbsToPoly460', 'nurbsToPoly461',
];

const reedParts = ['nurbsToPoly1'];

interface SaxophoneViewerProps {
  onLoad?: () => void;
}

export default function SaxophoneViewer({ onLoad }: SaxophoneViewerProps) {
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Refs for interaction
  const isDraggingRef = useRef(false);
  const previousMouseXRef = useRef(0);
  const rotationVelocityRef = useRef(0);
  const targetRotationYRef = useRef(Math.PI / 4);

  // Refs for MIDI/Audio
  const midiControllerRef = useRef<MIDIController | null>(null);
  const audioSynthRef = useRef<AudioSynth | null>(null);
  const currentMidiNoteRef = useRef<number | null>(null);
  const midiInitializedRef = useRef(false);

  // Material refs
  const materialsRef = useRef<{
    glass: THREE.ShaderMaterial | null;
    glassBack: THREE.ShaderMaterial | null;
    roller: THREE.MeshBasicMaterial | null;
    pearl: THREE.ShaderMaterial | null;
    key: THREE.MeshBasicMaterial | null;
    reed: THREE.ShaderMaterial | null;
    midiHighlight: THREE.MeshBasicMaterial | null;
  }>({
    glass: null,
    glassBack: null,
    roller: null,
    pearl: null,
    key: null,
    reed: null,
    midiHighlight: null,
  });

  // Mesh lookup refs
  const meshByNameRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const backMeshByNameRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const midiHighlightedMeshesRef = useRef<Set<string>>(new Set());
  const originalMaterialsRef = useRef<Map<string, THREE.Material>>(new Map());

  // Initialize MIDI
  const initMidi = async () => {
    if (midiInitializedRef.current) return;
    midiInitializedRef.current = true;

    audioSynthRef.current?.init();
    const success = await midiControllerRef.current?.init();
    if (success) {
      const devices = midiControllerRef.current?.getConnectedDevices() || [];
      if (devices.length > 0) {
        console.log('MIDI ready. Connected devices:', devices.map((d: { name: string }) => d.name).join(', '));
      }
    }
  };

  // Main Three.js setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Initialize MIDI controller and audio synth
    midiControllerRef.current = new MIDIController();
    audioSynthRef.current = new AudioSynth();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    const blueLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const orangeLight = new THREE.DirectionalLight(0xff6a00, 0.2);
    orangeLight.position.set(-5, 3, -5);
    scene.add(orangeLight);

    // Create materials
    const edgeGlowUniforms = {
      uTime: { value: 0 },
      uBlueColor: { value: new THREE.Color(0x00d4ff) },
      uOrangeColor: { value: new THREE.Color(0xff6a00) },
    };

    const edgeGlowVertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      varying vec2 vScreenPos;

      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
        vScreenPos = gl_Position.xy / gl_Position.w;
      }
    `;

    const edgeGlowFragmentShader = `
      uniform float uTime;
      uniform vec3 uBlueColor;
      uniform vec3 uOrangeColor;

      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      varying vec2 vScreenPos;

      #define PI 3.14159265359
      #define TAU 6.28318530718

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewDir);

        float fresnel = 1.0 - abs(dot(normal, viewDir));
        fresnel = pow(fresnel, 1.8);
        float edgeMask = smoothstep(0.15, 0.5, fresnel);

        float t = uTime;

        float orbitSpeed = 0.1;
        float sweepDuration = 3.0;
        float sweepEvery = 12.0;

        float timeSinceCycle = mod(t, sweepEvery);
        float completedSweeps = floor(t / sweepEvery);
        float cycleStart = completedSweeps * sweepEvery;

        float cycleProgress = timeSinceCycle / sweepEvery;
        float sweepMidpoint = (sweepDuration * 0.5) / sweepEvery;
        float sizeOscillation = (cos((cycleProgress - sweepMidpoint) * TAU) + 1.0) * 0.5;

        float baseSpread = 0.3;
        float maxSpread = 1.2;
        float spread = mix(baseSpread, maxSpread, sizeOscillation);

        float sweepProgress = clamp(timeSinceCycle / sweepDuration, 0.0, 1.0);
        float isSweeping = timeSinceCycle < sweepDuration ? 1.0 : 0.0;
        float eased = sweepProgress * sweepProgress * (3.0 - 2.0 * sweepProgress);

        float forwardAmount = sin(eased * PI) * 2.0 * isSweeping;
        float sweepBlend = sin(sweepProgress * PI) * isSweeping;

        float angleAtSweepStart = cycleStart * orbitSpeed * TAU + completedSweeps * PI;
        float angleAtSweepEnd = (cycleStart + sweepDuration) * orbitSpeed * TAU + (completedSweeps + 1.0) * PI;

        float angle;
        if (isSweeping > 0.5) {
          angle = mix(angleAtSweepStart, angleAtSweepEnd, eased);
        } else {
          angle = t * orbitSpeed * TAU + (completedSweeps + 1.0) * PI;
        }

        vec3 lightDir = normalize(vec3(cos(angle), sin(angle), forwardAmount));

        float lightDot = dot(normal, lightDir);
        float rimLight = max(0.0, lightDot);
        float edgeFactor = mix(edgeMask, 0.3 + edgeMask * 0.7, sweepBlend);
        float lightIntensity = rimLight * edgeFactor;
        lightIntensity = smoothstep(0.0, spread, lightIntensity);

        float angleDiff = atan(normal.y, normal.x) - atan(lightDir.y, lightDir.x);
        angleDiff = mod(angleDiff + PI, TAU) - PI;

        float orangeLead = smoothstep(0.6, 0.1, angleDiff) * smoothstep(-0.1, 0.15, angleDiff);
        float blueTrail = smoothstep(-0.6, -0.1, angleDiff) * smoothstep(0.1, -0.15, angleDiff);
        float whiteCore = smoothstep(0.5, 0.0, abs(angleDiff));

        float slowOrbitSpeed = 0.03;
        float slowAngle = t * slowOrbitSpeed * TAU;
        vec3 slowLightDir = normalize(vec3(cos(slowAngle), sin(slowAngle), 0.2));

        float slowRimLight = max(0.0, dot(normal, slowLightDir));
        float slowEdgeFactor = edgeMask * 0.5 + 0.2;
        float slowIntensity = slowRimLight * slowEdgeFactor;
        slowIntensity = smoothstep(0.0, 0.8, slowIntensity);

        float slowAngleDiff = atan(normal.y, normal.x) - atan(slowLightDir.y, slowLightDir.x);
        slowAngleDiff = mod(slowAngleDiff + PI, TAU) - PI;
        float slowGlow = smoothstep(1.0, 0.0, abs(slowAngleDiff));

        vec3 baseColor = vec3(0.008);

        vec3 lightColor = uOrangeColor * orangeLead * 5.0
                        + vec3(1.0) * whiteCore * 4.0
                        + uBlueColor * blueTrail * 5.0;

        lightColor *= lightIntensity;
        lightColor += uBlueColor * slowGlow * slowIntensity * 0.4;

        vec3 finalColor = baseColor + lightColor * 0.7;

        float alpha = 0.35 + edgeMask * 0.3;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    materialsRef.current.glassBack = new THREE.ShaderMaterial({
      uniforms: edgeGlowUniforms,
      vertexShader: edgeGlowVertexShader,
      fragmentShader: edgeGlowFragmentShader,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    materialsRef.current.glass = new THREE.ShaderMaterial({
      uniforms: edgeGlowUniforms,
      vertexShader: edgeGlowVertexShader,
      fragmentShader: edgeGlowFragmentShader,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: true,
      blending: THREE.NormalBlending,
    });

    materialsRef.current.roller = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    materialsRef.current.pearl = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;
        varying vec2 vUv;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldPos;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 pos = vWorldPos.xy * 15.0;
          float pattern = 0.0;
          pattern += snoise(pos * 1.0 + vec2(snoise(pos * 0.5), 0.0)) * 0.5;
          pattern += snoise(pos * 2.0 + vec2(0.0, snoise(pos * 0.7))) * 0.25;
          pattern += snoise(pos * 4.0) * 0.125;
          pattern = pattern * 0.5 + 0.5;

          float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
          fresnel = pow(fresnel, 2.0);

          vec3 color1 = vec3(0.45, 0.42, 0.4);
          vec3 color2 = vec3(0.35, 0.45, 0.5);
          vec3 color3 = vec3(0.5, 0.38, 0.45);
          vec3 color4 = vec3(0.4, 0.48, 0.38);

          vec3 baseColor = mix(color1, color2, pattern);
          baseColor = mix(baseColor, color3, fresnel * 0.6);
          baseColor = mix(baseColor, color4, sin(pattern * 6.28 + fresnel * 3.0) * 0.3 + 0.3);

          float shimmer = pow(fresnel, 3.0) * 0.3;
          baseColor += shimmer;

          float linesDark = smoothstep(0.4, 0.6, pattern);
          baseColor *= 0.7 + linesDark * 0.3;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    materialsRef.current.key = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    materialsRef.current.reed = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
          fresnel = pow(fresnel, 2.0);

          vec3 baseColor = vec3(0.15, 0.15, 0.14);
          vec3 edgeColor = vec3(0.4, 0.4, 0.38);

          vec3 finalColor = mix(baseColor, edgeColor, fresnel);
          float alpha = 0.15 + fresnel * 0.2;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    materialsRef.current.midiHighlight = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: false,
      side: THREE.DoubleSide,
      depthTest: true,
    });

    // Clock for animation
    clockRef.current = new THREE.Clock();

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/midi/models/saxophone.glb',
      async (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        const glassBackMeshes: { mesh: THREE.Mesh; parent: THREE.Object3D; originalName: string }[] = [];

        // Collect all meshes first
        const meshes: THREE.Mesh[] = [];
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshes.push(child as THREE.Mesh);
          }
        });

        // Process meshes in chunks, yielding to main thread between chunks
        const chunkSize = 10;
        for (let i = 0; i < meshes.length; i += chunkSize) {
          const chunk = meshes.slice(i, i + chunkSize);

          for (const mesh of chunk) {
            mesh.geometry = BufferGeometryUtils.mergeVertices(mesh.geometry);
            mesh.geometry.computeVertexNormals();

            if (rollerParts.includes(mesh.name)) {
              mesh.material = materialsRef.current.roller!;
            } else if (pearlParts.includes(mesh.name)) {
              mesh.material = materialsRef.current.pearl!;
            } else if (reedParts.includes(mesh.name)) {
              mesh.material = materialsRef.current.reed!;
            } else {
              mesh.material = materialsRef.current.glass!;

              const backMesh = mesh.clone();
              backMesh.material = materialsRef.current.glassBack!;
              backMesh.renderOrder = -1;
              backMesh.name = mesh.name + '_back';
              glassBackMeshes.push({ mesh: backMesh, parent: mesh.parent!, originalName: mesh.name });
            }

            if (mesh.name) {
              meshByNameRef.current.set(mesh.name, mesh);
            }
          }

          // Yield to main thread to allow animations to run
          if (i + chunkSize < meshes.length) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        for (const { mesh, parent, originalName } of glassBackMeshes) {
          parent.add(mesh);
          if (originalName) {
            backMeshByNameRef.current.set(originalName, mesh);
          }
        }

        // Center and scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        model.scale.setScalar(scale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.sub(scaledCenter);

        targetRotationYRef.current = Math.PI + Math.PI / 4;
        scene.add(model);

        setIsLoading(false);
        onLoadRef.current?.();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    // MIDI event handlers
    const handleNoteOn = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const fingering = getFingeringForNote(detail.note);
      for (const meshName of fingering) {
        highlightMidiKey(meshName);
      }
      audioSynthRef.current?.noteOn(detail.note, detail.velocity);
    };

    const handleNoteOff = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const fingering = getFingeringForNote(detail.note);
      for (const meshName of fingering) {
        unhighlightMidiKey(meshName);
      }
      audioSynthRef.current?.noteOff(detail.note);
    };

    midiControllerRef.current.addEventListener('noteon', handleNoteOn);
    midiControllerRef.current.addEventListener('noteoff', handleNoteOff);

    // Highlight functions
    function getMaterialForMesh(meshName: string) {
      if (rollerParts.includes(meshName)) return materialsRef.current.roller;
      if (pearlParts.includes(meshName)) return materialsRef.current.pearl;
      if (keyParts.includes(meshName)) return materialsRef.current.key;
      if (reedParts.includes(meshName)) return materialsRef.current.reed;
      return materialsRef.current.glass;
    }

    function highlightMidiKey(meshName: string) {
      const mesh = meshByNameRef.current.get(meshName);
      if (!mesh || midiHighlightedMeshesRef.current.has(meshName)) return;

      if (!originalMaterialsRef.current.has(mesh.uuid)) {
        originalMaterialsRef.current.set(mesh.uuid, mesh.material as THREE.Material);
      }

      mesh.material = materialsRef.current.midiHighlight!;
      midiHighlightedMeshesRef.current.add(meshName);

      const backMesh = backMeshByNameRef.current.get(meshName);
      if (backMesh) {
        if (!originalMaterialsRef.current.has(backMesh.uuid)) {
          originalMaterialsRef.current.set(backMesh.uuid, backMesh.material as THREE.Material);
        }
        backMesh.material = materialsRef.current.midiHighlight!;
      }
    }

    function unhighlightMidiKey(meshName: string) {
      const mesh = meshByNameRef.current.get(meshName);
      if (!mesh || !midiHighlightedMeshesRef.current.has(meshName)) return;

      mesh.material = getMaterialForMesh(meshName)!;

      const backMesh = backMeshByNameRef.current.get(meshName);
      if (backMesh) {
        backMesh.material = materialsRef.current.glassBack!;
      }

      midiHighlightedMeshesRef.current.delete(meshName);
    }

    // Track if we clicked on a key (to prevent rotation while playing)
    const clickedOnKeyRef = { current: false };

    // Mouse/touch handlers for rotation
    const handleMouseDown = (e: MouseEvent) => {
      // Check if clicking on a key first
      clickedOnKeyRef.current = false;

      if (modelRef.current) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const meshes: THREE.Mesh[] = [];
        modelRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
        });

        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          let meshName = intersects[0].object.name;
          if (meshName.endsWith('_back')) {
            meshName = meshName.slice(0, -5);
          }

          if (isClickableKey(meshName)) {
            const note = getNoteForMesh(meshName);
            if (note !== null) {
              clickedOnKeyRef.current = true;
              if (currentMidiNoteRef.current !== null) {
                midiControllerRef.current?.noteOff(currentMidiNoteRef.current);
              }
              currentMidiNoteRef.current = note;
              midiControllerRef.current?.noteOn(note, 127);
            }
          }
        }
      }

      // Only start dragging if we didn't click on a key
      if (!clickedOnKeyRef.current) {
        isDraggingRef.current = true;
        previousMouseXRef.current = e.clientX;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const delta = e.clientX - previousMouseXRef.current;
        rotationVelocityRef.current = delta * 0.005;
        targetRotationYRef.current += rotationVelocityRef.current;
        previousMouseXRef.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Check if touching a key first
      clickedOnKeyRef.current = false;

      if (modelRef.current && e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const meshes: THREE.Mesh[] = [];
        modelRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
        });

        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          let meshName = intersects[0].object.name;
          if (meshName.endsWith('_back')) {
            meshName = meshName.slice(0, -5);
          }

          if (isClickableKey(meshName)) {
            const note = getNoteForMesh(meshName);
            if (note !== null) {
              clickedOnKeyRef.current = true;
              if (currentMidiNoteRef.current !== null) {
                midiControllerRef.current?.noteOff(currentMidiNoteRef.current);
              }
              currentMidiNoteRef.current = note;
              midiControllerRef.current?.noteOn(note, 127);
            }
          }
        }
      }

      // Only start dragging if we didn't touch a key
      if (!clickedOnKeyRef.current) {
        isDraggingRef.current = true;
        previousMouseXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isDraggingRef.current) {
        const delta = e.touches[0].clientX - previousMouseXRef.current;
        rotationVelocityRef.current = delta * 0.005;
        targetRotationYRef.current += rotationVelocityRef.current;
        previousMouseXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      // Release any playing note
      if (currentMidiNoteRef.current !== null) {
        midiControllerRef.current?.noteOff(currentMidiNoteRef.current);
        currentMidiNoteRef.current = null;
      }
    };

    const handleMouseUpNote = () => {
      if (currentMidiNoteRef.current !== null) {
        midiControllerRef.current?.noteOff(currentMidiNoteRef.current);
        currentMidiNoteRef.current = null;
      }
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mouseup', handleMouseUpNote);
    canvas.addEventListener('mouseleave', handleMouseUpNote);

    // Init MIDI on first interaction
    const initMidiOnce = () => {
      initMidi();
      canvas.removeEventListener('click', initMidiOnce);
      canvas.removeEventListener('touchstart', initMidiOnce);
    };
    canvas.addEventListener('click', initMidiOnce);
    canvas.addEventListener('touchstart', initMidiOnce);

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Waveform drawing
    let waveformDataArray: Uint8Array | null = null;
    let smoothedWaveform: Float32Array | null = null;
    const waveformBars = 16;

    function drawWaveform() {
      const analyser = audioSynthRef.current?.getAnalyser();
      const waveformCanvas = waveformRef.current;
      if (!analyser || !audioSynthRef.current?.isPlaying() || !waveformCanvas) {
        if (waveformCanvas) waveformCanvas.classList.remove(styles.waveformActive);
        return;
      }

      waveformCanvas.classList.add(styles.waveformActive);

      if (!waveformDataArray) {
        waveformDataArray = new Uint8Array(analyser.frequencyBinCount);
        smoothedWaveform = new Float32Array(waveformBars);
      }

      analyser.getByteTimeDomainData(waveformDataArray);

      const ctx = waveformCanvas.getContext('2d');
      if (!ctx) return;

      const width = waveformCanvas.width;
      const height = waveformCanvas.height;
      const centerY = height / 2;

      const step = Math.floor(waveformDataArray.length / waveformBars);
      for (let i = 0; i < waveformBars; i++) {
        const rawValue = (waveformDataArray[i * step] - 128) / 128.0;
        smoothedWaveform![i] = smoothedWaveform![i] * 0.7 + Math.abs(rawValue) * 0.3;
      }

      ctx.clearRect(0, 0, width, height);

      const barWidth = 1;
      const barGap = 6;
      const totalWidth = waveformBars * barWidth + (waveformBars - 1) * barGap;
      const startX = (width - totalWidth) / 2;

      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < waveformBars; i++) {
        const x = startX + i * (barWidth + barGap);
        const barHeight = smoothedWaveform![i] * height * 0.9;
        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
      }
    }

    // Animation loop
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = clockRef.current?.getElapsedTime() || 0;

      // Update shader uniforms
      if (materialsRef.current.glass) {
        (materialsRef.current.glass.uniforms as { uTime: { value: number } }).uTime.value = time;
      }

      // Rotate model
      if (modelRef.current) {
        if (!isDraggingRef.current) {
          rotationVelocityRef.current *= 0.95;
          targetRotationYRef.current += rotationVelocityRef.current;
        }
        modelRef.current.rotation.y = targetRotationYRef.current;
      }

      drawWaveform();
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mouseup', handleMouseUpNote);
      canvas.removeEventListener('mouseleave', handleMouseUpNote);
      window.removeEventListener('resize', handleResize);

      midiControllerRef.current?.removeEventListener('noteon', handleNoteOn);
      midiControllerRef.current?.removeEventListener('noteoff', handleNoteOff);

      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {isLoading && (
        <div className={styles.loading}>
          LOADING <span className={styles.spinner} />
        </div>
      )}
      <canvas ref={waveformRef} className={styles.waveform} width={120} height={200} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
