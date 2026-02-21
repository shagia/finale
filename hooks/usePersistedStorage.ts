import { useState, useEffect, useCallback } from 'react';
import { type ViewMode } from '@/components/header';

// ---------------------------------------------------------------------------
// Generic persisted storage
// ---------------------------------------------------------------------------

const isWeb = typeof window !== 'undefined' && window.localStorage != null;

function getItem<T>(key: string): T | null {
  if (!isWeb) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw != null ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isWeb) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * Generic hook for a single persisted setting.
 * Use this for any key/value you want to persist (e.g. theme, sidebar collapsed).
 *
 * @param key - Storage key
 * @param defaultValue - Value when nothing is stored
 * @param persist - If false, behaves like useState (no persistence)
 */
export function usePersistedSetting<T>(
  key: string,
  defaultValue: T,
  persist: boolean = true
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValueState] = useState<T>(() => {
    if (persist) {
      const stored = getItem<T>(key);
      if (stored !== null) return stored;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (!persist) return;
    const stored = getItem<T>(key);
    if (stored !== null && stored !== value) {
      setValueState(stored);
    }
  }, [key, persist]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        if (persist) setItem(key, nextValue);
        return nextValue;
      });
    },
    [key, persist]
  );

  return [value, setValue];
}

// ---------------------------------------------------------------------------
// Explorer settings (view mode, sort, filter)
// ---------------------------------------------------------------------------

export type SortOption =
  | 'Name'
  | 'ProductionYear'
  | 'Random'
  | 'DateCreated'
  | 'Runtime';

export type ExplorerFilterOptions = {
  genre?: string | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  favoriteOnly?: boolean;
};

export interface ExplorerSettings {
  viewMode: ViewMode;
  sortBy: SortOption;
  filterOptions: ExplorerFilterOptions;
}

const EXPLORER_SETTINGS_KEY = 'explorer_settings';

const defaultExplorerSettings: ExplorerSettings = {
  viewMode: 'scrollview',
  sortBy: 'Name',
  filterOptions: {},
};

function getExplorerSettings(): ExplorerSettings {
  const stored = getItem<Partial<ExplorerSettings>>(EXPLORER_SETTINGS_KEY);
  if (!stored) return defaultExplorerSettings;
  return {
    viewMode: stored.viewMode ?? defaultExplorerSettings.viewMode,
    sortBy: stored.sortBy ?? defaultExplorerSettings.sortBy,
    filterOptions: { ...defaultExplorerSettings.filterOptions, ...stored.filterOptions },
  };
}

function setExplorerSettings(settings: ExplorerSettings): void {
  setItem(EXPLORER_SETTINGS_KEY, settings);
}

/**
 * Hook for all explorer UI settings (view mode, sort, filter).
 * Single source of truth; persisted under one key.
 */
export function useExplorerSettings(
  options: { persist?: boolean } = {}
): {
  settings: ExplorerSettings;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sortBy: SortOption) => void;
  setFilterOptions: (filterOptions: ExplorerFilterOptions | ((prev: ExplorerFilterOptions) => ExplorerFilterOptions)) => void;
  setSettings: (settings: Partial<ExplorerSettings> | ((prev: ExplorerSettings) => ExplorerSettings)) => void;
} {
  const { persist = true } = options;
  const [settings, setSettingsState] = useState<ExplorerSettings>(getExplorerSettings);

  useEffect(() => {
    if (!persist) return;
    const stored = getExplorerSettings();
    setSettingsState((prev) => ({
      ...prev,
      ...stored,
      filterOptions: { ...defaultExplorerSettings.filterOptions, ...stored.filterOptions },
    }));
  }, [persist]);

  const setSettings = useCallback(
    (next: Partial<ExplorerSettings> | ((prev: ExplorerSettings) => ExplorerSettings)) => {
      setSettingsState((prev) => {
        const nextSettings =
          typeof next === 'function'
            ? next(prev)
            : { ...prev, ...next };
        if (persist) setExplorerSettings(nextSettings);
        return nextSettings;
      });
    },
    [persist]
  );

  const setViewMode = useCallback(
    (viewMode: ViewMode) => setSettings({ viewMode }),
    [setSettings]
  );
  const setSortBy = useCallback(
    (sortBy: SortOption) => setSettings({ sortBy }),
    [setSettings]
  );
  const setFilterOptions = useCallback(
    (filterOptions: ExplorerFilterOptions | ((prev: ExplorerFilterOptions) => ExplorerFilterOptions)) => {
      setSettings((prev) => ({
        ...prev,
        filterOptions: typeof filterOptions === 'function' ? filterOptions(prev.filterOptions) : filterOptions,
      }));
    },
    [setSettings]
  );

  return {
    settings,
    setViewMode,
    setSortBy,
    setFilterOptions,
    setSettings,
  };
}

// ---------------------------------------------------------------------------
// Backward-compatible view-mode-only API
// ---------------------------------------------------------------------------

/**
 * Convenience hook for view mode only. When persist is true, uses the same persisted explorer settings.
 * Prefer useExplorerSettings() when you need sort/filter too.
 *
 * @param initialViewMode - Default when nothing is stored; when persist is false, used as initial in-memory value.
 * @param persist - When true (default), view mode is read/written from persisted explorer settings.
 */
export function useViewMode(
  initialViewMode?: ViewMode,
  persist: boolean = true
): {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
} {
  const persisted = useExplorerSettings({ persist });
  const [localViewMode, setLocalViewMode] = useState<ViewMode>(
    () => initialViewMode ?? persisted.settings.viewMode ?? 'scrollview'
  );

  if (persist) {
    return {
      viewMode: persisted.settings.viewMode,
      setViewMode: persisted.setViewMode,
    };
  }
  return {
    viewMode: localViewMode,
    setViewMode: setLocalViewMode,
  };
}
