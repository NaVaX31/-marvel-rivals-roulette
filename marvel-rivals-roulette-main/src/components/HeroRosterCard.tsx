import type { Hero, Rarity } from "@/lib/rivals-data";
import { CATEGORIES } from "@/lib/rivals-data";
import { HeroImage } from "./HeroImage";
import { Star } from "lucide-react";

interface Props {
  hero: Hero;
  played: boolean;
}

const RARITY_STARS: Record<Rarity, number> = {
  Legendario: 5,
  Épico: 4,
  Raro: 3,
};

/**
 * Roster card with FIXED dimensions so every role (Vanguard, Duelist,
 * Strategist) renders identically regardless of how many heroes are in
 * the grid. Uses fixed pixel heights instead of aspect-ratio to avoid
 * collapse inside scrollable grids.
 */
export function HeroRosterCard({ hero, played }: Props) {
  const cat = CATEGORIES[hero.role];
  const RoleIcon = cat.icon;
  const stars = RARITY_STARS[hero.rarity];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-card border transition-all ${
        played
          ? "border-border/40 opacity-40 grayscale"
          : "border-border hover:border-white/40 hover:-translate-y-1 hover:shadow-2xl"
      }`}
      style={{ height: "300px", display: "flex", flexDirection: "column" }}
    >
      {/* Portrait — fixed height */}
      <div className="relative w-full overflow-hidden bg-background/60" style={{ height: "210px", flexShrink: 0 }}>
        <HeroImage
          name={hero.name}
          color={hero.color}
          imageId={hero.id}
          imageUrl={hero.imageUrl}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

        {/* Name band */}
        <div
          className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-between border-t-2"
          style={{
            background: `linear-gradient(90deg, ${hero.color}cc, ${hero.color}77)`,
            borderColor: hero.color,
          }}
        >
          <span className="font-display text-sm sm:text-base italic tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
            {hero.name}
          </span>
          <RoleIcon className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex-shrink-0" />
        </div>

        {played && (
          <div className="absolute top-2 right-2 bg-background/90 border border-border rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
            OUT
          </div>
        )}
      </div>

      {/* Footer — fills remaining 90px */}
      <div className="px-3 py-2 bg-card flex flex-col gap-1 flex-1">
        <p className="font-display text-base leading-tight tracking-wide truncate">
          {hero.name}
        </p>
        <div className="flex items-center gap-1.5">
          <RoleIcon className={`w-3 h-3 ${cat.textClass}`} />
          <span className={`text-[10px] uppercase tracking-widest ${cat.textClass}`}>
            {cat.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < stars
                  ? "fill-[var(--neon-yellow)] text-[var(--neon-yellow)]"
                  : "fill-transparent text-muted-foreground/40"
              }`}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
