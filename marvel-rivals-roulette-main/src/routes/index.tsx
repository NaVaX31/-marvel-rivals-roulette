import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, Gift, RotateCcw } from "lucide-react";
import { CATEGORIES, type Hero, type MerchItem, type Role } from "@/lib/rivals-data";
import { HeroImage } from "@/components/HeroImage";
import { SiteHeader } from "@/components/SiteHeader";
import { useHeroes, useMerch, usePlayedHeroIds } from "@/lib/use-rivals-store";
import { playTick, playWinner } from "@/lib/sound";
import { recordHeroWin, recordMerchWin } from "@/lib/history";
import { WinnerModal } from "@/components/WinnerModal";
import { StreamerCard } from "@/components/StreamerCard";
import { HeroRoulette } from "@/components/HeroRoulette";
import { HeroRosterCard } from "@/components/HeroRosterCard";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Marvel Rivals — Giveaway Engine" },
      {
        name: "description",
        content: "Sortea héroes y premios oficiales de Marvel Rivals con overlay para stream.",
      },
      { property: "og:title", content: "Marvel Rivals — Giveaway Engine" },
      {
        property: "og:description",
        content: "Sortea héroes y premios oficiales de Marvel Rivals con overlay para stream.",
      },
    ],
  }),
});

export type Winner =
  | (Hero & { kind: "hero" })
  | (MerchItem & { kind: "merch" });

