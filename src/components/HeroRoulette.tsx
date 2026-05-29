import { useEffect, useRef, useState } from "react";
import { HeroImage } from "./HeroImage";
import type { Hero } from "@/lib/rivals-data";
import { playTick, playWinner } from "@/lib/sound";

interface Props {
  pool: Hero[];
  spinning: boolean;
  onFinish: (winner: Hero) => void;
  accentClass?: string; // textClass for accent
}

/**
 * Photo carousel with deceleration easing.
 * Cycles real hero artwork at decreasing intervals until landing on a winner.
 */
export function HeroRoulette({ pool, spinning, onFinish, accentClass = "text-white" }: Props) {
  const [current, setCurrent] = useState<Hero | null>(pool[0] ?? null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!spinning || pool.length === 0) return;

    // Pre-pick winner so the deceleration lands on it cleanly.
    const winner = pool[Math.floor(Math.random() * pool.length)];
    let elapsed = 0;
    const totalDuration = 7000; // ms — giro largo y fluido (mínimo 7s)
    let lastIndex = -1;

    const tick = () => {
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const interval = 45 + eased * 380;

      let nextIdx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && nextIdx === lastIndex) {
        nextIdx = (nextIdx + 1) % pool.length;
      }
      lastIndex = nextIdx;
      setCurrent(pool[nextIdx]);
      playTick();

      elapsed += interval;

      if (progress >= 1) {
        // Land on the winner.
        setCurrent(winner);
        playWinner();
        onFinish(winner);
        return;
      }

      timerRef.current = window.setTimeout(tick, interval);
    };

    timerRef.current = window.setTimeout(tick, 60);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);

  // When pool changes (and not spinning), reset preview.
  useEffect(() => {
    if (!spinning) setCurrent(pool[0] ?? null);
  }, [pool, spinning]);

  if (!current) {
    return (
      <div className="text-center">
        <p className={`font-display text-4xl italic ${accentClass}`}>SIN HÉROES</p>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mt-2">
          Reinicia el pool para volver a sortear
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-2xl overflow-hidden border-2 transition-all"
        style={{
          borderColor: spinning ? current.color : "transparent",
          boxShadow: spinning
            ? `0 0 40px ${current.color}99, inset 0 0 20px ${current.color}40`
            : `0 0 20px ${current.color}55`,
        }}
        key={`${current.id}-${spinning ? "spin" : "idle"}`}
      >
        <HeroImage
          name={current.name}
          color={current.color}
          imageId={current.id}
          imageUrl={current.imageUrl}
          className="w-full h-full"
        />
        {spinning && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30 pointer-events-none" />
        )}
      </div>
      <p
        className={`font-display text-3xl sm:text-4xl italic tracking-tight ${spinning ? "pulse-glow" : ""}`}
        style={{ color: current.color, textShadow: `0 0 20px ${current.color}` }}
      >
        {current.name}
      </p>
      <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
        {spinning ? "Escaneando..." : "Listo para sortear"}
      </p>
    </div>
  );
}
