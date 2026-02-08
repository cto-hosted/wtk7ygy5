import { useEffect, useRef } from 'react'
import { useNotesStore } from '../stores/notesStore'
import { useSettingsStore } from '../stores/settingsStore'

export const useAutoSave = () => {
  const { updateNote, currentNoteId, saveCurrentNote } = useNotesStore()
  const { autoSave, autoSaveInterval } = useSettingsStore()
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasUnsavedChangesRef = useRef(false)

  useEffect(() => {
    if (!autoSave || !currentNoteId) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      return
    }

    if (hasUnsavedChangesRef.current) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(() => {
        saveCurrentNote()
        hasUnsavedChangesRef.current = false
      }, autoSaveInterval)
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [autoSave, autoSaveInterval, currentNoteId, saveCurrentNote])

  const markUnsavedChanges = () => {
    hasUnsavedChangesRef.current = true
  }

  const immediateSave = () => {
    if (currentNoteId && hasUnsavedChangesRef.current) {
      saveCurrentNote()
      hasUnsavedChangesRef.current = false
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }

  return {
    markUnsavedChanges,
    immediateSave,
  }
}
