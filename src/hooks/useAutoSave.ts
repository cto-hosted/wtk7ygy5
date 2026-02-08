import { useEffect, useRef } from 'react';
import { useNotesStore } from '../stores/notesStore';

export const useAutoSave = (
  noteId: string | null,
  title: string,
  content: string,
  delay: number = 1000
) => {
  const { updateNote } = useNotesStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!noteId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateNote(noteId, { title, content });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [noteId, title, content, delay, updateNote]);
};
