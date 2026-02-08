export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folderId?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: number;
  children?: Folder[];
  expanded?: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId?: string;
  children?: FileNode[];
  expanded?: boolean;
  createdAt: number;
  updatedAt?: number;
  content?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: number;
  fontFamily: string;
  autoSave: boolean;
  autoSaveInterval: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

export interface ExportFormat {
  format: 'txt' | 'html' | 'md' | 'json';
}

export interface Command {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
  category?: string;
}

export type ViewMode = 'editor' | 'preview' | 'split';
