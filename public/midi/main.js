import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { MIDIController } from '/midi/js/midi-controller.js';
import { getFingeringForNote, getNoteForMesh, isClickableKey, TENOR_RANGE } from '/midi/js/note-mapping.js';
import { AudioSynth } from '/midi/js/audio-synth.js';

// MIDI Controller
const midiController = new MIDIController();

// Audio Synthesizer
const audioSynth = new AudioSynth();
const meshByName = new Map(); // mesh name -> mesh object
const backMeshByName = new Map(); // mesh name -> back-face mesh object
const midiHighlightedMeshes = new Set(); // currently highlighted mesh names
let currentMidiNote = null; // currently playing note (for click-and-hold)

// Debug mode
let debugMode = false;
let selectedMesh = null;
let partNames = {}; // Map of mesh uuid -> custom name
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Pre-defined part labels (mesh name -> label)
const partLabels = {
    'nurbsToPoly1': 'Reed',
    'nurbsToPoly13': 'Ligature Bottom Screw',
    'nurbsToPoly15': 'Ligature Top Screw',
    'nurbsToPoly16': 'Ligature',
    'nurbsToPoly18': 'Top E Pad',
    'nurbsToPoly19': 'Top F# Pad',
    'nurbsToPoly20': 'Top D Pad',
    'nurbsToPoly21': 'Top F Pad',
    'nurbsToPoly22': 'Top D# Pad',
    'nurbsToPoly24': 'Lyre Screw',
    'nurbsToPoly26': 'Octave Cushion',
    'nurbsToPoly27': 'Body (Neck through Bell)',
    'nurbsToPoly29': 'Mouthpiece Cork',
    'nurbsToPoly30': 'Mouthpiece',
    'nurbsToPoly33': 'Upper Octave Key',
    'nurbsToPoly70': 'Low B and Bb Guard',
    'nurbsToPoly71': 'Low C and C# Guard',
    'nurbsToPoly81': 'Low Bb Pad',
    'nurbsToPoly82': 'Low Bb Pad Cushion',
    'nurbsToPoly83': 'Low B Pad',
    'nurbsToPoly84': 'Low B Pad Cushion',
    'nurbsToPoly85': 'Low C# Pad',
    'nurbsToPoly86': 'Low C# Pad Cushion',
    'nurbsToPoly87': 'Low C Pad',
    'nurbsToPoly88': 'Low C Pad Cushion',
    'nurbsToPoly89': 'Low Eb / D# Pad',
    'nurbsToPoly90': 'Low Eb / D# Pad Cushion',
    'nurbsToPoly91': 'D Pad',
    'nurbsToPoly92': 'D Pad Cushion',
    'nurbsToPoly93': 'E Pad',
    'nurbsToPoly94': 'E Pad Cushion',
    'nurbsToPoly95': 'F Pad',
    'nurbsToPoly96': 'F Pad Cushion',
    'nurbsToPoly97': 'F# Pad',
    'nurbsToPoly98': 'F# Pad Cushion',
    'nurbsToPoly99': 'G# Pad',
    'nurbsToPoly100': 'G# Pad Cushion',
    'nurbsToPoly101': 'G Pad',
    'nurbsToPoly102': 'G Pad Cushion',
    'nurbsToPoly103': 'A Pad',
    'nurbsToPoly104': 'A Pad Cushion',
    'nurbsToPoly105': 'Bb bis Pad',
    'nurbsToPoly106': 'Bb bis Pad Cushion',
    'nurbsToPoly107': 'B Pad',
    'nurbsToPoly108': 'B Pad Cushion',
    'nurbsToPoly109': 'Side C Pad',
    'nurbsToPoly110': 'Side C Pad Cushion',
    'nurbsToPoly111': 'Side Bb Pad',
    'nurbsToPoly112': 'Side Bb Pad Cushion',
    'nurbsToPoly124': 'Low Eb / D# Lever',
    'nurbsToPoly125': 'Low C Lever',
    'nurbsToPoly138': 'Low Eb / D# Roller',
    'nurbsToPoly139': 'Low C Roller',
    'nurbsToPoly163': 'Side F# Pad',
    'nurbsToPoly164': 'Side F# Pad Cushion',
    'nurbsToPoly247': 'Side C Lever',
    'nurbsToPoly248': 'Side Bb Lever',
    'nurbsToPoly249': 'Top E Lever',
    'nurbsToPoly251': 'Top F# Lever',
    'nurbsToPoly265': 'E Pearl',
    'nurbsToPoly266': 'E Key',
    'nurbsToPoly267': 'D Pearl',
    'nurbsToPoly268': 'D Key',
    'nurbsToPoly269': 'F Pearl',
    'nurbsToPoly270': 'F Key',
    'nurbsToPoly273': 'Side F# Pearl',
    'nurbsToPoly274': 'Side F# Key',
    'nurbsToPoly280': 'B Pearl',
    'nurbsToPoly281': 'B Key',
    'nurbsToPoly282': 'Bb bis Pearl',
    'nurbsToPoly283': 'Bb bis Key',
    'nurbsToPoly284': 'G Pearl',
    'nurbsToPoly285': 'G Key',
    'nurbsToPoly286': 'A Pearl',
    'nurbsToPoly287': 'A Key',
    'nurbsToPoly290': 'Front F Key',
    'nurbsToPoly314': 'G# Pearl',
    'nurbsToPoly315': 'G# Key',
    'nurbsToPoly459': 'Top D Key',
    'nurbsToPoly460': 'Top F Key',
    'nurbsToPoly461': 'Top D# Key',
    'nurbsToPoly579': 'Octave Thumb Key',
    'nurbsToPoly820': 'Bow',
    'nurbsToPoly854': 'Low C# Lever',
    'nurbsToPoly858': 'Low B Lever',
    'nurbsToPoly860': 'Low C# Roller',
    'nurbsToPoly861': 'Low B Roller',
    'nurbsToPoly862': 'Low Bb Roller',
    'nurbsToPoly890': 'Neckstrap Ring',
    'nurbsToPoly896': 'Low Bb Lever',
    'nurbsToPoly899': 'Thumbrest',
    'nurbsToPoly902': 'Thumbrest Screw',
    'nurbsToPoly925': 'Low Eb / D# Guard',
    'nurbsToPoly933': 'Side F# Guard',
};

