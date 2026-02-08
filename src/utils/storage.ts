import { Note, Folder } from '../types'

const STORAGE_KEYS = {
  NOTES: 'notepad-notes',
  FOLDERS: 'notepad-folders',
  SETTINGS: 'notepad-settings',
}

export const storage = {
  saveNotes: (notes: Note[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  },

  loadNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load notes:', error)
      return []
    }
  },

  saveNote: (note: Note) => {
    try {
      const notes = storage.loadNotes()
      const index = notes.findIndex((n) => n.id === note.id)
      if (index >= 0) {
        notes[index] = note
      } else {
        notes.push(note)
      }
      storage.saveNotes(notes)
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  },

  deleteNote: (id: string) => {
    try {
      const notes = storage.loadNotes().filter((n) => n.id !== id)
      storage.saveNotes(notes)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  },

  saveFolders: (folders: Folder[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
    } catch (error) {
      console.error('Failed to save folders:', error)
    }
  },

  loadFolders: (): Folder[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLDERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load folders:', error)
      return []
    }
  },

  saveSettings: (settings: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  },

  loadSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load settings:', error)
      return null
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  },
}
