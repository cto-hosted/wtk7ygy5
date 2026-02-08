import { useCallback } from 'react';
import { useNotesStore } from '../stores/notesStore';
import type { Note } from '../types';

export function useNotes() {
  const {
    notes,
    folders,
    currentNoteId,
    currentFolderId,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    addFolder,
    updateFolder,
    deleteFolder,
    setCurrentFolder,
    searchNotes,
  } = useNotesStore();

  const currentNote = notes.find((n) => n.id === currentNoteId) || null;
  const currentFolder = folders.find((f) => f.id === currentFolderId) || null;

  const getNotesByFolder = useCallback(
    (folderId: string | null) => {
      return notes.filter((note) => note.folderId === folderId);
    },
    [notes]
  );

  const getChildFolders = useCallback(
    (parentId: string | null) => {
      return folders.filter((folder) => folder.parentId === parentId);
    },
    [folders]
  );

  const createNote = useCallback(
    (title: string, content: string = '', folderId: string | null = null) => {
      return addNote({
        title,
        content,
        folderId,
        tags: [],
      });
    },
    [addNote]
  );

  const createFolder = useCallback(
    (name: string, parentId: string | null = null) => {
      return addFolder({ name, parentId });
    },
    [addFolder]
  );

  const moveNote = useCallback(
    (noteId: string, folderId: string | null) => {
      updateNote(noteId, { folderId });
    },
    [updateNote]
  );

  const renameNote = useCallback(
    (noteId: string, title: string) => {
      updateNote(noteId, { title });
    },
    [updateNote]
  );

  const renameFolder = useCallback(
    (folderId: string, name: string) => {
      updateFolder(folderId, { name });
    },
    [updateFolder]
  );

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => {
      note.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [notes]);

  const getNotesByTag = useCallback(
    (tag: string) => {
      return notes.filter((note) => note.tags.includes(tag));
    },
    [notes]
  );

  return {
    notes,
    folders,
    currentNote,
    currentFolder,
    currentNoteId,
    currentFolderId,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    createFolder,
    updateFolder,
    deleteFolder,
    setCurrentFolder,
    getNotesByFolder,
    getChildFolders,
    moveNote,
    renameNote,
    renameFolder,
    searchNotes,
    getAllTags,
    getNotesByTag,
  };
}
