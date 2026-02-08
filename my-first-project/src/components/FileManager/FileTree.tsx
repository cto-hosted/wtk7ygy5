import { useTranslation } from 'react-i18next';
import type { Note, Folder } from '../../types';
import { FileItem } from './FileItem';
import { FolderItem } from './FolderItem';

interface FileTreeProps {
  notes: Note[];
  folders: Folder[];
  currentNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

export function FileTree({
  notes,
  folders,
  currentNoteId,
  onSelectNote,
}: FileTreeProps) {
  const { t } = useTranslation();

  // Get root-level items (no parent folder)
  const rootNotes = notes.filter((note) => note.folderId === null);
  const rootFolders = folders.filter((folder) => folder.parentId === null);

  if (notes.length === 0 && folders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        {t('welcome.subtitle')}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {rootFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          notes={notes}
          folders={folders}
          currentNoteId={currentNoteId}
          level={0}
          onSelectNote={onSelectNote}
        />
      ))}
      {rootNotes.map((note) => (
        <FileItem
          key={note.id}
          note={note}
          isSelected={note.id === currentNoteId}
          onSelect={() => onSelectNote(note.id)}
        />
      ))}
    </div>
  );
}
