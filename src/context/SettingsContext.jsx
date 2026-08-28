import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  theme: 'dark', // 'dark' | 'light'
  animations: true,
  sound: true,
  language: 'id' // 'id' | 'en'
};

const STORAGE_KEY = 'azryai_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle('light', settings.theme === 'light');
    document.documentElement.classList.toggle('reduce-motion', !settings.animations);
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('azryai_conversations');
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, clearHistory }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings harus dipakai di dalam SettingsProvider');
  return ctx;
}
