interface Props {
  name: string;
  color: string;
  className?: string;
}

/** Decorative placeholder used until real hero artwork is dropped into public/heroes/. */
export function HeroPlaceholder({ name, color, className = "" }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${color}55, transparent 60%), linear-gradient(135deg, ${color}25, oklch(0.13 0.02 270))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <span
        className="font-display relative z-10 text-6xl sm:text-7xl font-black italic"
        style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}80` }}
      >
        {initials}
      </span>
      <div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />
    </div>
  );
}