// Status display with spinner
const statusEl = document.getElementById('status');
const spinnerFrames = ['|', '/', '-', '\\'];
let spinnerIndex = 0;
let spinnerInterval = null;

function startLoadingSpinner() {
    statusEl.style.display = 'block';
    spinnerInterval = setInterval(() => {
        statusEl.textContent = `LOADING ${spinnerFrames[spinnerIndex]}`;
        spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
    }, 150);
}

function stopLoadingSpinner() {
    if (spinnerInterval) {
        clearInterval(spinnerInterval);
        spinnerInterval = null;
    }
    statusEl.style.display = 'none';
}

startLoadingSpinner();

// Scene setup
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x0a0a0a);

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Lighting - minimal, let shader do the work
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

// Subtle blue accent light
const blueLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
blueLight.position.set(5, 5, 5);
scene.add(blueLight);

// Subtle orange accent light
const orangeLight = new THREE.DirectionalLight(0xff6a00, 0.2);
orangeLight.position.set(-5, 3, -5);
scene.add(orangeLight);

// Edge glow shader
const edgeGlowShader = {
    uniforms: {
        uTime: { value: 0 },
        uBlueColor: { value: new THREE.Color(0x00d4ff) },
        uOrangeColor: { value: new THREE.Color(0xff6a00) },
    },
    vertexShader: `
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
    `,
    fragmentShader: `
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
            // Renormalize interpolated vectors to fix checkerboard artifacts
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewDir);

            // Edge detection with softened fresnel
            float fresnel = 1.0 - abs(dot(normal, viewDir));
            fresnel = pow(fresnel, 1.8);
            float edgeMask = smoothstep(0.15, 0.5, fresnel);

            float t = uTime;

            // === VIEW-SPACE RIM LIGHT WITH CROSS-SCREEN SWEEP ===
            float orbitSpeed = 0.1;
            float sweepDuration = 3.0;
            float sweepEvery = 12.0;

            float timeSinceCycle = mod(t, sweepEvery);
            float completedSweeps = floor(t / sweepEvery);
            float cycleStart = completedSweeps * sweepEvery;

            // Slow size variation that peaks during sweep
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

            float pastSweepThisCycle = (timeSinceCycle >= sweepDuration) ? 1.0 : 0.0;

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

            // === SECOND LIGHT: Slow orbiting dull blue ===
            float slowOrbitSpeed = 0.03;
            float slowAngle = t * slowOrbitSpeed * TAU;
            vec3 slowLightDir = normalize(vec3(cos(slowAngle), sin(slowAngle), 0.2));

            float slowRimLight = max(0.0, dot(normal, slowLightDir));
            float slowEdgeFactor = edgeMask * 0.5 + 0.2;
            float slowIntensity = slowRimLight * slowEdgeFactor;
            slowIntensity = smoothstep(0.0, 0.8, slowIntensity); // Wider/softer falloff

            float slowAngleDiff = atan(normal.y, normal.x) - atan(slowLightDir.y, slowLightDir.x);
            slowAngleDiff = mod(slowAngleDiff + PI, TAU) - PI;
            float slowGlow = smoothstep(1.0, 0.0, abs(slowAngleDiff)); // Much wider glow

            // === FINAL COLOR ===
            vec3 baseColor = vec3(0.008);

            vec3 lightColor = uOrangeColor * orangeLead * 5.0
                            + vec3(1.0) * whiteCore * 4.0
                            + uBlueColor * blueTrail * 5.0;

            lightColor *= lightIntensity;

            // Add slow blue glow (independent of main light sweep)
            lightColor += uBlueColor * slowGlow * slowIntensity * 0.4;


            vec3 finalColor = baseColor + lightColor * 0.7;

            float alpha = 0.35 + edgeMask * 0.3;
            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};

// Back face material - rendered first
const glassBackMaterial = new THREE.ShaderMaterial({
    uniforms: edgeGlowShader.uniforms,
    vertexShader: edgeGlowShader.vertexShader,
    fragmentShader: edgeGlowShader.fragmentShader,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.NormalBlending,
});

// Front face material - rendered on top
const glassMaterial = new THREE.ShaderMaterial({
    uniforms: edgeGlowShader.uniforms,
    vertexShader: edgeGlowShader.vertexShader,
    fragmentShader: edgeGlowShader.fragmentShader,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: true,
    blending: THREE.NormalBlending,
});

// Solid black material for rollers
const rollerMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
});

// Parts that should use roller material
const rollerParts = [
    'nurbsToPoly138', // Low Eb / D# Roller
    'nurbsToPoly139', // Low C Roller
    'nurbsToPoly860', // Low C# Roller
    'nurbsToPoly861', // Low B Roller
    'nurbsToPoly862', // Low Bb Roller
];

// Iridescent damascus shader for pearls
const pearlShader = {
    uniforms: {
        uTime: { value: 0 },
    },
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

        // Simplex noise function
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
            // Damascus pattern - layered wavy noise
            vec2 pos = vWorldPos.xy * 15.0;
            float pattern = 0.0;
            pattern += snoise(pos * 1.0 + vec2(snoise(pos * 0.5), 0.0)) * 0.5;
            pattern += snoise(pos * 2.0 + vec2(0.0, snoise(pos * 0.7))) * 0.25;
            pattern += snoise(pos * 4.0) * 0.125;
            pattern = pattern * 0.5 + 0.5; // normalize to 0-1

            // Iridescence based on view angle
            float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
            fresnel = pow(fresnel, 2.0);

            // Color shift based on angle and pattern
            float hueShift = fresnel * 0.5 + pattern * 0.3;

            // Darker mother of pearl colors
            vec3 color1 = vec3(0.45, 0.42, 0.4);   // dark cream
            vec3 color2 = vec3(0.35, 0.45, 0.5);   // dark blue
            vec3 color3 = vec3(0.5, 0.38, 0.45);   // dark pink
            vec3 color4 = vec3(0.4, 0.48, 0.38);   // dark green

            // Mix colors based on pattern and fresnel
            vec3 baseColor = mix(color1, color2, pattern);
            baseColor = mix(baseColor, color3, fresnel * 0.6);
            baseColor = mix(baseColor, color4, sin(pattern * 6.28 + fresnel * 3.0) * 0.3 + 0.3);

            // Add shimmer
            float shimmer = pow(fresnel, 3.0) * 0.3;
            baseColor += shimmer;

            // Darken the damascus lines
            float linesDark = smoothstep(0.4, 0.6, pattern);
            baseColor *= 0.7 + linesDark * 0.3;

            gl_FragColor = vec4(baseColor, 1.0);
        }
    `
};

