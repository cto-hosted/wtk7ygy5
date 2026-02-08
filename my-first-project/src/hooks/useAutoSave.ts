import { useEffect, useRef } from 'react';
import { useNotesStore } from '../stores/notesStore';
import { useSettingsStore } from '../stores/settingsStore';

export function useAutoSave(
  noteId: string | null,
  title: string,
  content: string
) {
  const updateNote = useNotesStore((state) => state.updateNote);
  const autoSaveInterval = useSettingsStore((state) => state.autoSaveInterval);
  const lastSavedRef = useRef<{ title: string; content: string }>({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (!noteId) return;

    const intervalId = setInterval(() => {
      if (
        title !== lastSavedRef.current.title ||
        content !== lastSavedRef.current.content
      ) {
        updateNote(noteId, { title, content });
        lastSavedRef.current = { title, content };
      }
    }, autoSaveInterval);

    return () => clearInterval(intervalId);
  }, [noteId, title, content, updateNote, autoSaveInterval]);

  // Save immediately when component unmounts or noteId changes
  useEffect(() => {
    return () => {
      if (
        noteId &&
        (title !== lastSavedRef.current.title ||
          content !== lastSavedRef.current.content)
      ) {
        updateNote(noteId, { title, content });
      }
    };
  }, [noteId]);
}
