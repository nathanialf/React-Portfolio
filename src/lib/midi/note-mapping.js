// MIDI Note Mapping for Tenor Saxophone
// Tenor sax is a Bb instrument - sounds a major 9th (14 semitones) lower than written

export const TENOR_RANGE = {
  MIN: 44,  // Concert Ab2 (written Bb3 - low Bb)
  MAX: 76,  // Concert E5 (written F#6 - high F#)
  TRANSPOSITION: -14  // Concert to written offset
};

// Note names for display
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getMidiNoteName(midiNote) {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_NAMES[midiNote % 12];
  return `${noteName}${octave}`;
}

// Get the written (transposed) note name for tenor sax
// Tenor sax sounds a major 9th (14 semitones) lower than written
// So written = concert + 14
export function getWrittenNoteName(midiNote) {
  const writtenMidi = midiNote - TENOR_RANGE.TRANSPOSITION; // subtract negative = add
  const octave = Math.floor(writtenMidi / 12) - 1;
  const noteName = NOTE_NAMES[writtenMidi % 12];
  return `${noteName}${octave}`;
}

// Saxophone key mesh names from partLabels
export const SAX_KEYS = {
  // Left hand - main keys
  B_KEY: 'nurbsToPoly281',
  A_KEY: 'nurbsToPoly287',
  G_KEY: 'nurbsToPoly285',
  G_SHARP_KEY: 'nurbsToPoly315',
  BB_BIS_KEY: 'nurbsToPoly283',
  OCTAVE_KEY: 'nurbsToPoly579',

  // Left hand - pearls (visual feedback)
  B_PEARL: 'nurbsToPoly280',
  A_PEARL: 'nurbsToPoly286',
  G_PEARL: 'nurbsToPoly284',
  G_SHARP_PEARL: 'nurbsToPoly314',
  BB_BIS_PEARL: 'nurbsToPoly282',

  // Right hand - main keys
  F_KEY: 'nurbsToPoly270',
  E_KEY: 'nurbsToPoly266',
  D_KEY: 'nurbsToPoly268',
  SIDE_F_SHARP_KEY: 'nurbsToPoly274',

  // Right hand - pearls
  F_PEARL: 'nurbsToPoly269',
  E_PEARL: 'nurbsToPoly265',
  D_PEARL: 'nurbsToPoly267',
  SIDE_F_SHARP_PEARL: 'nurbsToPoly273',

  // Low register keys (right pinky cluster)
  LOW_EB_LEVER: 'nurbsToPoly124',
  LOW_C_LEVER: 'nurbsToPoly125',
  LOW_C_SHARP_LEVER: 'nurbsToPoly854',
  LOW_B_LEVER: 'nurbsToPoly858',
  LOW_BB_LEVER: 'nurbsToPoly896',

  // Side keys (palm keys)
  SIDE_C_LEVER: 'nurbsToPoly247',
  SIDE_BB_LEVER: 'nurbsToPoly248',
  TOP_E_LEVER: 'nurbsToPoly249',
  TOP_F_SHARP_LEVER: 'nurbsToPoly251',
  TOP_D_KEY: 'nurbsToPoly459',
  TOP_F_KEY: 'nurbsToPoly460',
  TOP_D_SHARP_KEY: 'nurbsToPoly461',

  // Front F key
  FRONT_F_KEY: 'nurbsToPoly290',

  // Pads (for visual feedback)
  LOW_BB_PAD: 'nurbsToPoly81',
  LOW_B_PAD: 'nurbsToPoly83',
  LOW_C_SHARP_PAD: 'nurbsToPoly85',
  LOW_C_PAD: 'nurbsToPoly87',
  LOW_EB_PAD: 'nurbsToPoly89',
  D_PAD: 'nurbsToPoly91',
  E_PAD: 'nurbsToPoly93',
  F_PAD: 'nurbsToPoly95',
  F_SHARP_PAD: 'nurbsToPoly97',
  G_SHARP_PAD: 'nurbsToPoly99',
  G_PAD: 'nurbsToPoly101',
  A_PAD: 'nurbsToPoly103',
  BB_BIS_PAD: 'nurbsToPoly105',
  B_PAD: 'nurbsToPoly107',
  SIDE_C_PAD: 'nurbsToPoly109',
  SIDE_BB_PAD: 'nurbsToPoly111',
  SIDE_F_SHARP_PAD: 'nurbsToPoly163',
};

