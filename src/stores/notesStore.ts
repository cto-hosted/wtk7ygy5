import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Folder } from '../types';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  currentNoteId: string | null;
  searchQuery: string;
  
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (id: string | null) => void;
  
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => string;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [],
      currentNoteId: null,
      searchQuery: '',
      
      addNote: (noteData) => {
        const id = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const note: Note = {
          ...noteData,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ notes: [...state.notes, note] }));
        return id;
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNoteId: state.currentNoteId === id ? null : state.currentNoteId,
        }));
      },
      
      setCurrentNote: (id) => {
        set({ currentNoteId: id });
      },
      
      addFolder: (folderData) => {
        const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const folder: Folder = {
          ...folderData,
          id,
          createdAt: Date.now(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return id;
      },
      
      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },
      
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: null } : note
          ),
        }));
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;
        
        const query = searchQuery.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);
