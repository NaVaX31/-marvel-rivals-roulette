import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Trash2, Gift, Activity, Box, ShoppingBag, Tag, Plus, Upload, type LucideIcon } from "lucide-react";
import { INITIAL_HEROES, INITIAL_MERCH, type Hero, type MerchItem, type Rarity, type Role } from "@/lib/rivals-data";
import { useHeroes, useMerch } from "@/lib/use-rivals-store";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Control Center — Marvel Rivals Giveaway" },
      { name: "description", content: "Gestiona héroes y stock de premios del randomizer." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const MERCH_ICONS: Record<MerchItem["icon"], LucideIcon> = {
  ShoppingBag,
  Tag,
  Box,
  Activity,
};

function AdminPage() {
  const [heroes, setHeroes] = useHeroes();
  const [merch, setMerch] = useMerch();
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("Duelist");
  const [newRarity, setNewRarity] = useState<Rarity>("Épico");
  const [newColor, setNewColor] = useState("#facc15");
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  // New merch form
  const [newMerchName, setNewMerchName] = useState("");
  const [newMerchType, setNewMerchType] = useState("Accesorios");
  const [newMerchColor, setNewMerchColor] = useState("#facc15");
  const [newMerchStock, setNewMerchStock] = useState(5);
  const [newMerchIcon, setNewMerchIcon] = useState<MerchItem["icon"]>("Box");
  const [newMerchWeight, setNewMerchWeight] = useState(10);

  const addMerch = () => {
    const name = newMerchName.trim();
    if (!name) return;
    const item: MerchItem = {
      id: `m${Date.now()}`,
      name: name.toUpperCase(),
      type: newMerchType.trim() || "Accesorios",
      stock: Math.max(0, Number(newMerchStock) || 0),
      color: newMerchColor,
      icon: newMerchIcon,
      weight: Math.max(0, Number(newMerchWeight) || 0),
    };
    setMerch((prev) => [...prev, item]);
    setNewMerchName("");
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setNewImage(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const addHero = () => {
    const name = newName.trim();
    if (!name) return;
    const nextId = (heroes.reduce((m, h) => Math.max(m, h.id), 0) || 0) + 1;
    const hero: Hero = { id: nextId, name, role: newRole, rarity: newRarity, color: newColor, imageUrl: newImage };
    setHeroes((prev) => [...prev, hero]);
    setNewName("");
    setNewImage(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const totalWeight = merch.reduce((s, m) => s + Math.max(0, (m as MerchItem & { weight?: number }).weight ?? 1), 0);

  return (
    <div className="min-h-screen text-foreground grid-bg">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-white/30 hover:text-white font-black text-[10px] uppercase mb-8 tracking-[0.3em] transition-colors"
        >
          <ChevronLeft size={16} /> Volver al panel
        </Link>

        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <h2 className="font-display text-4xl sm:text-5xl italic tracking-tight">
            CONTROL <span className="text-[var(--neon-yellow)]">CENTER</span>
          </h2>
          <button
            onClick={() => {
              if (confirm("¿Resetear todos los datos?")) {
                setHeroes(INITIAL_HEROES);
                setMerch(INITIAL_MERCH);
              }
            }}
            className="px-5 py-3 bg-destructive/10 text-destructive rounded-xl font-black text-[10px] tracking-widest uppercase border border-destructive/30 hover:bg-destructive hover:text-white transition-all"
          >
            Resetear sistema
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREMIOS */}
          <div className="p-6 rounded-3xl bg-card/40 border border-border">
            <h3 className="font-display text-2xl mb-5 tracking-wide flex items-center gap-2">
              <Gift size={18} className="text-[var(--neon-yellow)]" /> STOCK PREMIOS{" "}
              <span className="text-muted-foreground text-base">({merch.length})</span>
            </h3>

            <div className="mb-5 p-4 rounded-2xl bg-background/40 border border-border space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Agregar nuevo premio
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newMerchName}
                  onChange={(e) => setNewMerchName(e.target.value)}
                  placeholder="Nombre"
                  className="col-span-2 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-[var(--neon-yellow)]"
                />
                <input
                  value={newMerchType}
                  onChange={(e) => setNewMerchType(e.target.value)}
                  placeholder="Tipo (Ropa, Celosía...)"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                />
                <select
                  value={newMerchIcon}
                  onChange={(e) => setNewMerchIcon(e.target.value as MerchItem["icon"])}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                  <option value="ShoppingBag">ShoppingBag</option>
                  <option value="Tag">Tag</option>
                  <option value="Box">Box</option>
                  <option value="Activity">Activity</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={newMerchStock}
                  onChange={(e) => setNewMerchStock(Number(e.target.value))}
                  placeholder="Stock"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                />
                <input
                  type="number"
                  min={0}
                  value={newMerchWeight}
                  onChange={(e) => setNewMerchWeight(Number(e.target.value))}
                  placeholder="Peso (%)"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                />
                <input
                  type="color"
                  value={newMerchColor}
                  onChange={(e) => setNewMerchColor(e.target.value)}
                  className="h-9 w-full rounded-lg bg-background border border-border cursor-pointer col-span-2"
                />
                <button
                  onClick={addMerch}
                  disabled={!newMerchName.trim()}
                  className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--neon-yellow)] text-background font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:brightness-110 transition-all"
                >
                  <Plus size={14} /> Agregar premio
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {merch.map((m) => {
                const Icon = MERCH_ICONS[m.icon];
                const w = (m as MerchItem & { weight?: number }).weight ?? 1;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ backgroundColor: `${m.color}25` }}
                      >
                        {(m as MerchItem & { imageUrl?: string }).imageUrl ? (
                          <img
                            src={(m as MerchItem & { imageUrl?: string }).imageUrl}
                            alt={m.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Icon size={16} style={{ color: m.color }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          value={m.name}
                          onChange={(e) =>
                            setMerch((prev) =>
                              prev.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x)),
                            )
                          }
                          className="w-full bg-transparent font-bold text-sm uppercase tracking-wider focus:outline-none focus:bg-background/60 rounded px-1"
                        />
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{m.type}</span>
                          <span className="text-[9px] text-muted-foreground">
                            peso:
                            <input
                              type="number"
                              min={0}
                              value={w}
                              onChange={(e) =>
                                setMerch((prev) =>
                                  prev.map((x) => (x.id === m.id ? { ...x, weight: Number(e.target.value) } : x)),
                                )
                              }
                              className="w-10 ml-1 bg-background/60 border border-border rounded px-1 text-[9px] text-foreground"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setMerch((prev) =>
                            prev.map((x) =>
                              x.id === m.id ? { ...x, stock: Math.max(0, x.stock - 1) } : x,
                            ),
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-black"
                      >
                        -
                      </button>
                      <span className="font-display text-xl w-8 text-center">{m.stock}</span>
                      <button
                        onClick={() =>
                          setMerch((prev) =>
                            prev.map((x) => (x.id === m.id ? { ...x, stock: x.stock + 1 } : x)),
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-black"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setMerch((prev) => prev.filter((x) => x.id !== m.id))}
                        className="text-destructive/40 hover:text-destructive p-2 transition-colors"
                        aria-label={`Eliminar ${m.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HÉROES */}
          <div className="p-6 rounded-3xl bg-card/40 border border-border">
            <h3 className="font-display text-2xl mb-5 tracking-wide">
              HÉROES DISPONIBLES{" "}
              <span className="text-muted-foreground text-base">({heroes.length})</span>
            </h3>

            <div className="mb-5 p-4 rounded-2xl bg-background/40 border border-border space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Agregar nuevo héroe
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre"
                  className="col-span-1 sm:col-span-2 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-[var(--neon-yellow)]"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                  <option value="Vanguard">Vanguard</option>
                  <option value="Duelist">Duelist</option>
                  <option value="Strategist">Strategist</option>
                </select>
                <select
                  value={newRarity}
                  onChange={(e) => setNewRarity(e.target.value as Rarity)}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                  <option value="Legendario">Legendario</option>
                  <option value="Épico">Épico</option>
                  <option value="Raro">Raro</option>
                </select>
                <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-9 w-14 rounded-lg bg-background border border-border cursor-pointer"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-border text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <Upload size={14} /> {newImage ? "Cambiar imagen" : "Subir imagen"}
                  </button>
                  {newImage && (
                    <img src={newImage} alt="preview" className="h-9 w-9 rounded-md object-cover border border-border" />
                  )}
                  <button
                    onClick={addHero}
                    disabled={!newName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--neon-yellow)] text-background font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:brightness-110 transition-all"
                  >
                    <Plus size={14} /> Agregar al roster
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
              {heroes.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-background/40 border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {h.imageUrl ? (
                      <img
                        src={h.imageUrl}
                        alt={h.name}
                        className="w-8 h-8 rounded-md flex-shrink-0 object-cover border border-border"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-md flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${h.color}, ${h.color}40)`,
                        }}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{h.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        {h.role} · {h.rarity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setHeroes((prev) => prev.filter((x) => x.id !== h.id))}
                    className="text-destructive/40 hover:text-destructive p-2 transition-colors flex-shrink-0"
                    aria-label={`Eliminar ${h.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
