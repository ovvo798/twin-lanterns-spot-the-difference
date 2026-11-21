// Tiny synthesised sound effects (WebAudio, no audio files): a chime for a find,
// a low buzz for a wrong click, a soft pluck for a hint, an arpeggio for a clear.
// Nothing plays until the player first interacts, so browsers allow it.

export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context !== null) return context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    } catch {
      context = null;
    }
    return context;
  }

  function note(freq, at, dur, type, gainValue) {
    const ctx = ensure();
    if (ctx === null || muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + at);
    osc.stop(ctx.currentTime + at + dur + 0.05);
  }

  return {
    /** Call from any real gesture so the context is allowed to start. */
    unlock() {
      const ctx = ensure();
      if (ctx !== null && ctx.state === 'suspended') ctx.resume().catch(() => {});
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    find() {
      note(660, 0, 0.16, 'sine', 0.18);
      note(990, 0.09, 0.22, 'sine', 0.18);
    },
    wrong() {
      note(140, 0, 0.22, 'sawtooth', 0.08);
    },
    hint() {
      note(520, 0, 0.14, 'triangle', 0.14);
    },
    clear() {
      note(523, 0, 0.16, 'sine', 0.16);
      note(659, 0.1, 0.16, 'sine', 0.16);
      note(784, 0.2, 0.26, 'sine', 0.16);
    },
    over() {
      note(392, 0, 0.2, 'sine', 0.14);
      note(311, 0.16, 0.3, 'sine', 0.14);
    },
  };
}
