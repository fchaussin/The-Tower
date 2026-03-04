export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false;
    this.masterGain = null;
    this.noiseBuffer = null;

    this.menuMusicOsc = null;
    this.menuBassOsc = null;
    this.menuMusicGain = null;
    this.menuBassGain = null;
    this.menuMusicInterval = null;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioCtx.destination);
      this._precomputeNoise();
    }
  }

  _precomputeNoise() {
    const size = this.audioCtx.sampleRate * 0.1;
    this.noiseBuffer = this.audioCtx.createBuffer(1, size, this.audioCtx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) this.stopMenuMusic();
    if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
    return this.soundEnabled;
  }
  
  _createSimplePath(type, freq, duration, vol = 0.1) {
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
    osc.onended = () => {
      gain.disconnect();
      osc.disconnect();
    };
  }

  playExplosion() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const source = this.audioCtx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    source.onended = () => {
      gain.disconnect();
      filter.disconnect();
      source.disconnect();
    };
  }

  playLevelUp() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this._createSimplePath('square', 440, 0.15);
    setTimeout(() => this._createSimplePath('square', 523.25, 0.3), 150);
  }

  playGameOverMusic() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const notes = [
      { f: 659.25, d: 0.2 }, { f: 523.25, d: 0.2 },
      { f: 440.00, d: 0.2 }, { f: 329.63, d: 0.6 }
    ];
    let offset = 0;
    notes.forEach(n => {
      setTimeout(() => this._createSimplePath('square', n.f, n.d), offset);
      offset += n.d * 1000;
    });
  }

  playMenuMusic() {
    if (!this.soundEnabled || !this.audioCtx || this.menuMusicOsc) return;

    const motifEpique = [440.0, 659.25, 880.0, 659.25, 783.99, 523.25, 659.25, 440.0];
    const motifFinal = [659.25, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
    const basses = [220.0, 261.63, 293.66, 174.61, 220.0, 261.63, 293.66, 329.63];
    let step = 0;

    this.menuMusicGain = this.audioCtx.createGain();
    this.menuBassGain = this.audioCtx.createGain();
    this.menuMusicGain.connect(this.masterGain);
    this.menuBassGain.connect(this.masterGain);

    this.menuMusicGain.gain.value = 0.05;
    this.menuBassGain.gain.value = 0;

    this.menuMusicOsc = this.audioCtx.createOscillator();
    this.menuBassOsc = this.audioCtx.createOscillator();
    this.menuMusicOsc.type = 'sawtooth';
    this.menuBassOsc.type = 'square';

    this.menuMusicOsc.connect(this.menuMusicGain);
    this.menuBassOsc.connect(this.menuBassGain);

    this.menuMusicOsc.start();
    this.menuBassOsc.start();

    this.menuMusicInterval = setInterval(() => {
      if (!this.soundEnabled) return;
      const now = this.audioCtx.currentTime;
      const currentStep = step % 64;
      const measureIndex = Math.floor(currentStep / 8);
      const noteIndex = currentStep % 8;

      const isFinal = (measureIndex === 3 || measureIndex === 7);
      const freq = isFinal ? motifFinal[noteIndex] : motifEpique[noteIndex];
      this.menuMusicOsc.frequency.setTargetAtTime(freq, now, 0.01);

      this.menuBassGain.gain.cancelScheduledValues(now);
      this.menuBassGain.gain.setValueAtTime(0, now);
      this.menuBassGain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      this.menuBassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      this.menuBassOsc.frequency.setValueAtTime(basses[measureIndex], now);

      step++;
    }, 140);
  }

  stopMenuMusic() {
    if (this.menuMusicInterval) {
      clearInterval(this.menuMusicInterval);
      this.menuMusicInterval = null;
    }

    const now = this.audioCtx.currentTime;
    const fade = 1;

    [this.menuMusicGain, this.menuBassGain].forEach(g => {
      if (g) {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0, now + fade);
      }
    });

    setTimeout(() => {
      [this.menuMusicOsc, this.menuBassOsc].forEach(osc => {
        if (osc) { try { osc.stop(); osc.disconnect(); } catch(e) {} }
      });
      [this.menuMusicGain, this.menuBassGain].forEach(g => { if (g) g.disconnect(); });
      this.menuMusicOsc = this.menuBassOsc = this.menuMusicGain = this.menuBassGain = null;
    }, fade * 1000);
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    
    switch (type) {
      case 'shoot':
        this._createSimplePath('square', 600, 0.1, 0.05);
        if (navigator.vibrate) navigator.vibrate(10);
        break;
      case 'hit':
        this._createSimplePath('sawtooth', 150, 0.1, 0.05);
        if (navigator.vibrate) navigator.vibrate(15);
        break;
      case 'bossDeath':
        this._createSimplePath('sawtooth', 100, 1, 0.1);
        if (navigator.vibrate) navigator.vibrate(200);
        break;
      case 'gameover':
        this._createSimplePath('sawtooth', 100, 1, 0.1);
        if (navigator.vibrate) navigator.vibrate(500);
        setTimeout(() => this.playGameOverMusic(), 1000);
        break;
      case 'lifeLost':
        this._createSimplePath('sawtooth', 80, 1.5, 0.15);
        if (navigator.vibrate) navigator.vibrate(800);
        break;
    }
  }
}