import { HeroPlaceholder } from "./HeroPlaceholder";

// Vite glob import: bundles all hero images and returns URL strings.
const heroImages = import.meta.glob("@/assets/heroes/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const heroById: Record<number, string> = {};
for (const [path, url] of Object.entries(heroImages)) {
  const match = path.match(/MARVEL_RIVALS(\d+)\.webp$/);
  if (match) heroById[Number(match[1])] = url;
}

interface Props {
  name: string;
  color: string;
  imageId: number;
  imageUrl?: string;
  className?: string;
}

export function HeroImage({ name, color, imageId, imageUrl, className = "" }: Props) {
  const src = imageUrl || heroById[imageId];
  if (!src) {
    return <HeroPlaceholder name={name} color={color} className={className} />;
  }
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}