const pearlMaterial = new THREE.ShaderMaterial({
    uniforms: pearlShader.uniforms,
    vertexShader: pearlShader.vertexShader,
    fragmentShader: pearlShader.fragmentShader,
    side: THREE.DoubleSide,
});

// Pearl parts
const pearlParts = [
    'nurbsToPoly265', // E Pearl
    'nurbsToPoly267', // D Pearl
    'nurbsToPoly269', // F Pearl
    'nurbsToPoly273', // Side F# Pearl
    'nurbsToPoly280', // B Pearl
    'nurbsToPoly282', // Bb bis Pearl
    'nurbsToPoly284', // G Pearl
    'nurbsToPoly286', // A Pearl
    'nurbsToPoly314', // G# Pearl
];

// Solid black material for keys
const keyMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
});

// Key parts (and mouthpiece)
const keyParts = [
    'nurbsToPoly30',  // Mouthpiece
    'nurbsToPoly266', // E Key
    'nurbsToPoly268', // D Key
    'nurbsToPoly270', // F Key
    'nurbsToPoly274', // Side F# Key
    'nurbsToPoly281', // B Key
    'nurbsToPoly283', // Bb bis Key
    'nurbsToPoly285', // G Key
    'nurbsToPoly287', // A Key
    'nurbsToPoly290', // Front F Key
    'nurbsToPoly315', // G# Key
    'nurbsToPoly459', // Top D Key
    'nurbsToPoly460', // Top F Key
    'nurbsToPoly461', // Top D# Key
];

// White glass material for reed
const reedMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
    },
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

// Reed part
const reedParts = [
    'nurbsToPoly1', // Reed
];


// Object rotation via drag (not camera orbit)
let isDragging = false;
let previousMouseX = 0;
let rotationVelocity = 0;
let targetRotationY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const delta = e.clientX - previousMouseX;
        rotationVelocity = delta * 0.005;
        targetRotationY += rotationVelocity;
        previousMouseX = e.clientX;
    }
});

canvas.addEventListener('mouseup', () => { isDragging = false; });
canvas.addEventListener('mouseleave', () => { isDragging = false; });

// Touch support
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMouseX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const delta = e.touches[0].clientX - previousMouseX;
        rotationVelocity = delta * 0.005;
        targetRotationY += rotationVelocity;
        previousMouseX = e.touches[0].clientX;
    }
});

canvas.addEventListener('touchend', () => { isDragging = false; });

// Prevent iOS overscroll and pinch zoom
document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scroll/overscroll on canvas
}, { passive: false });

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Model loading
const loader = new GLTFLoader();
let saxophoneModel = null;

