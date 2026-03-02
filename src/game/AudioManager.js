export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false;
    this.menuMusicOsc = null;
    this.menuMusicGain = null;
    this.menuMusicInterval = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopMenuMusic();
    }
    return this.soundEnabled;
  }

  playExplosion() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.1; // 100ms
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    noise.start();
  }

  playLevelUp() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    
    const osc1 = this.audioCtx.createOscillator();
    const gain1 = this.audioCtx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(440, now); // A4
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(this.audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = this.audioCtx.createOscillator();
    const gain2 = this.audioCtx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(523.25, now + 0.15); // C5
    gain2.gain.setValueAtTime(0.1, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(this.audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);
  }

  playGameOverMusic() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [
      { f: 659.25, d: 0.2 }, // E5
      { f: 523.25, d: 0.2 }, // C5
      { f: 440.00, d: 0.2 }, // A4
      { f: 329.63, d: 0.6 }, // E4
    ];
    let time = now;
    notes.forEach(note => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, time);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(time);
      osc.stop(time + note.d);
      time += note.d;
    });
  }

  playMenuMusic() {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.menuMusicOsc) return;
    
    // A Aeolian Natural Minor ostinato
    const notes = [220.00, 329.63, 261.63, 329.63, 349.23, 329.63, 293.66, 329.63]; // A3, E4, C4, E4, F4, E4, D4, E4
    let step = 0;
    
    this.menuMusicGain = this.audioCtx.createGain();
    this.menuMusicGain.gain.value = 0.05;
    this.menuMusicGain.connect(this.audioCtx.destination);
    
    this.menuMusicOsc = this.audioCtx.createOscillator();
    this.menuMusicOsc.type = 'triangle';
    this.menuMusicOsc.connect(this.menuMusicGain);
    this.menuMusicOsc.start();
    
    this.menuMusicInterval = setInterval(() => {
      if (!this.soundEnabled || !this.audioCtx) {
        this.stopMenuMusic();
        return;
      }
      this.menuMusicOsc.frequency.setValueAtTime(notes[step % notes.length], this.audioCtx.currentTime);
      step++;
    }, 200);
  }
  
  stopMenuMusic() {
    if (this.menuMusicOsc) {
      this.menuMusicOsc.stop();
      this.menuMusicOsc.disconnect();
      this.menuMusicOsc = null;
    }
    if (this.menuMusicGain) {
      this.menuMusicGain.disconnect();
      this.menuMusicGain = null;
    }
    if (this.menuMusicInterval) {
      clearInterval(this.menuMusicInterval);
      this.menuMusicInterval = null;
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    if (type === 'shoot') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
      if (navigator.vibrate) navigator.vibrate(10);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
      if (navigator.vibrate) navigator.vibrate(15);
    } else if (type === 'bossDeath') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      osc.start(now); osc.stop(now + 1);
      if (navigator.vibrate) navigator.vibrate(200);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      osc.start(now); osc.stop(now + 1);
      if (navigator.vibrate) navigator.vibrate(500);
      
      setTimeout(() => {
        this.playGameOverMusic();
      }, 1000);
    }
  }
}
