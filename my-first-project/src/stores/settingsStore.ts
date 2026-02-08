import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Settings } from '../types';

interface SettingsState extends Settings {
  setTheme: (theme: Settings['theme']) => void;
  setLanguage: (language: Language) => void;
  setAutoSaveInterval: (interval: number) => void;
  setFontSize: (size: Settings['fontSize']) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      autoSaveInterval: 30000,
      fontSize: 'medium',

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.remove('light', 'dark', 'sepia');
        document.documentElement.classList.add(theme);
      },

      setLanguage: (language) => {
        set({ language });
      },

      setAutoSaveInterval: (interval) => {
        set({ autoSaveInterval: interval });
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
