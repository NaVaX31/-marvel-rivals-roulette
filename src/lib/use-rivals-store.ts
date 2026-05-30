import { useEffect, useState } from "react";
import { INITIAL_HEROES, INITIAL_MERCH, INITIAL_PLATFORMS, type Hero, type MerchItem, type PlatformItem } from "./rivals-data";

/** Bump this whenever INITIAL_HEROES / INITIAL_MERCH / INITIAL_PLATFORMS change so clients re-sync. */
const ROSTER_VERSION = "v7-merch-images";
const VERSION_KEY = "marvel_rivals_roster_version";

function useLocal<T>(key: string, initial: T, alwaysReset = false) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage AFTER mount to avoid SSR hydration mismatches.
  useEffect(() => {
    try {
      const storedVersion = window.localStorage.getItem(VERSION_KEY);
      if (storedVersion !== ROSTER_VERSION) {
        // Roster definition changed — overwrite cached snapshot with fresh defaults.
        window.localStorage.setItem(key, JSON.stringify(initial));
        if (alwaysReset) {
          // (kept for symmetry; version bump already forces reset)
        }
        setValue(initial);
      } else {
        const raw = window.localStorage.getItem(key);
        if (raw) setValue(JSON.parse(raw) as T);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.localStorage.setItem(VERSION_KEY, ROSTER_VERSION);
    } catch {
      /* ignore */
    }
  }, [key, value, hydrated]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);
  return [value, setValue] as const;
}

export const useHeroes = () => useLocal<Hero[]>("marvel_rivals_heroes_lovable", INITIAL_HEROES);
export const useMerch = () => useLocal<MerchItem[]>("marvel_rivals_merch_lovable", INITIAL_MERCH);
/** IDs of heroes that have already won and are removed from the active pool. */
export const usePlayedHeroIds = () =>
  useLocal<number[]>("marvel_rivals_played_hero_ids_lovable", []);
export const usePlatforms = () =>
  useLocal<PlatformItem[]>("marvel_rivals_platforms_lovable", INITIAL_PLATFORMS);
