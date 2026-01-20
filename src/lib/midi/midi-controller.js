// MIDI Controller - handles Web MIDI API and note state management

import { TENOR_RANGE, getMidiNoteName } from './note-mapping';

export class MIDIController extends EventTarget {
  constructor() {
    super();
    this.activeNotes = new Set();
    this.midiAccess = null;
    this.inputs = [];
    this.isSupported = 'requestMIDIAccess' in navigator;
  }

  // Initialize Web MIDI API
  async init() {
    if (!this.isSupported) {
      console.log('Web MIDI API not supported in this browser');
      return false;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      console.log('MIDI access granted');

      // Listen for device connections/disconnections
      this.midiAccess.onstatechange = (e) => this.onStateChange(e);

      // Connect to all available inputs
      this.connectInputs();

      return true;
    } catch (err) {
      console.error('MIDI access denied:', err);
      return false;
    }
  }

  // Connect to all MIDI inputs
  connectInputs() {
    this.inputs = [];

    console.log('Scanning MIDI inputs...');
    console.log('Number of inputs:', this.midiAccess.inputs.size);

    for (const input of this.midiAccess.inputs.values()) {
      console.log(`MIDI input found: "${input.name}" (${input.manufacturer}) - state: ${input.state}`);
      input.onmidimessage = (msg) => this.onMIDIMessage(msg);
      this.inputs.push(input);
    }

    if (this.inputs.length === 0) {
      console.log('No MIDI inputs detected. Make sure your device is connected and not in use by another application.');
    }

    this.dispatchEvent(new CustomEvent('deviceschanged', {
      detail: { inputs: this.inputs.map(i => i.name) }
    }));
  }

  // Handle device state changes
  onStateChange(event) {
    const { port } = event;
    console.log(`MIDI ${port.type} ${port.name}: ${port.state}`);

    if (port.type === 'input') {
      this.connectInputs();
    }
  }

  // Handle incoming MIDI messages
  onMIDIMessage(message) {
    const [status, note, velocity] = message.data;
    const command = status >> 4;
    const channel = status & 0x0f;

    console.log(`MIDI message: status=${status} (cmd=${command}, ch=${channel}), note=${note}, vel=${velocity}`);

    // Note On (0x9) with velocity > 0
    if (command === 0x9 && velocity > 0) {
      console.log(`Note ON: ${note} velocity ${velocity}`);
      this.noteOn(note, velocity);
    }
    // Note Off (0x8) or Note On with velocity 0
    else if (command === 0x8 || (command === 0x9 && velocity === 0)) {
      console.log(`Note OFF: ${note}`);
      this.noteOff(note);
    }
  }

  // Trigger a note on
  noteOn(note, velocity = 127) {
    // Clamp to tenor sax range
    if (note < TENOR_RANGE.MIN || note > TENOR_RANGE.MAX) {
      console.log(`Note ${note} outside tenor sax range (${TENOR_RANGE.MIN}-${TENOR_RANGE.MAX})`);
      return;
    }

    this.activeNotes.add(note);

    this.dispatchEvent(new CustomEvent('noteon', {
      detail: {
        note,
        velocity,
        name: getMidiNoteName(note)
      }
    }));
  }

  // Trigger a note off
  noteOff(note) {
    if (!this.activeNotes.has(note)) {
      return;
    }

    this.activeNotes.delete(note);

    this.dispatchEvent(new CustomEvent('noteoff', {
      detail: {
        note,
        name: getMidiNoteName(note)
      }
    }));
  }

  // Release all active notes
  allNotesOff() {
    for (const note of this.activeNotes) {
      this.noteOff(note);
    }
  }

  // Get currently active notes
  getActiveNotes() {
    return new Set(this.activeNotes);
  }

  // Check if a note is currently active
  isNoteActive(note) {
    return this.activeNotes.has(note);
  }

  // Get list of connected MIDI devices
  getConnectedDevices() {
    return this.inputs.map(input => ({
      name: input.name,
      manufacturer: input.manufacturer,
      state: input.state
    }));
  }
}
