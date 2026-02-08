import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Folder } from '../types';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  currentNoteId: string | null;
  currentFolderId: string | null;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (id: string | null) => void;
  
  // Folder actions
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => string;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setCurrentFolder: (id: string | null) => void;
  
  // Search
  searchNotes: (query: string) => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [],
      currentNoteId: null,
      currentFolderId: null,

      addNote: (note) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const newNote: Note = {
          ...note,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
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

      addFolder: (folder) => {
        const id = crypto.randomUUID();
        const newFolder: Folder = {
          ...folder,
          id,
          createdAt: Date.now(),
        };
        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
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
          notes: state.notes.filter((note) => note.folderId !== id),
        }));
      },

      setCurrentFolder: (id) => {
        set({ currentFolderId: id });
      },

      searchNotes: (query) => {
        const { notes } = get();
        const lowerQuery = query.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);