// Fingering definitions - which keys are pressed for each note
// Keys listed are the ones that need to be DOWN (closed)
const FINGERINGS = {
  // Low register (no octave key)
  44: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_BB_LEVER], // Low Bb
  45: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_B_LEVER],  // Low B
  46: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_C_LEVER],  // Low C
  47: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_C_SHARP_LEVER], // Low C#
  48: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY], // Low D
  49: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_EB_LEVER], // Low Eb
  50: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY], // Low E
  51: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY], // Low F
  52: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.SIDE_F_SHARP_KEY], // Low F#
  53: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY], // Low G
  54: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.G_SHARP_KEY], // Low G#
  55: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY], // Low A
  56: [SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.BB_BIS_KEY], // Low Bb (bis)
  57: [SAX_KEYS.B_KEY], // Low B
  58: [SAX_KEYS.A_KEY], // Middle C (open fingering)
  59: [SAX_KEYS.G_SHARP_KEY], // Middle C#

  // Middle register (with octave key)
  60: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY], // D
  61: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY, SAX_KEYS.D_KEY, SAX_KEYS.LOW_EB_LEVER], // Eb
  62: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.E_KEY], // E
  63: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY], // F
  64: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.F_KEY, SAX_KEYS.SIDE_F_SHARP_KEY], // F#
  65: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY], // G
  66: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.G_KEY, SAX_KEYS.G_SHARP_KEY], // G#
  67: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY], // A
  68: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY, SAX_KEYS.A_KEY, SAX_KEYS.BB_BIS_KEY], // Bb
  69: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.B_KEY], // B
  70: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.A_KEY], // C
  71: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.G_SHARP_KEY], // C#

  // High register (palm keys)
  72: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.TOP_D_KEY], // D
  73: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.TOP_D_KEY, SAX_KEYS.TOP_D_SHARP_KEY], // D#
  74: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.TOP_D_KEY, SAX_KEYS.TOP_D_SHARP_KEY, SAX_KEYS.TOP_E_LEVER], // E
  75: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.TOP_D_KEY, SAX_KEYS.TOP_D_SHARP_KEY, SAX_KEYS.TOP_F_KEY], // F
  76: [SAX_KEYS.OCTAVE_KEY, SAX_KEYS.TOP_D_KEY, SAX_KEYS.TOP_D_SHARP_KEY, SAX_KEYS.TOP_F_KEY, SAX_KEYS.TOP_F_SHARP_LEVER], // F#
};

// Get the fingering (array of mesh names) for a MIDI note
export function getFingeringForNote(midiNote) {
  if (midiNote < TENOR_RANGE.MIN || midiNote > TENOR_RANGE.MAX) {
    return [];
  }
  return FINGERINGS[midiNote] || [];
}

// Clickable keys - maps mesh name to the primary note it triggers
// When you click a key, it plays this note
export const CLICKABLE_KEYS = {
  // Main finger keys - map to their most common note
  [SAX_KEYS.B_KEY]: 57,      // B key alone = B3
  [SAX_KEYS.B_PEARL]: 57,
  [SAX_KEYS.A_KEY]: 55,      // A key alone = A3
  [SAX_KEYS.A_PEARL]: 55,
  [SAX_KEYS.G_KEY]: 53,      // G key pattern = G3
  [SAX_KEYS.G_PEARL]: 53,
  [SAX_KEYS.G_SHARP_KEY]: 54, // G# key = G#3
  [SAX_KEYS.G_SHARP_PEARL]: 54,
  [SAX_KEYS.F_KEY]: 51,      // F key pattern = F3
  [SAX_KEYS.F_PEARL]: 51,
  [SAX_KEYS.E_KEY]: 50,      // E key pattern = E3
  [SAX_KEYS.E_PEARL]: 50,
  [SAX_KEYS.D_KEY]: 48,      // D key pattern = D3
  [SAX_KEYS.D_PEARL]: 48,

  // Side keys
  [SAX_KEYS.SIDE_F_SHARP_KEY]: 52,
  [SAX_KEYS.SIDE_F_SHARP_PEARL]: 52,
  [SAX_KEYS.BB_BIS_KEY]: 56,
  [SAX_KEYS.BB_BIS_PEARL]: 56,

  // Low register keys
  [SAX_KEYS.LOW_BB_LEVER]: 44,
  [SAX_KEYS.LOW_B_LEVER]: 45,
  [SAX_KEYS.LOW_C_LEVER]: 46,
  [SAX_KEYS.LOW_C_SHARP_LEVER]: 47,
  [SAX_KEYS.LOW_EB_LEVER]: 49,

  // Palm keys (high register)
  [SAX_KEYS.TOP_D_KEY]: 72,
  [SAX_KEYS.TOP_D_SHARP_KEY]: 73,
  [SAX_KEYS.TOP_E_LEVER]: 74,
  [SAX_KEYS.TOP_F_KEY]: 75,
  [SAX_KEYS.TOP_F_SHARP_LEVER]: 76,

  // Side keys (alternate high fingerings)
  [SAX_KEYS.SIDE_BB_LEVER]: 68,  // High Bb
  [SAX_KEYS.SIDE_C_LEVER]: 70,   // High C

  // Octave key triggers middle D
  [SAX_KEYS.OCTAVE_KEY]: 60,

  // Front F key
  [SAX_KEYS.FRONT_F_KEY]: 63,
};

// Get the note triggered by clicking a mesh
export function getNoteForMesh(meshName) {
  return CLICKABLE_KEYS[meshName] || null;
}

// Check if a mesh is a clickable key
export function isClickableKey(meshName) {
  return meshName in CLICKABLE_KEYS;
}

// Get all mesh names that are interactive keys
export function getAllClickableKeys() {
  return Object.keys(CLICKABLE_KEYS);
}
