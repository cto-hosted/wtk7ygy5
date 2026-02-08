export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

export type Theme = 'light' | 'dark' | 'sepia';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'pt';

export interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
}