loader.load(
    '/midi/models/saxophone.glb',
    (gltf) => {
        saxophoneModel = gltf.scene;
        let meshCount = 0;
        const glassBackMeshes = []; // Collect back-face clones to add after traversal

        // Apply material to all meshes and load pre-defined labels
        saxophoneModel.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                // Merge duplicate vertices and recompute smooth normals to fix alternating dark triangles
                child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
                child.geometry.computeVertexNormals();

                // Use special materials for specific parts
                if (rollerParts.includes(child.name)) {
                    child.material = rollerMaterial;
                } else if (pearlParts.includes(child.name)) {
                    child.material = pearlMaterial;
                } else if (reedParts.includes(child.name)) {
                    child.material = reedMaterial;
                } else {
                    // Glass parts: use front-face material, queue back-face clone
                    child.material = glassMaterial;

                    const backMesh = child.clone();
                    backMesh.material = glassBackMaterial;
                    backMesh.renderOrder = -1;
                    backMesh.name = child.name + '_back';
                    glassBackMeshes.push({ mesh: backMesh, parent: child.parent, originalName: child.name });
                }

                // Apply pre-defined label if exists
                if (child.name && partLabels[child.name]) {
                    partNames[child.uuid] = partLabels[child.name];
                }

                // Build mesh-by-name lookup for MIDI
                if (child.name) {
                    meshByName.set(child.name, child);
                }
            }
        });

        // Add back-face meshes after traversal
        for (const { mesh, parent, originalName } of glassBackMeshes) {
            parent.add(mesh);
            if (originalName) {
                backMeshByName.set(originalName, mesh);
            }
        }

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(saxophoneModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        saxophoneModel.scale.setScalar(scale);

        // Center the model AFTER scaling
        const scaledBox = new THREE.Box3().setFromObject(saxophoneModel);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        saxophoneModel.position.sub(scaledCenter);

        // Set initial rotation
        targetRotationY = Math.PI / 4;

        scene.add(saxophoneModel);

        // Hide loading spinner and show info button
        stopLoadingSpinner();
        document.getElementById('info').classList.add('visible');
    },
    undefined,
    (error) => {
        stopLoadingSpinner();
        statusEl.textContent = 'ERROR';
        statusEl.style.display = 'block';
        console.error('Error loading model:', error);
        createPlaceholder();
    }
);

// Placeholder geometry if model fails to load
function createPlaceholder() {
    console.log('Creating placeholder saxophone shape...');

    const group = new THREE.Group();

    // Main body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.25, 2.5, 32);
    const body = new THREE.Mesh(bodyGeometry, glassMaterial);
    body.rotation.z = Math.PI / 6;
    group.add(body);

    // Bell (cone)
    const bellGeometry = new THREE.ConeGeometry(0.5, 0.8, 32, 1, true);
    const bell = new THREE.Mesh(bellGeometry, glassMaterial);
    bell.position.set(-0.5, -1.4, 0);
    bell.rotation.z = Math.PI / 3;
    group.add(bell);

    // Neck (curved tube approximation)
    const neckCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.3, 1.1, 0),
        new THREE.Vector3(0.5, 1.4, 0),
        new THREE.Vector3(0.4, 1.7, 0),
        new THREE.Vector3(0.2, 1.9, 0)
    ]);
    const neckGeometry = new THREE.TubeGeometry(neckCurve, 20, 0.08, 16, false);
    const neck = new THREE.Mesh(neckGeometry, glassMaterial);
    group.add(neck);

    // Mouthpiece
    const mouthpieceGeometry = new THREE.ConeGeometry(0.06, 0.3, 16);
    const mouthpiece = new THREE.Mesh(mouthpieceGeometry, glassMaterial);
    mouthpiece.position.set(0.15, 2.05, 0);
    mouthpiece.rotation.z = -Math.PI / 4;
    group.add(mouthpiece);

    scene.add(group);
    saxophoneModel = group;
}

// Create 5-pointed starburst sprite
function createStarburstTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw 5 rays
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2; // Start from top
        const length = size * 0.45;

        // Gradient along ray
        const gradient = ctx.createLinearGradient(
            cx, cy,
            cx + Math.cos(angle) * length,
            cy + Math.sin(angle) * length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
        ctx.lineWidth = 3;
        ctx.strokeStyle = gradient;
        ctx.stroke();
    }

    // Bright center
    const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15);
    centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

