import { Link } from "@tanstack/react-router";
import { Monitor, Settings, Volume2, VolumeX, History, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { isMuted, setMuted } from "@/lib/sound";
import { useTheme } from "@/lib/use-theme";
import rapsorLogo from "@/assets/rapsor-lettering.png";

interface Props {
  rightExtras?: React.ReactNode;
  onLogoClick?: () => void;
}

export function SiteHeader({ rightExtras, onLogoClick }: Props) {
  const [mutedState, setMutedState] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const toggleMute = () => {
    const next = !mutedState;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link to="/" onClick={onLogoClick} className="flex items-center">
          <img
            src={rapsorLogo}
            alt="Rapsor"
            className="h-12 sm:h-16 w-auto drop-shadow-[0_0_20px_oklch(0.55_0.25_290_/_0.6)]"
            width={1920}
            height={720}
          />
        </Link>

        <nav className="flex items-center gap-2">
          {rightExtras}
          <Link
            to="/historial"
            activeProps={{ className: "bg-[var(--neon-yellow)]/15 text-[var(--neon-yellow)]" }}
            className="p-2.5 rounded-xl bg-foreground/5 text-foreground/40 hover:text-foreground transition-all"
            aria-label="Historial"
          >
            <History size={18} />
          </Link>
          <Link
            to="/overlay"
            className="p-2.5 rounded-xl bg-foreground/5 text-foreground/40 hover:text-foreground transition-all"
            aria-label="Overlay"
          >
            <Monitor size={18} />
          </Link>
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-foreground/5 text-foreground/40 hover:text-foreground transition-all"
            aria-label={mutedState ? "Activar sonido" : "Silenciar"}
          >
            {mutedState ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-foreground/5 text-foreground/40 hover:text-foreground transition-all"
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/admin"
            activeProps={{
              className: "bg-[var(--neon-yellow)] text-background",
            }}
            className="p-2.5 rounded-xl bg-[var(--neon-yellow)]/10 text-[var(--neon-yellow)] border border-[var(--neon-yellow)]/30 hover:bg-[var(--neon-yellow)] hover:text-background transition-all"
            aria-label="Admin"
          >
            <Settings size={18} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
