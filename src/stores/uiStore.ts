import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  viewMode: 'editor' | 'preview' | 'split'
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setViewMode: (mode: 'editor' | 'preview' | 'split') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  viewMode: 'editor',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  setViewMode: (mode) => set({ viewMode: mode }),
}))