const starburstTexture = createStarburstTexture();
const starburstMaterial = new THREE.SpriteMaterial({
    map: starburstTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

// Starbursts disabled
const starbursts = [];
const numStarbursts = 0;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smoothstep helper function (same as GLSL smoothstep)
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

// Waveform visualization
const waveformCanvas = document.getElementById('waveform');
const waveformCtx = waveformCanvas.getContext('2d');
waveformCanvas.width = 120;
waveformCanvas.height = 200;
let waveformDataArray = null;
let smoothedWaveform = null;
const waveformSmoothing = 0.3; // Lower = smoother (more averaging with previous frame)
const waveformBars = 16; // Number of vertical bars
const barGap = 6; // Gap between bars
const barWidth = 1; // Thin lines

function drawWaveform() {
    const analyser = audioSynth.getAnalyser();
    if (!analyser || !audioSynth.isPlaying()) {
        waveformCanvas.classList.remove('active');
        return;
    }

    waveformCanvas.classList.add('active');

    if (!waveformDataArray) {
        waveformDataArray = new Uint8Array(analyser.frequencyBinCount);
        smoothedWaveform = new Float32Array(waveformBars);
        for (let i = 0; i < waveformBars; i++) {
            smoothedWaveform[i] = 0;
        }
    }

    analyser.getByteTimeDomainData(waveformDataArray);

    const width = waveformCanvas.width;
    const height = waveformCanvas.height;
    const centerY = height / 2;

    // Sample and smooth the waveform data
    const step = Math.floor(waveformDataArray.length / waveformBars);
    for (let i = 0; i < waveformBars; i++) {
        // Get amplitude deviation from center (128 is silent)
        const rawValue = (waveformDataArray[i * step] - 128) / 128.0;
        // Frame averaging: blend with previous value
        smoothedWaveform[i] = smoothedWaveform[i] * (1 - waveformSmoothing) + Math.abs(rawValue) * waveformSmoothing;
    }

    // Clear canvas
    waveformCtx.clearRect(0, 0, width, height);

    // Draw vertical bars centered vertically
    const totalWidth = waveformBars * barWidth + (waveformBars - 1) * barGap;
    const startX = (width - totalWidth) / 2;

    waveformCtx.fillStyle = '#ffffff';

    for (let i = 0; i < waveformBars; i++) {
        const x = startX + i * (barWidth + barGap);
        const barHeight = smoothedWaveform[i] * height * 0.9; // Scale to 90% max height

        // Draw bar centered vertically (grows up and down from center)
        waveformCtx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
    }
}

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Update shader time
    edgeGlowShader.uniforms.uTime.value = time;

    // Update starburst positions based on light direction
    const orbitSpeed = 0.1;
    const sweepDuration = 3.0;
    const sweepEvery = 12.0;
    const timeSinceCycle = time % sweepEvery;
    const isSweeping = timeSinceCycle < sweepDuration;
    const completedSweeps = Math.floor(time / sweepEvery);
    const cycleStart = completedSweeps * sweepEvery;

    // Calculate light direction (same as shader)
    let angle;
    if (isSweeping) {
        const sweepProgress = timeSinceCycle / sweepDuration;
        const eased = sweepProgress * sweepProgress * (3 - 2 * sweepProgress);
        const angleAtStart = cycleStart * orbitSpeed * Math.PI * 2 + completedSweeps * Math.PI;
        const angleAtEnd = (cycleStart + sweepDuration) * orbitSpeed * Math.PI * 2 + (completedSweeps + 1) * Math.PI;
        angle = angleAtStart + (angleAtEnd - angleAtStart) * eased;
    } else {
        angle = time * orbitSpeed * Math.PI * 2 + (completedSweeps + 1) * Math.PI;
    }

    const lightDir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();

    // Find bright spots on the model - only on main body, not small parts
    const brightSpots = [];

    if (saxophoneModel) {
        const tempNormal = new THREE.Vector3();
        const tempPos = new THREE.Vector3();
        const viewDir = new THREE.Vector3();
        const normalMatrix = new THREE.Matrix3();

        saxophoneModel.traverse((child) => {
            // Only check the main body mesh (largest piece)
            // Skip all small parts - keys, pads, levers, etc.
            const isMainBody = child.name === 'nurbsToPoly27' || // Body (Neck through Bell)
                               child.name === 'nurbsToPoly820';   // Bow

            if (child.isMesh && isMainBody) {
                const geometry = child.geometry;
                if (geometry && geometry.attributes.position && geometry.attributes.normal) {
                    const positions = geometry.attributes.position;
                    const normals = geometry.attributes.normal;

                    // Update matrices
                    child.updateMatrixWorld();
                    normalMatrix.getNormalMatrix(child.matrixWorld);

                    // Sample more vertices for better coverage
                    const step = Math.max(1, Math.floor(positions.count / 100));
                    for (let i = 0; i < positions.count; i += step) {
                        tempNormal.fromBufferAttribute(normals, i);
                        tempPos.fromBufferAttribute(positions, i);

                        // Transform position to world space
                        tempPos.applyMatrix4(child.matrixWorld);

                        // Transform normal to world space
                        tempNormal.applyMatrix3(normalMatrix).normalize();

                        // Calculate view direction
                        viewDir.copy(camera.position).sub(tempPos).normalize();

                        // Fresnel / edge factor
                        const fresnel = 1.0 - Math.abs(tempNormal.dot(viewDir));
                        const edgeMask = smoothstep(0.15, 0.5, Math.pow(fresnel, 1.8));

                        // Rim light
                        const rimLight = Math.max(0, tempNormal.dot(lightDir));

                        // Sweep blend
                        const sweepProgress = timeSinceCycle / sweepDuration;
                        const sweepBlend = isSweeping ? Math.sin(sweepProgress * Math.PI) : 0;
                        const edgeFactor = edgeMask * 0.7 + 0.3 + sweepBlend * 0.3;

                        // Light intensity
                        const spread = 0.3 + sweepBlend * 0.9;
                        let lightIntensity = rimLight * edgeFactor;
                        lightIntensity = smoothstep(0, spread, lightIntensity);

                        // White core detection
                        const normalAngle = Math.atan2(tempNormal.y, tempNormal.x);
                        const lightAngle = Math.atan2(lightDir.y, lightDir.x);
                        let angleDiff = normalAngle - lightAngle;
                        angleDiff = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
                        const whiteCore = smoothstep(0.4, 0, Math.abs(angleDiff));

                        // Combined brightness - need high intensity AND white core
                        const brightness = whiteCore * lightIntensity;

                        // Higher threshold for starbursts
                        if (brightness > 0.55) {
                            const screenPos = tempPos.clone().project(camera);
                            brightSpots.push({
                                position: tempPos.clone(),
                                screenPos: new THREE.Vector2(screenPos.x, screenPos.y),
                                brightness: brightness
                            });
                        }
                    }
                }
            }
        });
    }

    // Sort by brightness
    brightSpots.sort((a, b) => b.brightness - a.brightness);

    // Filter by minimum screen distance
    const filteredSpots = [];
    for (const spot of brightSpots) {
        let tooClose = false;
        for (const kept of filteredSpots) {
            const dx = spot.screenPos.x - kept.screenPos.x;
            const dy = spot.screenPos.y - kept.screenPos.y;
            if (Math.sqrt(dx * dx + dy * dy) < minScreenDistance) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose) {
            filteredSpots.push(spot);
            if (filteredSpots.length >= numStarbursts) break;
        }
    }

    // Update starbursts with position smoothing
    const cameraDir = new THREE.Vector3();
    const positionLerpSpeed = 0.03;  // Slow position transitions
    const scaleLerpSpeed = 0.05;     // Slow scale transitions

    for (let i = 0; i < starbursts.length; i++) {
        const sprite = starbursts[i];
        const userData = sprite.userData;

        if (i < filteredSpots.length) {
            const spot = filteredSpots[i];

            // Calculate target position (offset toward camera)
            cameraDir.copy(camera.position).sub(spot.position).normalize().multiplyScalar(0.08);
            userData.targetPosition.copy(spot.position).add(cameraDir);
            userData.targetScale = 0.25 + spot.brightness * 0.2;

            if (!userData.active) {
                // New starburst - snap to position, then grow
                sprite.position.copy(userData.targetPosition);
                userData.active = true;
            }
        } else {
            // No spot for this starburst - fade out
            userData.targetScale = 0;
        }
    }

    // Animate all starbursts
    for (const sprite of starbursts) {
        const userData = sprite.userData;

        // Smooth position lerp (only if active)
        if (userData.active && userData.targetScale > 0) {
            sprite.position.lerp(userData.targetPosition, positionLerpSpeed);
        }

        // Smooth scale lerp
        userData.currentScale += (userData.targetScale - userData.currentScale) * scaleLerpSpeed;

        // Update visibility
        if (userData.currentScale > 0.01) {
            sprite.visible = true;
            sprite.scale.setScalar(userData.currentScale);
        } else {
            sprite.visible = false;
            userData.currentScale = 0;
            userData.active = false;
        }
    }

    // Rotate the saxophone model (not camera)
    if (saxophoneModel) {
        // Apply momentum/damping when not dragging
        if (!isDragging) {
            rotationVelocity *= 0.95; // Damping
            targetRotationY += rotationVelocity;
        }
        saxophoneModel.rotation.y = targetRotationY;
    }

    // Draw audio waveform
    drawWaveform();

    renderer.render(scene, camera);
}

animate();

// === DEBUG MODE ===

// Create debug panel
const debugPanel = document.createElement('div');
debugPanel.id = 'debug-panel';
debugPanel.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold;">DEBUG MODE</div>
    <div>Part: <span id="debug-part-name">-</span></div>
    <div>Original: <span id="debug-original-name">-</span></div>
    <div style="margin-top: 10px;">
        <input type="text" id="debug-rename" placeholder="Custom name..." style="width: 150px; padding: 4px;">
        <button id="debug-rename-btn">Set</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="debug-export">Export Names</button>
        <button id="debug-list">List All</button>
    </div>
    <div id="debug-stats" style="margin-top: 10px; font-size: 11px;"></div>
`;
debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0,0,0,0.85);
    color: #0f0;
    padding: 15px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #0f0;
    display: none;
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
`;
document.body.appendChild(debugPanel);


function toggleDebugMode() {
    debugMode = !debugMode;
    debugPanel.style.display = debugMode ? 'block' : 'none';

    // Update toggle button appearance
    debugToggle.style.color = debugMode ? '#0f0' : '#666';
    debugToggle.style.borderColor = debugMode ? '#0f0' : '#333';

    if (debugMode) {
        // Boost lighting for opaque material
        ambientLight.intensity = 0.5;
        blueLight.intensity = 1.0;
        orangeLight.intensity = 0.8;

        let count = 0;
        let named = 0;
        if (saxophoneModel) {
            saxophoneModel.traverse((child) => {
                if (child.isMesh) {
                    count++;
                    if (partNames[child.uuid]) named++;
                    // Store original material and switch to opaque debug material
                    if (!originalMaterials.has(child.uuid)) {
                        originalMaterials.set(child.uuid, child.material);
                    }
                    child.material = debugMaterial;
                }
            });
        }
        document.getElementById('debug-stats').textContent = `Meshes: ${count} | Named: ${named}`;
        statusEl.textContent = 'DEBUG MODE';
        statusEl.style.display = 'block';
    } else {
        // Restore original lighting
        ambientLight.intensity = 0.05;
        blueLight.intensity = 0.3;
        orangeLight.intensity = 0.2;

        // Reset camera zoom
        camera.position.z = 4;

        // Restore all original materials
        if (saxophoneModel) {
            saxophoneModel.traverse((child) => {
                if (child.isMesh) {
                    // Back-face meshes get back material
                    if (child.name.endsWith('_back')) {
                        child.material = glassBackMaterial;
                    // Restore to correct material based on part type
                    } else if (rollerParts.includes(child.name)) {
                        child.material = rollerMaterial;
                    } else if (pearlParts.includes(child.name)) {
                        child.material = pearlMaterial;
                    } else if (keyParts.includes(child.name)) {
                        child.material = keyMaterial;
                    } else if (reedParts.includes(child.name)) {
                        child.material = reedMaterial;
                    } else {
                        child.material = glassMaterial;
                    }
                }
            });
        }
        selectedMesh = null;
        statusEl.style.display = 'none';
    }
}

// Highlight material for selected parts
const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.8
});