function HomePage() {
  const [mode, setMode] = useState<"heroes" | "merch">("heroes");
  const [selectedCategory, setSelectedCategory] = useState<Role | null>(null);
  const [heroes] = useHeroes();
  const [merch, setMerch] = useMerch();
  const [playedIds, setPlayedIds] = usePlayedHeroIds();

  const [winner, setWinner] = useState<Winner | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteName, setRouletteName] = useState("");
  const [rouletteColor, setRouletteColor] = useState<string>("#facc15");
  const [pendingSpin, setPendingSpin] = useState<(() => void) | null>(null);

  const startWithCountdown = (fn: () => void) => {
    if (isSpinning || pendingSpin) return;
    // Desconteo eliminado — ejecutar inmediatamente.
    fn();
  };

  const playedSet = useMemo(() => new Set(playedIds), [playedIds]);

  const availableInCategory = (cat: Role) =>
    heroes.filter((h) => h.role === cat && !playedSet.has(h.id));

  const handleHeroFinish = (win: Hero) => {
    setWinner({ ...win, kind: "hero" });
    setIsSpinning(false);
    setPlayedIds((prev) => (prev.includes(win.id) ? prev : [...prev, win.id]));
    void recordHeroWin(win);
  };

  const handleStartHeroSpin = () => {
    if (isSpinning || !selectedCategory) return;
    if (availableInCategory(selectedCategory).length === 0) return;
    setWinner(null);
    setIsSpinning(true);
  };

  const resetCategoryPool = (cat: Role) => {
    setPlayedIds((prev) => prev.filter((id) => heroes.find((h) => h.id === id)?.role !== cat));
  };

  const handleRandomizeMerch = () => {
    if (isSpinning) return;
    const pool = merch.filter((m) => m.stock > 0);
    if (pool.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    // Selección ponderada por weight
    const pickWeighted = (items: typeof pool) => {
      const total = items.reduce((s, m) => s + Math.max(0, (m as MerchItem & { weight?: number }).weight ?? 1), 0);
      if (total <= 0) return items[Math.floor(Math.random() * items.length)];
      let r = Math.random() * total;
      for (const item of items) {
        r -= Math.max(0, (item as MerchItem & { weight?: number }).weight ?? 1);
        if (r <= 0) return item;
      }
      return items[items.length - 1];
    };

    const win = pickWeighted(pool);
    const totalDuration = 7000;
    let elapsed = 0;
    let lastIdx = -1;

    const tick = () => {
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const interval = 50 + eased * 550;

      let idx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && idx === lastIdx) idx = (idx + 1) % pool.length;
      lastIdx = idx;
      setRouletteName(pool[idx].name);
      setRouletteColor(pool[idx].color);
      playTick();

      elapsed += interval;
      if (progress >= 1) {
        setRouletteName(win.name);
        setRouletteColor(win.color);
        setWinner({ ...win, kind: "merch" });
        setIsSpinning(false);
        setMerch((prev) =>
          prev.map((m) => (m.id === win.id ? { ...m, stock: m.stock - 1 } : m)),
        );
        playWinner();
        void recordMerchWin(win);
        return;
      }
      window.setTimeout(tick, interval);
    };

    window.setTimeout(tick, 50);
  };

  return (
    <div className="relative min-h-screen text-foreground grid-bg overflow-hidden">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-30 pointer-events-none"
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 -z-10 bg-background/40 pointer-events-none" />
      <SiteHeader
        onLogoClick={() => {
          setSelectedCategory(null);
          setMode("heroes");
        }}
        rightExtras={
          <div className="flex bg-card/60 rounded-xl p-1 border border-border mr-1">
            <button
              onClick={() => {
                setMode("heroes");
                setSelectedCategory(null);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                mode === "heroes" ? "bg-white/10 text-white" : "text-white/30"
              }`}
            >
              Héroes
            </button>
            <button
              onClick={() => {
                setMode("merch");
                setSelectedCategory(null);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                mode === "merch" ? "bg-white/10 text-white" : "text-white/30"
              }`}
            >
              Premios
            </button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {!selectedCategory ? (
          <section>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-display text-5xl sm:text-7xl italic tracking-tight">
                <span className="text-muted-foreground">SORTEO DE </span>
                <span className="text-[var(--neon-yellow)] text-glow-yellow">
                  {mode === "heroes" ? "HÉROES" : "PREMIOS"}
                </span>
              </h2>
              <p className="mt-3 text-sm tracking-[0.3em] uppercase text-muted-foreground">
                Selecciona para empezar el escaneo
              </p>
            </div>

            {mode === "heroes" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(Object.entries(CATEGORIES) as [Role, (typeof CATEGORIES)[Role]][]).map(
                    ([key, cat]) => {
                      const CatIcon = cat.icon;
                      const total = heroes.filter((h) => h.role === key).length;
                      const remaining = availableInCategory(key).length;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(key)}
                          className={`group relative p-10 sm:p-12 rounded-3xl bg-card/40 border border-border cursor-pointer transition-all hover:-translate-y-2 hover:bg-card/80 text-left scanline overflow-hidden ${cat.borderClass}`}
                        >
                          <div className="flex items-center justify-between mb-8">
                            <div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.bgClass}/20`}
                            >
                              <CatIcon className={`w-8 h-8 ${cat.textClass}`} />
                            </div>
                            <div className="text-right">
                              <span className="font-display text-5xl text-white/10 block leading-none">
                                {String(remaining).padStart(2, "0")}
                              </span>
                              <span className="text-[9px] tracking-widest uppercase text-muted-foreground">
                                de {total} disponibles
                              </span>
                            </div>
                          </div>
                          <h3
                            className={`font-display text-4xl sm:text-5xl italic tracking-tight ${cat.textClass}`}
                          >
                            {cat.title}
                          </h3>
                          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-2">
                            {cat.label}
                          </p>
                        </button>
                      );
                    },
                  )}
                </div>
                <StreamerCard />
              </>
            ) : mode === "merch" ? (
              <div className="max-w-3xl mx-auto">
                <div className="relative p-10 sm:p-14 rounded-3xl bg-card/40 border border-border scanline overflow-hidden">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--neon-yellow)]/10 border border-[var(--neon-yellow)]/40 mb-6">
                      <Gift className="w-10 h-10 text-[var(--neon-yellow)]" />
                    </div>
                    <h3 className="font-display text-4xl sm:text-5xl italic tracking-tight text-glow-yellow text-[var(--neon-yellow)]">
                      GIVEAWAY MERCH
                    </h3>
                    <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-2">
                      Haz clic para iniciar el sorteo aleatorio
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {merch.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-background/40 border border-border text-center"
                        style={{ borderColor: `${m.color}40` }}
                      >
                        {m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-14 h-14 mx-auto mb-2 object-contain drop-shadow-lg"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 mx-auto mb-2 rounded-lg"
                            style={{
                              background: `linear-gradient(135deg, ${m.color}, ${m.color}40)`,
                              boxShadow: `0 0 16px ${m.color}66`,
                            }}
                          />
                        )}
                        <p className="text-[10px] font-bold tracking-widest uppercase truncate" style={{ color: m.color }}>
                          {m.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isSpinning ? (
                    <div
                      className="text-center py-8 mb-4 rounded-2xl bg-background/40 border-2"
                      style={{
                        borderColor: rouletteColor,
                        boxShadow: `0 0 30px ${rouletteColor}66`,
                      }}
                    >
                      <p
                        className="font-display text-4xl pulse-glow"
                        style={{ color: rouletteColor, textShadow: `0 0 20px ${rouletteColor}` }}
                      >
                        {rouletteName}
                      </p>
                    </div>
                  ) : null}

                  <button
                    onClick={() => startWithCountdown(handleRandomizeMerch)}
                    disabled={isSpinning || !!pendingSpin || merch.every((m) => m.stock === 0)}
                    className="w-full py-7 rounded-2xl bg-[var(--neon-yellow)] text-background font-display text-3xl italic tracking-tight active:scale-95 disabled:opacity-30 transition-all hover:brightness-110"
                    style={{ boxShadow: "0 0 40px oklch(0.88 0.2 95 / 0.5)" }}
                  >
                    {isSpinning ? "GIRANDO..." : "GIRAR"}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          <CategoryView
            category={selectedCategory}
            availablePool={availableInCategory(selectedCategory)}
            allInCategory={heroes.filter((h) => h.role === selectedCategory)}
            playedSet={playedSet}
            isSpinning={isSpinning}
            isLocked={isSpinning || !!pendingSpin}
            onBack={() => setSelectedCategory(null)}
            onStart={() => startWithCountdown(handleStartHeroSpin)}
            onFinish={handleHeroFinish}
            onResetPool={() => resetCategoryPool(selectedCategory)}
          />
        )}

        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-16">
          ¿Quieres ver los ganadores anteriores?{" "}
          <Link to="/historial" className="text-[var(--neon-yellow)] hover:underline">
            Ver historial
          </Link>
        </p>
      </main>

      <Countdown
        active={!!pendingSpin}
        onComplete={() => {
          const fn = pendingSpin;
          setPendingSpin(null);
          fn?.();
        }}
      />
      <WinnerModal winner={winner} onClose={() => setWinner(null)} />
    </div>
  );
}

interface CategoryViewProps {
  category: Role;
  availablePool: Hero[];
  allInCategory: Hero[];
  playedSet: Set<number>;
  isSpinning: boolean;
  isLocked: boolean;
  onBack: () => void;
  onStart: () => void;
  onFinish: (h: Hero) => void;
  onResetPool: () => void;
}

function CategoryView({
  category,
  availablePool,
  allInCategory,
  playedSet,
  isSpinning,
  isLocked,
  onBack,
  onStart,
  onFinish,
  onResetPool,
}: CategoryViewProps) {
  const cat = CATEGORIES[category];
  const empty = availablePool.length === 0;

  return (
    <section>
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-white/30 hover:text-white font-black text-[10px] uppercase mb-10 tracking-[0.3em] transition-colors"
      >
        <ChevronLeft size={16} /> Volver al panel
      </button>

      <div className="flex justify-center">
        <div className="space-y-6 w-full max-w-2xl">
          <div
            className={`relative min-h-[22rem] rounded-3xl bg-card/40 border border-border flex items-center justify-center scanline overflow-hidden p-6 ${cat.borderClass}`}
          >
            <HeroRoulette
              pool={availablePool}
              spinning={isSpinning}
              onFinish={onFinish}
              accentClass={cat.textClass}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground px-1">
            <span>
              <span className={cat.textClass}>{availablePool.length}</span> /{" "}
              {allInCategory.length} disponibles
            </span>
            <button
              onClick={onResetPool}
              disabled={isLocked || playedSet.size === 0}
              className="flex items-center gap-2 hover:text-white transition-colors disabled:opacity-30"
            >
              <RotateCcw size={12} /> Reiniciar pool
            </button>
          </div>

          <button
            onClick={onStart}
            disabled={isLocked || empty}
            className={`w-full py-8 rounded-2xl font-display text-3xl italic tracking-tight transition-all active:scale-95 disabled:opacity-30 uppercase hover:brightness-110 text-white ${cat.bgClass}`}
          >
            {empty ? "POOL VACÍO" : isLocked ? "GIRANDO..." : "GIRAR"}
          </button>
        </div>

        {/* Panel de héroes oculto (se conserva el código)
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto pr-2">
          {allInCategory.map((h) => (
            <HeroRosterCard key={h.id} hero={h} played={playedSet.has(h.id)} />
          ))}
        </div>
        */}
      </div>
    </section>
  );
}
