import { useEffect, useState } from "react";
import { playTick, playWinner } from "@/lib/sound";

interface Props {
  active: boolean;
  onComplete: () => void;
}

/** Fullscreen 3-2-1 countdown. Calls onComplete after "1" finishes. */
export function Countdown({ active, onComplete }: Props) {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (!active) return;
    setN(3);
    playTick();
    const t1 = window.setTimeout(() => {
      setN(2);
      playTick();
    }, 1000);
    const t2 = window.setTimeout(() => {
      setN(1);
      playTick();
    }, 2000);
    const t3 = window.setTimeout(() => {
      playWinner();
      onComplete();
    }, 3000);
    return () => {
      [t1, t2, t3].forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
      <div
        key={n}
        className="font-display italic text-[14rem] sm:text-[20rem] leading-none tracking-tight text-[var(--neon-yellow)] animate-scale-in"
        style={{ textShadow: "0 0 60px oklch(0.88 0.2 95 / 0.8)" }}
      >
        {n}
      </div>
    </div>
  );
}