// Opaque debug material (used for non-selected parts in debug mode)
const debugMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9a227,
    metalness: 0.9,
    roughness: 0.3,
    side: THREE.DoubleSide
});

// MIDI highlight material (for active notes - cyan glow)
const midiHighlightMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: false,
    side: THREE.DoubleSide,
    depthTest: true,
});

// Zoom in debug mode only (mouse wheel)
canvas.addEventListener('wheel', (e) => {
    if (!debugMode) return;
    e.preventDefault();

    const zoomSpeed = 0.001;
    camera.position.z += e.deltaY * zoomSpeed * camera.position.z;
    camera.position.z = Math.max(1, Math.min(10, camera.position.z));
}, { passive: false });

// Pinch to zoom in debug mode (touch)
let initialPinchDistance = null;
let initialZoom = null;

canvas.addEventListener('touchstart', (e) => {
    if (!debugMode || e.touches.length !== 2) return;

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
    initialZoom = camera.position.z;
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
    if (!debugMode || e.touches.length !== 2 || !initialPinchDistance) return;
    e.preventDefault();

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    const scale = initialPinchDistance / currentDistance;
    camera.position.z = Math.max(1, Math.min(10, initialZoom * scale));
}, { passive: false });

canvas.addEventListener('touchend', () => {
    initialPinchDistance = null;
    initialZoom = null;
});

