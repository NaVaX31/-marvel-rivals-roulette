import { Shield, Swords, Crosshair, type LucideIcon } from "lucide-react";

export type Role = "Vanguard" | "Duelist" | "Strategist";
export type Rarity = "Legendario" | "Épico" | "Raro";

export interface Hero {
  id: number;
  name: string;
  role: Role;
  rarity: Rarity;
  color: string;
  /** Optional custom image (data URL or remote URL) for user-added heroes. */
  imageUrl?: string;
}

export interface MerchItem {
  id: string;
  name: string;
  type: string;
  stock: number;
  color: string;
  icon: "ShoppingBag" | "Tag" | "Box" | "Activity";
}

export interface PlatformItem {
  id: string;
  name: string;
  type: string;
  stock: number;
  color: string;
  /** Probabilidad ponderada de salir en el sorteo (en %). El total debe sumar 100. */
  weight: number;
}


export const INITIAL_HEROES: Hero[] = [
  // Vanguards (Tanques)
  { id: 1, name: "Hulk", role: "Vanguard", rarity: "Legendario", color: "#4ade80" },
  { id: 5, name: "Doctor Strange", role: "Vanguard", rarity: "Legendario", color: "#facc15" },
  { id: 8, name: "Magneto", role: "Vanguard", rarity: "Legendario", color: "#991b1b" },
  { id: 12, name: "Groot", role: "Vanguard", rarity: "Épico", color: "#84cc16" },
  { id: 21, name: "Thor", role: "Vanguard", rarity: "Legendario", color: "#38bdf8" },
  { id: 38, name: "Venom", role: "Vanguard", rarity: "Legendario", color: "#1e293b" },
  { id: 43, name: "Captain America", role: "Vanguard", rarity: "Legendario", color: "#3b82f6" },
  { id: 49, name: "Peni Parker", role: "Vanguard", rarity: "Épico", color: "#ef4444" },
  { id: 51, name: "Emma Frost", role: "Vanguard", rarity: "Legendario", color: "#f5f5f5" },
  { id: 52, name: "The Thing", role: "Vanguard", rarity: "Épico", color: "#f97316" },
  { id: 53, name: "Angela", role: "Vanguard", rarity: "Legendario", color: "#fbbf24" },
  { id: 54, name: "Rogue", role: "Vanguard", rarity: "Legendario", color: "#10b981" },
  { id: 66, name: "Devil Dinosaur", role: "Vanguard", rarity: "Legendario", color: "#dc2626" },

  // Duelists (Daño)
  { id: 2, name: "Punisher", role: "Duelist", rarity: "Épico", color: "#ffffff" },
  { id: 3, name: "Storm", role: "Duelist", rarity: "Legendario", color: "#60a5fa" },
  { id: 7, name: "Spider-Man", role: "Duelist", rarity: "Legendario", color: "#ef4444" },
  { id: 9, name: "Magik", role: "Duelist", rarity: "Épico", color: "#fb923c" },
  { id: 10, name: "Namor", role: "Duelist", rarity: "Legendario", color: "#0ea5e9" },
  { id: 11, name: "Black Panther", role: "Duelist", rarity: "Legendario", color: "#8b5cf6" },
  { id: 13, name: "Star-Lord", role: "Duelist", rarity: "Legendario", color: "#f87171" },
  { id: 14, name: "Iron Man", role: "Duelist", rarity: "Legendario", color: "#fde047" },
  { id: 15, name: "Scarlet Witch", role: "Duelist", rarity: "Legendario", color: "#dc2626" },
  { id: 19, name: "Hela", role: "Duelist", rarity: "Épico", color: "#059669" },
  { id: 37, name: "Winter Soldier", role: "Duelist", rarity: "Legendario", color: "#94a3b8" },
  { id: 40, name: "Wolverine", role: "Duelist", rarity: "Legendario", color: "#fbbf24" },
  { id: 41, name: "Hawkeye", role: "Duelist", rarity: "Épico", color: "#a855f7" },
  { id: 44, name: "Black Widow", role: "Duelist", rarity: "Épico", color: "#dc2626" },
  { id: 46, name: "Iron Fist", role: "Duelist", rarity: "Épico", color: "#fbbf24" },
  { id: 47, name: "Moon Knight", role: "Duelist", rarity: "Legendario", color: "#e5e7eb" },
  { id: 48, name: "Psylocke", role: "Duelist", rarity: "Épico", color: "#ec4899" },
  { id: 50, name: "Squirrel Girl", role: "Duelist", rarity: "Raro", color: "#f97316" },
  { id: 55, name: "Mister Fantastic", role: "Duelist", rarity: "Épico", color: "#3b82f6" },
  { id: 56, name: "Human Torch", role: "Duelist", rarity: "Legendario", color: "#f97316" },
  { id: 57, name: "Phoenix", role: "Duelist", rarity: "Legendario", color: "#f43f5e" },
  { id: 58, name: "Blade", role: "Duelist", rarity: "Épico", color: "#7f1d1d" },
  { id: 59, name: "Deadpool", role: "Duelist", rarity: "Legendario", color: "#dc2626" },
  { id: 60, name: "Daredevil", role: "Duelist", rarity: "Épico", color: "#b91c1c" },
  { id: 61, name: "Gambit", role: "Duelist", rarity: "Épico", color: "#ec4899" },
  { id: 62, name: "Elsa Bloodstone", role: "Duelist", rarity: "Épico", color: "#a16207" },
  { id: 65, name: "Black Cat", role: "Duelist", rarity: "Legendario", color: "#e5e7eb" },

  // Strategists (Apoyo)
  { id: 4, name: "Loki", role: "Strategist", rarity: "Legendario", color: "#a855f7" },
  { id: 6, name: "Mantis", role: "Strategist", rarity: "Raro", color: "#4ade80" },
  { id: 16, name: "Rocket Raccoon", role: "Strategist", rarity: "Épico", color: "#f59e0b" },
  { id: 18, name: "Luna Snow", role: "Strategist", rarity: "Legendario", color: "#22d3ee" },
  { id: 20, name: "Jeff the Land Shark", role: "Strategist", rarity: "Raro", color: "#93c5fd" },
  { id: 39, name: "Adam Warlock", role: "Strategist", rarity: "Legendario", color: "#f59e0b" },
  { id: 42, name: "Invisible Woman", role: "Strategist", rarity: "Legendario", color: "#3b82f6" },
  { id: 45, name: "Cloak & Dagger", role: "Strategist", rarity: "Legendario", color: "#a78bfa" },
  { id: 63, name: "Ultron", role: "Strategist", rarity: "Legendario", color: "#9ca3af" },
  { id: 64, name: "White Fox", role: "Strategist", rarity: "Épico", color: "#f8fafc" },
];

