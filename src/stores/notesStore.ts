import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Note, Folder } from '../types'
import { storage } from '../utils/storage'

interface NotesState {
  notes: Note[]
  folders: Folder[]
  currentNoteId: string | null
  currentFolderId: string | null
  searchQuery: string
  filteredNotes: Note[]
  
  setCurrentNote: (id: string | null) => void
  setCurrentFolder: (id: string | null) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  saveCurrentNote: () => void
  loadNotes: () => void
  setSearchQuery: (query: string) => void
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  togglePinNote: (id: string) => void
  duplicateNote: (id: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [],
      currentNoteId: null,
      currentFolderId: null,
      searchQuery: '',
      filteredNotes: [],

      setCurrentNote: (id) => set({ currentNoteId: id }),

      setCurrentFolder: (id) => set({ currentFolderId: id }),

      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          notes: [...state.notes, newNote],
          currentNoteId: newNote.id,
        }))
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNoteId: state.currentNoteId === id ? null : state.currentNoteId,
        }))
      },

      saveCurrentNote: () => {
        const { currentNoteId, notes } = get()
        if (currentNoteId) {
          const note = notes.find((n) => n.id === currentNoteId)
          if (note) {
            storage.saveNote(note)
          }
        }
      },

      loadNotes: () => {
        const savedNotes = storage.loadNotes()
        const savedFolders = storage.loadFolders()
        set({
          notes: savedNotes,
          folders: savedFolders,
        })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
        const { notes } = get()
        const filtered = notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        )
        set({ filteredNotes: filtered })
      },

      addFolder: (folder) => {
        const newFolder: Folder = {
          ...folder,
          id: generateId(),
          createdAt: Date.now(),
        }
        set((state) => ({
          folders: [...state.folders, newFolder],
        }))
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }))
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: undefined } : note
          ),
          currentFolderId: state.currentFolderId === id ? null : state.currentFolderId,
        }))
      },

      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        }))
      },

      duplicateNote: (id) => {
        const { notes } = get()
        const note = notes.find((n) => n.id === id)
        if (note) {
          const newNote: Note = {
            ...note,
            id: generateId(),
            title: `${note.title} (Copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set((state) => ({
            notes: [...state.notes, newNote],
            currentNoteId: newNote.id,
          }))
        }
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({
        notes: state.notes,
        folders: state.folders,
        currentFolderId: state.currentFolderId,
      }),
    }
  )
)