// Store original materials
const originalMaterials = new Map();

function selectMesh(mesh) {
    // Restore previous selection to debug material (not original glass)
    if (selectedMesh) {
        selectedMesh.material = debugMaterial;
    }

    selectedMesh = mesh;

    if (mesh) {
        // Store original material if not already stored
        if (!originalMaterials.has(mesh.uuid)) {
            originalMaterials.set(mesh.uuid, mesh.material);
        }
        mesh.material = highlightMaterial;

        // Update UI
        const originalName = mesh.name || '(unnamed)';
        const customName = partNames[mesh.uuid] || '';
        document.getElementById('debug-part-name').textContent = customName || originalName;
        document.getElementById('debug-original-name').textContent = originalName;
        document.getElementById('debug-rename').value = customName;

        console.log('Selected:', originalName, 'UUID:', mesh.uuid);
    }
}

// Click handler for debug mode
function onDebugClick(event) {
    if (!debugMode || !saxophoneModel) return;

    // Don't select if we're dragging
    if (Math.abs(rotationVelocity) > 0.001) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const meshes = [];
    saxophoneModel.traverse((child) => {
        if (child.isMesh) meshes.push(child);
    });

    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        selectMesh(intersects[0].object);
    }
}

canvas.addEventListener('click', onDebugClick);


// Rename button
document.getElementById('debug-rename-btn').addEventListener('click', () => {
    if (selectedMesh) {
        const newName = document.getElementById('debug-rename').value.trim();
        if (newName) {
            partNames[selectedMesh.uuid] = newName;
            document.getElementById('debug-part-name').textContent = newName;

            // Update stats
            let named = Object.keys(partNames).length;
            let count = 0;
            saxophoneModel.traverse((child) => { if (child.isMesh) count++; });
            document.getElementById('debug-stats').textContent = `Meshes: ${count} | Named: ${named}`;
        }
    }
});

// Export names
document.getElementById('debug-export').addEventListener('click', () => {
    // Create mapping with original names as keys
    const exportData = {};
    saxophoneModel.traverse((child) => {
        if (child.isMesh && partNames[child.uuid]) {
            const key = child.name || child.uuid;
            exportData[key] = partNames[child.uuid];
        }
    });

    const json = JSON.stringify(exportData, null, 2);
    console.log('Part names:', json);

    // Copy to clipboard
    navigator.clipboard.writeText(json).then(() => {
        alert('Copied to clipboard!\n\nAlso logged to console.');
    }).catch(() => {
        alert('Logged to console (clipboard failed)');
    });
});

// List all parts
document.getElementById('debug-list').addEventListener('click', () => {
    console.log('\n=== ALL MESH PARTS ===');
    let i = 0;
    saxophoneModel.traverse((child) => {
        if (child.isMesh) {
            const customName = partNames[child.uuid] || '';
            console.log(`${i++}: ${child.name || '(unnamed)'} ${customName ? '-> ' + customName : ''}`);
        }
    });
    console.log('======================\n');
    alert('Part list logged to console');
});

// === MIDI CONTROLLER ===

// Get the correct material for a mesh based on its part type
function getMaterialForMesh(meshName) {
    if (rollerParts.includes(meshName)) return rollerMaterial;
    if (pearlParts.includes(meshName)) return pearlMaterial;
    if (keyParts.includes(meshName)) return keyMaterial;
    if (reedParts.includes(meshName)) return reedMaterial;
    return glassMaterial;
}

