/** Short, quiet click confirmation (Web Audio). */
export function playCaptureChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 920;
    gain.gain.value = 0.045;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.stop(now + 0.08);
    window.setTimeout(() => {
      void ctx.close();
    }, 120);
  } catch {
    // Audio may be blocked until a user gesture; ignore.
  }
}
