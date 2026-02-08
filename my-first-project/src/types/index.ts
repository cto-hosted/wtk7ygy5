export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  createdAt: number;
  updatedAt?: number;
}

export type Theme = 'light' | 'dark' | 'sepia';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'pt';

export interface Settings {
  theme: Theme;
  language: Language;
  autoSaveInterval: number;
  fontSize: 'small' | 'medium' | 'large';
}
