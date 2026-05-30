import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Download, RefreshCw, Trophy, Gift, Swords, Shield, Crosshair } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  downloadCsv,
  exportHistoryCsv,
  fetchHistory,
  type HistoryEntry,
} from "@/lib/history";

export const Route = createFileRoute("/historial")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Historial de ganadores — Marvel Rivals Giveaway" },
      {
        name: "description",
        content: "Registro completo de héroes y premios sorteados, exportable a CSV.",
      },
      {
        property: "og:title",
        content: "Historial de ganadores — Marvel Rivals Giveaway",
      },
      {
        property: "og:description",
        content: "Registro completo de héroes y premios sorteados, exportable a CSV.",
      },
    ],
  }),
});

function roleIcon(role: string | null) {
  if (role === "Vanguard") return Shield;
  if (role === "Duelist") return Swords;
  if (role === "Strategist") return Crosshair;
  return Gift;
}

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
  }, []);

  const handleExport = () => {
    const csv = exportHistoryCsv(entries);
    downloadCsv(`marvel-rivals-historial-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const heroCount = entries.filter((e) => e.winner_type === "hero").length;
  const merchCount = entries.filter((e) => e.winner_type === "merch").length;

  return (
    <div className="min-h-screen text-foreground grid-bg">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-white/30 hover:text-white font-black text-[10px] uppercase mb-8 tracking-[0.3em] transition-colors"
        >
          <ChevronLeft size={16} /> Volver al panel
        </Link>

        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl italic tracking-tight">
              <span className="text-[var(--neon-yellow)] text-glow-yellow">HISTORIAL</span>{" "}
              <span className="text-muted-foreground">DE GANADORES</span>
            </h2>
            <p className="mt-2 text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Sincronizado en la nube · {entries.length} entradas
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void reload()}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              aria-label="Recargar"
            >
              <RefreshCw size={16} className={loading ? "spin-slow" : ""} />
            </button>
            <button
              onClick={handleExport}
              disabled={entries.length === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--neon-yellow)] text-background font-black text-[10px] tracking-widest uppercase hover:brightness-110 disabled:opacity-30 transition-all"
            >
              <Download size={14} /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-5 rounded-2xl bg-card/40 border border-border">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Héroes sorteados
            </p>
            <p className="font-display text-4xl text-[oklch(0.65_0.25_30)]">{heroCount}</p>
          </div>
          <div className="p-5 rounded-2xl bg-card/40 border border-border">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Premios entregados
            </p>
            <p className="font-display text-4xl text-[var(--neon-yellow)]">{merchCount}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-card/40 border border-border overflow-hidden">
          {loading ? (
            <p className="p-12 text-center text-muted-foreground text-sm uppercase tracking-widest">
              Cargando...
            </p>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-display text-2xl text-muted-foreground">
                Aún no hay sorteos registrados
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 mt-2">
                Inicia tu primer sorteo desde el panel principal
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {entries.map((e) => {
                const Icon = roleIcon(e.role);
                return (
                  <li
                    key={e.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${e.color ?? "#888"}, ${e.color ?? "#888"}30)`,
                        boxShadow: `0 0 20px ${e.color ?? "#888"}40`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white/90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{e.winner_name}</p>
                      <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
                        {e.winner_type === "hero" ? "Héroe" : "Premio"}
                        {e.role ? ` · ${e.role}` : ""}
                        {e.rarity ? ` · ${e.rarity}` : ""}
                      </p>
                    </div>
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground flex-shrink-0">
                      {new Date(e.created_at).toLocaleString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