// Highlight a key mesh for MIDI
function highlightMidiKey(meshName) {
    const mesh = meshByName.get(meshName);
    if (!mesh || midiHighlightedMeshes.has(meshName)) return;

    // Store original material if not already stored
    if (!originalMaterials.has(mesh.uuid)) {
        originalMaterials.set(mesh.uuid, mesh.material);
    }

    mesh.material = midiHighlightMaterial;
    midiHighlightedMeshes.add(meshName);

    // Also highlight back-face mesh if exists
    const backMesh = backMeshByName.get(meshName);
    if (backMesh) {
        if (!originalMaterials.has(backMesh.uuid)) {
            originalMaterials.set(backMesh.uuid, backMesh.material);
        }
        backMesh.material = midiHighlightMaterial;
    }
}

// Unhighlight a key mesh
function unhighlightMidiKey(meshName) {
    const mesh = meshByName.get(meshName);
    if (!mesh || !midiHighlightedMeshes.has(meshName)) return;

    // Restore correct material (not the stored one, use the type-based one)
    // unless we're in debug mode
    if (debugMode) {
        mesh.material = debugMaterial;
    } else {
        mesh.material = getMaterialForMesh(meshName);
    }

    // Also restore back-face mesh if exists
    const backMesh = backMeshByName.get(meshName);
    if (backMesh) {
        backMesh.material = glassBackMaterial;
    }

    midiHighlightedMeshes.delete(meshName);
}

// Highlight all keys for a MIDI note (based on fingering)
function highlightNoteKeys(midiNote) {
    const fingering = getFingeringForNote(midiNote);
    for (const meshName of fingering) {
        highlightMidiKey(meshName);
    }
}

// Unhighlight all keys for a MIDI note
function unhighlightNoteKeys(midiNote) {
    const fingering = getFingeringForNote(midiNote);
    for (const meshName of fingering) {
        unhighlightMidiKey(meshName);
    }
}

// Handle MIDI note on
midiController.addEventListener('noteon', (e) => {
    highlightNoteKeys(e.detail.note);
    audioSynth.noteOn(e.detail.note, e.detail.velocity);
});

// Handle MIDI note off
midiController.addEventListener('noteoff', (e) => {
    unhighlightNoteKeys(e.detail.note);
    audioSynth.noteOff(e.detail.note);
});

// Handle device changes
midiController.addEventListener('deviceschanged', (e) => {
    const devices = e.detail.inputs;
    if (devices.length > 0) {
        console.log('MIDI devices:', devices.join(', '));
    }
});

// Click handler for MIDI keys (when not in debug mode)
function onMidiKeyClick(event) {
    // Skip if in debug mode (debug mode has its own click handler)
    if (debugMode || !saxophoneModel) return;

    // Don't trigger if we're dragging
    if (Math.abs(rotationVelocity) > 0.001) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const meshes = [];
    saxophoneModel.traverse((child) => {
        if (child.isMesh) meshes.push(child);
    });

    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        // Strip _back suffix if present (back-face clone)
        let meshName = clickedMesh.name;
        if (meshName.endsWith('_back')) {
            meshName = meshName.slice(0, -5);
        }

        // Check if this is a clickable key
        if (isClickableKey(meshName)) {
            const note = getNoteForMesh(meshName);
            if (note !== null) {
                // Release previous note if any
                if (currentMidiNote !== null) {
                    midiController.noteOff(currentMidiNote);
                }
                // Play new note
                currentMidiNote = note;
                midiController.noteOn(note);
            }
        }
    }
}

// Mouse up releases the note
function onMidiKeyRelease() {
    if (currentMidiNote !== null) {
        midiController.noteOff(currentMidiNote);
        currentMidiNote = null;
    }
}

// Add MIDI click handlers
canvas.addEventListener('mousedown', onMidiKeyClick);
canvas.addEventListener('mouseup', onMidiKeyRelease);
canvas.addEventListener('mouseleave', onMidiKeyRelease);

// Touch handlers for MIDI
canvas.addEventListener('touchstart', (e) => {
    if (debugMode || e.touches.length !== 1) return;
    // Convert touch to mouse-like event
    onMidiKeyClick({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
    });
}, { passive: true });

canvas.addEventListener('touchend', onMidiKeyRelease, { passive: true });

// Initialize MIDI on user interaction (required by browsers)
let midiInitialized = false;

async function initMidi() {
    if (midiInitialized) return;
    midiInitialized = true;

    // Initialize audio synth
    audioSynth.init();

    const success = await midiController.init();
    if (success) {
        const devices = midiController.getConnectedDevices();
        if (devices.length > 0) {
            console.log('MIDI ready. Connected devices:', devices.map(d => d.name).join(', '));
        } else {
            console.log('MIDI ready. No devices connected. Click saxophone keys to play!');
        }
    } else {
        console.log('MIDI not available. Click saxophone keys to play!');
    }
}

// Init MIDI on first user interaction
document.addEventListener('click', initMidi, { once: true });
document.addEventListener('touchstart', initMidi, { once: true });
document.addEventListener('keydown', initMidi, { once: true });

// Info tooltip hover handling
const infoBtn = document.getElementById('info');
const infoTooltip = document.getElementById('info-tooltip');
let tooltipTimeout = null;

function showTooltip() {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    infoTooltip.classList.add('show');
}

function hideTooltip() {
    tooltipTimeout = setTimeout(() => {
        infoTooltip.classList.remove('show');
    }, 300);
}

infoBtn.addEventListener('mouseenter', showTooltip);
infoBtn.addEventListener('mouseleave', hideTooltip);
infoTooltip.addEventListener('mouseenter', showTooltip);
infoTooltip.addEventListener('mouseleave', hideTooltip);
