// Web Audio API Synthesizer for premium retro-futuristic arcade/vending sounds.
// Runs 100% client-side without downloading audio assets.

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (isMuted) return null;
  if (!audioCtx) {
    // Standard audio context setup
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  toggleMute() {
    isMuted = !isMuted;
    if (isMuted && audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    return isMuted;
  },

  getMuteState() {
    return isMuted;
  },

  /** Soft mechanical click sound */
  playClick() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  },

  /** Ascending holographic sonar scan chime */
  playSuccess() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Primary oscillator for the tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Sub-harmonic oscillator for depth
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(261.63, now); // C4
    subOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    subGain.gain.setValueAtTime(0.08, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    subOsc.start(now);
    
    osc.stop(now + 0.4);
    subOsc.stop(now + 0.3);
  },

  /** Glowing error / warning tone */
  playError() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(120, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.26);
  },

  /** Cascading metallic double chime (coin reward) */
  playCoin() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    const playTone = (freq, delay, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.05);
    };

    // Fast double chime for the arcade coin sound
    playTone(987.77, 0, 0.12); // B5
    playTone(1318.51, 0.08, 0.25); // E6
  },

  /** Retro vending motor whirr and dispense clunk */
  playVending() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // 1. Motor Hum (Oscillator with low frequency and slight vibrato)
    const motor = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motor.connect(motorGain);
    motorGain.connect(ctx.destination);
    
    motor.type = 'sawtooth';
    motor.frequency.setValueAtTime(65, now); // C2
    motor.frequency.linearRampToValueAtTime(70, now + 0.5);
    
    motorGain.gain.setValueAtTime(0.03, now);
    motorGain.gain.linearRampToValueAtTime(0.03, now + 0.4);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    motor.start(now);
    motor.stop(now + 0.55);

    // 2. Dispense Clunk (Low frequency heavy drop)
    const clunk = ctx.createOscillator();
    const clunkGain = ctx.createGain();
    clunk.connect(clunkGain);
    clunkGain.connect(ctx.destination);
    
    clunk.type = 'triangle';
    clunk.frequency.setValueAtTime(120, now + 0.48);
    clunk.frequency.exponentialRampToValueAtTime(30, now + 0.65);
    
    clunkGain.gain.setValueAtTime(0.18, now + 0.48);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
    
    clunk.start(now + 0.48);
    clunk.stop(now + 0.7);
  }
};
