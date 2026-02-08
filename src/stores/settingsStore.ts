import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Settings } from '../types'

interface SettingsState extends Settings {
  setTheme: (theme: Settings['theme']) => void
  setLanguage: (language: string) => void
  setFontSize: (fontSize: number) => void
  setFontFamily: (fontFamily: string) => void
  setAutoSave: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  setShowLineNumbers: (show: boolean) => void
  setWordWrap: (wrap: boolean) => void
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  fontSize: 16,
  fontFamily: 'Inter',
  autoSave: true,
  autoSaveInterval: 30000,
  showLineNumbers: false,
  wordWrap: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      setFontSize: (fontSize) => set({ fontSize }),

      setFontFamily: (fontFamily) => set({ fontFamily }),

      setAutoSave: (autoSave) => set({ autoSave }),

      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),

      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),

      setWordWrap: (wordWrap) => set({ wordWrap }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
