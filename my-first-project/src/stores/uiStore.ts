import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      commandPaletteOpen: false,

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.remove('light', 'dark', 'sepia');
        document.documentElement.classList.add(theme);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleCommandPalette: () => {
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },

      setCommandPaletteOpen: (open) => {
        set({ commandPaletteOpen: open });
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);
