/**
 * Lightweight sound effects via Web Audio API — no external assets needed.
 * Tick during the spin, fanfare on winner reveal.
 */

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("rivals_muted", value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem("rivals_muted");
    if (stored !== null) muted = stored === "1";
  } catch {
    /* ignore */
  }
  return muted;
}

function tone(freq: number, duration: number, type: OscillatorType = "square", gain = 0.08) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playTick() {
  tone(880 + Math.random() * 200, 0.05, "square", 0.04);
}

export function playWinner() {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  // Fanfare arpeggio
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    setTimeout(() => tone(freq, 0.25, "triangle", 0.12), i * 110);
  });
  // Final shimmer
  setTimeout(() => {
    [1318.5, 1567.98, 2093.0].forEach((freq, i) =>
      setTimeout(() => tone(freq, 0.4, "sine", 0.1), i * 80),
    );
  }, 500);
}
