// Audio Synthesizer - FM synthesis for saxophone-like tones

export class AudioSynth {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.analyser = null;
    this.activeNotes = new Map(); // note -> {nodes...}

    // ADSR envelope parameters (in seconds)
    this.attack = 0.04;
    this.decay = 0.15;
    this.sustain = 0.7;
    this.release = 0.2;

    // FM synthesis parameters
    this.modulationRatio = 2;      // Modulator freq = carrier freq * ratio (2 = octave above)
    this.modulationIndex = 1.8;    // How much FM modulation (higher = brighter/harsher)
    this.modulationAttack = 0.02;  // FM index envelope - quick bright attack
    this.modulationDecay = 0.3;    // FM settles to mellower sustain
    this.modulationSustain = 0.4;  // Sustain level of modulation index

    // Second modulator for richer harmonics
    this.mod2Ratio = 3;            // 3rd harmonic
    this.mod2Index = 0.6;

    // Vibrato
    this.vibratoRate = 5;          // Hz
    this.vibratoDepth = 4;         // Cents (subtle pitch wobble)
    this.vibratoDelay = 0.15;      // Delay before vibrato kicks in

    // Breath noise
    this.noiseAmount = 0.04;       // Mix of breath noise
    this.noiseFilterFreq = 2000;   // Noise filter cutoff
  }

  // Initialize audio context on user interaction
  init() {
    if (this.audioContext) return true;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create analyser for waveform visualization
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      console.log('AudioSynth initialized (FM synthesis)');
      return true;
    } catch (err) {
      console.error('AudioSynth initialization failed:', err);
      return false;
    }
  }

  // Resume audio context if suspended
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Convert MIDI note number to frequency (Hz)
  midiToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Create noise buffer for breath sound
  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  // Play a note with FM synthesis
  noteOn(note, velocity = 127) {
    if (!this.audioContext) {
      this.init();
    }

    this.resume();

    // If note already playing, stop it
    if (this.activeNotes.has(note)) {
      this.noteOff(note);
    }

    const now = this.audioContext.currentTime;
    const frequency = this.midiToFrequency(note);
    const velocityNorm = velocity / 127;
    const peakGain = 0.35 * velocityNorm;

    // === CARRIER OSCILLATOR ===
    const carrier = this.audioContext.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = frequency;

    // === MODULATOR 1 (main FM) ===
    const modulator1 = this.audioContext.createOscillator();
    modulator1.type = 'sine';
    modulator1.frequency.value = frequency * this.modulationRatio;

    // Modulation depth (index * carrier frequency)
    const mod1Gain = this.audioContext.createGain();
    const mod1Depth = frequency * this.modulationIndex * velocityNorm;
    mod1Gain.gain.setValueAtTime(0, now);
    // FM envelope: quick attack to peak, then decay to sustain level
    mod1Gain.gain.linearRampToValueAtTime(mod1Depth, now + this.modulationAttack);
    mod1Gain.gain.linearRampToValueAtTime(
      mod1Depth * this.modulationSustain,
      now + this.modulationAttack + this.modulationDecay
    );

    // Connect modulator to carrier frequency
    modulator1.connect(mod1Gain);
    mod1Gain.connect(carrier.frequency);

    // === MODULATOR 2 (adds odd harmonics) ===
    const modulator2 = this.audioContext.createOscillator();
    modulator2.type = 'sine';
    modulator2.frequency.value = frequency * this.mod2Ratio;

    const mod2Gain = this.audioContext.createGain();
    const mod2Depth = frequency * this.mod2Index * velocityNorm;
    mod2Gain.gain.setValueAtTime(0, now);
    mod2Gain.gain.linearRampToValueAtTime(mod2Depth * 0.8, now + this.modulationAttack);
    mod2Gain.gain.linearRampToValueAtTime(mod2Depth * 0.3, now + this.modulationAttack + this.modulationDecay);

    modulator2.connect(mod2Gain);
    mod2Gain.connect(carrier.frequency);

    // === VIBRATO LFO ===
    const vibrato = this.audioContext.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.value = this.vibratoRate;

    const vibratoGain = this.audioContext.createGain();
    // Vibrato depth in Hz (convert cents to Hz ratio)
    const vibratoHz = frequency * (Math.pow(2, this.vibratoDepth / 1200) - 1);
    vibratoGain.gain.setValueAtTime(0, now);
    // Delay vibrato onset
    vibratoGain.gain.setValueAtTime(0, now + this.vibratoDelay);
    vibratoGain.gain.linearRampToValueAtTime(vibratoHz, now + this.vibratoDelay + 0.2);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(carrier.frequency);

    // === PITCH BEND ON ATTACK ===
    // Start slightly flat and bend up (saxophone embouchure)
    const pitchBendCents = -15; // Start 15 cents flat
    const pitchBendHz = frequency * (Math.pow(2, pitchBendCents / 1200) - 1);
    carrier.frequency.setValueAtTime(frequency + pitchBendHz, now);
    carrier.frequency.linearRampToValueAtTime(frequency, now + 0.06);

    // === BREATH NOISE ===
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer();
    noiseSource.loop = true;

    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = this.noiseFilterFreq + (velocityNorm * 1500);
    noiseFilter.Q.value = 1.5;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(this.noiseAmount * velocityNorm, now + this.attack * 0.5);
    noiseGain.gain.linearRampToValueAtTime(this.noiseAmount * velocityNorm * 0.3, now + this.attack + 0.1);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    // === OUTPUT ENVELOPE ===
    const outputGain = this.audioContext.createGain();
    outputGain.gain.setValueAtTime(0, now);
    outputGain.gain.linearRampToValueAtTime(peakGain, now + this.attack);
    outputGain.gain.linearRampToValueAtTime(peakGain * this.sustain, now + this.attack + this.decay);

    // === FORMANT FILTER (shapes the "saxophone" character) ===
    const formantFilter = this.audioContext.createBiquadFilter();
    formantFilter.type = 'peaking';
    formantFilter.frequency.value = 1200; // Emphasize sax formant region
    formantFilter.Q.value = 1.5;
    formantFilter.gain.value = 4;

    // === CONNECT EVERYTHING ===
    carrier.connect(formantFilter);
    noiseGain.connect(formantFilter);
    formantFilter.connect(outputGain);
    outputGain.connect(this.masterGain);

    // === START OSCILLATORS ===
    carrier.start(now);
    modulator1.start(now);
    modulator2.start(now);
    vibrato.start(now);
    noiseSource.start(now);

    // Store all nodes for noteOff
    this.activeNotes.set(note, {
      carrier,
      modulator1,
      modulator2,
      vibrato,
      noiseSource,
      mod1Gain,
      mod2Gain,
      vibratoGain,
      noiseGain,
      outputGain,
      formantFilter,
      peakGain
    });
  }

  // Release a note
  noteOff(note) {
    const noteData = this.activeNotes.get(note);
    if (!noteData) return;

    const now = this.audioContext.currentTime;
    const {
      carrier, modulator1, modulator2, vibrato, noiseSource,
      mod1Gain, mod2Gain, noiseGain, outputGain
    } = noteData;

    // Release envelope
    outputGain.gain.cancelScheduledValues(now);
    outputGain.gain.setValueAtTime(outputGain.gain.value, now);
    outputGain.gain.linearRampToValueAtTime(0, now + this.release);

    // Fade out modulation
    mod1Gain.gain.cancelScheduledValues(now);
    mod1Gain.gain.setValueAtTime(mod1Gain.gain.value, now);
    mod1Gain.gain.linearRampToValueAtTime(0, now + this.release);

    mod2Gain.gain.cancelScheduledValues(now);
    mod2Gain.gain.setValueAtTime(mod2Gain.gain.value, now);
    mod2Gain.gain.linearRampToValueAtTime(0, now + this.release);

    // Fade out noise
    noiseGain.gain.cancelScheduledValues(now);
    noiseGain.gain.setValueAtTime(noiseGain.gain.value, now);
    noiseGain.gain.linearRampToValueAtTime(0, now + this.release);

    // Stop all oscillators after release
    const stopTime = now + this.release + 0.05;
    carrier.stop(stopTime);
    modulator1.stop(stopTime);
    modulator2.stop(stopTime);
    vibrato.stop(stopTime);
    noiseSource.stop(stopTime);

    this.activeNotes.delete(note);
  }

  // Release all notes
  allNotesOff() {
    for (const note of this.activeNotes.keys()) {
      this.noteOff(note);
    }
  }

  // Set master volume (0-1)
  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  // Get current volume
  getVolume() {
    return this.masterGain ? this.masterGain.gain.value : 0.4;
  }

  // Get analyser node for visualization
  getAnalyser() {
    return this.analyser;
  }

  // Check if any notes are playing
  isPlaying() {
    return this.activeNotes.size > 0;
  }
}
