import { X } from "lucide-react";
import { HeroImage } from "./HeroImage";
import type { Winner } from "@/routes/index";

interface Props {
  winner: Winner | null;
  onClose: () => void;
}

export function WinnerModal({ winner, onClose }: Props) {
  if (!winner) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-card border border-[var(--neon-yellow)]/40 scale-up-center text-center"
        style={{ boxShadow: "0 0 80px oklch(0.88 0.2 95 / 0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/30 hover:text-white"
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>
        <p className="font-display text-xl tracking-[0.5em] text-[var(--neon-yellow)] text-glow-yellow mb-6">
          ¡GANADOR!
        </p>

        {winner.kind === "hero" ? (
          <>
            <div
              className="w-56 h-72 mx-auto rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 0 60px ${winner.color}80` }}
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
              className="font-display italic tracking-tight mt-6 text-4xl"
              style={{ color: winner.color, textShadow: `0 0 30px ${winner.color}` }}
            >
              {winner.name}
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mt-2">
              {winner.role} · {winner.rarity}
            </p>
          </>
        ) : (
          <>
            <div
              className="w-48 h-48 mx-auto rounded-3xl flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${winner.color}40, transparent 70%)`,
                boxShadow: `0 0 60px ${winner.color}80`,
              }}
            >
              {(winner as typeof winner & { imageUrl?: string }).imageUrl ? (
                <img
                  src={(winner as typeof winner & { imageUrl?: string }).imageUrl}
                  alt={winner.name}
                  className="w-36 h-36 object-contain drop-shadow-2xl"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${winner.color}, ${winner.color}40)`,
                    boxShadow: `0 0 30px ${winner.color}`,
                  }}
                />
              )}
            </div>
            <p
              className="font-display italic tracking-tight mt-6 text-4xl"
              style={{ color: winner.color, textShadow: `0 0 30px ${winner.color}` }}
            >
              {winner.name}
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mt-2">
              {winner.type}
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-8 w-full py-5 rounded-2xl bg-[var(--neon-yellow)] text-background font-display text-xl uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          Cerrar reporte
        </button>
      </div>
    </div>
  );
}