export interface MerchItem {
  id: string;
  name: string;
  type: string;
  stock: number;
  color: string;
  icon: "ShoppingBag" | "Tag" | "Box" | "Activity";
  /** Probabilidad ponderada de salir en el sorteo (0-100). El total debe sumar 100. */
  weight: number;
  /** Imagen del premio (URL o ruta pública) */
  imageUrl?: string;
}

export const INITIAL_MERCH: MerchItem[] = [
  // Probabilidades ponderadas — suman 100% exactos.
  { id: "m1", name: "POLO",         type: "Ropa",    stock: 10, color: "#ef4444", icon: "ShoppingBag", weight: 25, imageUrl: "/premio-polo.png"    },
  { id: "m2", name: "POLERA",       type: "Ropa",    stock: 10, color: "#8b5cf6", icon: "ShoppingBag", weight: 5,  imageUrl: "/premio-polera.png"  },
  { id: "m3", name: "TAZA",         type: "Hogar",   stock: 20, color: "#f59e0b", icon: "Box",         weight: 25, imageUrl: "/premio-taza.png"    },
  { id: "m4", name: "100 CELOSÍA",  type: "Celosía", stock: 99, color: "#22d3ee", icon: "Activity",    weight: 25, imageUrl: "/premio-celosia.png" },
  { id: "m5", name: "500 CELOSÍA",  type: "Celosía", stock: 99, color: "#3b82f6", icon: "Activity",    weight: 15, imageUrl: "/premio-celosia.png" },
  { id: "m6", name: "1000 CELOSÍA", type: "Celosía", stock: 99, color: "#a855f7", icon: "Activity",    weight: 5,  imageUrl: "/premio-celosia.png" },
];

export const INITIAL_PLATFORMS: PlatformItem[] = [];


export interface CategoryDef {
  title: string;
  label: string;
  icon: LucideIcon;
  tokenClass: string;
  borderClass: string;
  textClass: string;
  bgClass: string;
}

export const CATEGORIES: Record<Role, CategoryDef> = {
  Vanguard: {
    title: "VANGUARDIA",
    label: "TANQUE",
    icon: Shield,
    tokenClass: "vanguard",
    borderClass: "neon-border-vanguard",
    textClass: "text-[oklch(0.7_0.2_240)]",
    bgClass: "bg-[oklch(0.7_0.2_240)]",
  },
  Duelist: {
    title: "DUELISTA",
    label: "DAÑO",
    icon: Swords,
    tokenClass: "duelist",
    borderClass: "neon-border-duelist",
    textClass: "text-[oklch(0.65_0.25_30)]",
    bgClass: "bg-[oklch(0.65_0.25_30)]",
  },
  Strategist: {
    title: "ESTRATEGA",
    label: "APOYO",
    icon: Crosshair,
    tokenClass: "strategist",
    borderClass: "neon-border-strategist",
    textClass: "text-[oklch(0.78_0.2_145)]",
    bgClass: "bg-[oklch(0.78_0.2_145)]",
  },
};
