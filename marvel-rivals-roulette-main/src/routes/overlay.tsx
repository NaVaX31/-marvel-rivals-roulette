import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, type Hero, type MerchItem, type Role } from "@/lib/rivals-data";
import { HeroImage } from "@/components/HeroImage";
import { useHeroes, useMerch } from "@/lib/use-rivals-store";
import { playTick, playWinner } from "@/lib/sound";
import { recordHeroWin, recordMerchWin } from "@/lib/history";

export const Route = createFileRoute("/overlay")({
  component: OverlayPage,
  head: () => ({
    meta: [
      { title: "Stream Overlay — Marvel Rivals Giveaway" },
      { name: "description", content: "Overlay transparente para OBS." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Winner =
  | (Hero & { kind: "hero" })
  | (MerchItem & { kind: "merch" });

function OverlayPage() {
  const [heroes] = useHeroes();
  const [merch, setMerch] = useMerch();
  const [winner, setWinner] = useState<Winner | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteName, setRouletteName] = useState("");
  const [activeRole, setActiveRole] = useState<Role | "merch">("Duelist");

  const start = () => {
    if (isSpinning) return;
    setWinner(null);
    setIsSpinning(true);
    let counter = 0;

    if (activeRole === "merch") {
      const pool = merch.filter((m) => m.stock > 0);
      if (pool.length === 0) {
        setIsSpinning(false);
        return;
      }
      const interval = setInterval(() => {
        setRouletteName(pool[Math.floor(Math.random() * pool.length)].name);
        playTick();
        counter++;
        if (counter >= 40) {
          clearInterval(interval);
          const win = pool[Math.floor(Math.random() * pool.length)];
          setWinner({ ...win, kind: "merch" });
          setIsSpinning(false);
          setMerch((prev) =>
            prev.map((m) => (m.id === win.id ? { ...m, stock: m.stock - 1 } : m)),
          );
          playWinner();
          void recordMerchWin(win);
        }
      }, 55);
    } else {
      const pool = heroes.filter((h) => h.role === activeRole);
      if (pool.length === 0) {
        setIsSpinning(false);
        return;
      }
      const interval = setInterval(() => {
        setRouletteName(pool[Math.floor(Math.random() * pool.length)].name);
        playTick();
        counter++;
        if (counter >= 30) {
          clearInterval(interval);
          const win = pool[Math.floor(Math.random() * pool.length)];
          setWinner({ ...win, kind: "hero" });
          setIsSpinning(false);
          playWinner();
          void recordHeroWin(win);
        }
      }, 70);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      {/* Floating controls — invisible in OBS by cropping these out */}
      <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-2 bg-background/80 backdrop-blur-sm p-3 rounded-2xl border border-border">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground self-center mr-2">
          Overlay control
        </p>
        {(["Vanguard", "Duelist", "Strategist", "merch"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setActiveRole(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
              activeRole === k
                ? "bg-[var(--neon-yellow)] text-background"
                : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            {k === "merch" ? "Premios" : CATEGORIES[k].title}
          </button>
        ))}
        <button
          onClick={start}
          disabled={isSpinning}
          className="px-4 py-1.5 rounded-lg bg-[var(--neon-yellow)] text-background text-[10px] font-black tracking-widest uppercase disabled:opacity-30"
        >
          {isSpinning ? "Girando..." : "Iniciar"}
        </button>
        <button
          onClick={() => setWinner(null)}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white text-[10px] font-black tracking-widest uppercase"
        >
          Limpiar
        </button>
        <Link
          to="/"
          className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white"
          aria-label="Salir"
        >
          <X size={14} />
        </Link>
      </div>

      {winner ? (
        <div className="scale-up-center text-center">
          <p className="font-display text-2xl tracking-[0.5em] text-[var(--neon-yellow)] text-glow-yellow mb-6">
            ¡GANADOR!
          </p>
          {winner.kind === "hero" ? (
            <>
              <div
                className="w-80 h-96 sm:w-[420px] sm:h-[520px] rounded-3xl overflow-hidden mx-auto"
                style={{ boxShadow: `0 0 80px ${winner.color}` }}
              >
                <HeroImage
                  name={winner.name}
                  color={winner.color}
                  imageId={winner.id}
                  imageUrl={winner.imageUrl}
                  className="w-full h-full"
                />
              </div>
              <p
                className="font-display italic tracking-tight mt-6 text-7xl sm:text-8xl"
                style={{ color: winner.color, textShadow: `0 0 40px ${winner.color}` }}
              >
                {winner.name}
              </p>
            </>
          ) : (
            <>
              <div
                className="w-72 h-72 sm:w-96 sm:h-96 mx-auto rounded-3xl flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${winner.color}40, transparent 70%)`,
                  boxShadow: `0 0 80px ${winner.color}`,
                }}
              >
                <div
                  className="w-40 h-40 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${winner.color}, ${winner.color}40)`,
                    boxShadow: `0 0 40px ${winner.color}`,
                  }}
                />
              </div>
              <p
                className="font-display italic tracking-tight mt-6 text-7xl sm:text-8xl"
                style={{ color: winner.color, textShadow: `0 0 40px ${winner.color}` }}
              >
                {winner.name}
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="font-display text-7xl sm:text-9xl tracking-widest text-white/40 pulse-glow">
          {isSpinning ? rouletteName || "ESCANEANDO..." : "WAITING..."}
        </p>
      )}
    </div>
  );
}
