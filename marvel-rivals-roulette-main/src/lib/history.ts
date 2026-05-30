import { supabase } from "@/integrations/supabase/client";
import type { Hero, MerchItem, PlatformItem } from "./rivals-data";

export interface HistoryEntry {
  id: string;
  winner_name: string;
  winner_type: "hero" | "merch";
  role: string | null;
  rarity: string | null;
  color: string | null;
  created_at: string;
}

export async function recordHeroWin(hero: Hero) {
  const { error } = await supabase.from("giveaway_history").insert({
    winner_name: hero.name,
    winner_type: "hero",
    role: hero.role,
    rarity: hero.rarity,
    color: hero.color,
  });
  if (error) console.error("recordHeroWin", error);
}

export async function recordMerchWin(item: MerchItem) {
  const { error } = await supabase.from("giveaway_history").insert({
    winner_name: item.name,
    winner_type: "merch",
    role: item.type,
    rarity: null,
    color: item.color,
  });
  if (error) console.error("recordMerchWin", error);
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from("giveaway_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("fetchHistory", error);
    return [];
  }
  return (data ?? []) as HistoryEntry[];
}

export function exportHistoryCsv(entries: HistoryEntry[]): string {
  const header = ["Fecha", "Tipo", "Ganador", "Rol/Categoría", "Rareza"];
  const escape = (v: string | null) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const rows = entries.map((e) =>
    [
      new Date(e.created_at).toLocaleString(),
      e.winner_type === "hero" ? "Héroe" : "Premio",
      e.winner_name,
      e.role ?? "",
      e.rarity ?? "",
    ]
      .map(escape)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function recordPlatformWin(item: PlatformItem) {
  const { error } = await supabase.from("giveaway_history").insert({
    winner_name: item.name,
    winner_type: "merch",
    role: item.type,
    rarity: "Plataforma",
    color: item.color,
  });
  if (error) console.error("recordPlatformWin", error);
}
