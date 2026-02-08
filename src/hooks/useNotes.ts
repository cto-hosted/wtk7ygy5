import { useEffect } from 'react'
import { useNotesStore } from '../stores/notesStore'
import { useSettingsStore } from '../stores/settingsStore'

export const useNotes = () => {
  const {
    notes,
    folders,
    currentNoteId,
    currentFolderId,
    searchQuery,
    filteredNotes,
    setCurrentNote,
    setCurrentFolder,
    addNote,
    updateNote,
    deleteNote,
    saveCurrentNote,
    setSearchQuery,
    addFolder,
    updateFolder,
    deleteFolder,
    togglePinNote,
    duplicateNote,
  } = useNotesStore()

  const { autoSave, autoSaveInterval } = useSettingsStore()

  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout

    if (autoSave && currentNoteId) {
      autoSaveTimer = setInterval(() => {
        saveCurrentNote()
      }, autoSaveInterval)
    }

    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer)
      }
    }
  }, [autoSave, autoSaveInterval, currentNoteId, saveCurrentNote])

  const createNote = (title: string = 'Untitled Note') => {
    addNote({
      title,
      content: '',
      folderId: currentFolderId || undefined,
      tags: [],
      isPinned: false,
    })
  }

  const getCurrentNote = () => {
    return notes.find((n) => n.id === currentNoteId) || null
  }

  const getNotesInFolder = (folderId: string | null = null) => {
    return notes.filter((n) => n.folderId === (folderId || undefined))
  }

  const getPinnedNotes = () => {
    return notes.filter((n) => n.isPinned)
  }

  const getRecentNotes = (limit: number = 10) => {
    return [...notes]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit)
  }

  return {
    notes,
    folders,
    currentNoteId,
    currentFolderId,
    searchQuery,
    filteredNotes,
    currentNote: getCurrentNote(),
    pinnedNotes: getPinnedNotes(),
    recentNotes: getRecentNotes(),
    folderNotes: getNotesInFolder(currentFolderId),
    setCurrentNote,
    setCurrentFolder,
    createNote,
    updateNote,
    deleteNote,
    saveCurrentNote,
    setSearchQuery,
    addFolder,
    updateFolder,
    deleteFolder,
    togglePinNote,
    duplicateNote,
    getNotesInFolder,
  }
}
