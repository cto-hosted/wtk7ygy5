import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder, ChevronRight, ChevronDown, MoreVertical, Trash2, Edit3, Plus } from 'lucide-react';
import type { Folder as FolderType, Note } from '../../types';
import { useNotesStore } from '../../stores/notesStore';
import { FileItem } from './FileItem';

interface FolderItemProps {
  folder: FolderType;
  notes: Note[];
  folders: FolderType[];
  currentNoteId: string | null;
  level: number;
  onSelectNote: (noteId: string) => void;
}

export function FolderItem({
  folder,
  notes,
  folders,
  currentNoteId,
  level,
  onSelectNote,
}: FolderItemProps) {
  const { t } = useTranslation();
  const { updateFolder, deleteFolder, addNote, setCurrentNote } = useNotesStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);

  const childNotes = notes.filter((note) => note.folderId === folder.id);
  const childFolders = folders.filter((f) => f.parentId === folder.id);

  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      updateFolder(folder.id, { name: editName.trim() });
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('messages.confirmDelete'))) {
      deleteFolder(folder.id);
    }
    setShowMenu(false);
  };

  const handleAddNote = () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: folder.id,
      tags: [],
    });
    setCurrentNote(id);
    setShowMenu(false);
  };

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0.5 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <Folder size={16} className="text-yellow-500" />

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(folder.name);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="flex-1 bg-transparent border-b border-blue-500 outline-none text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
        )}

        <span className="text-xs text-gray-400">{childNotes.length}</span>

        {!isEditing && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNote();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg text-left"
                  >
                    <Plus size={14} />
                    {t('actions.newNote')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Edit3 size={14} />
                    {t('actions.rename')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg text-left"
                  >
                    <Trash2 size={14} />
                    {t('actions.delete')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div>
          {childFolders.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              notes={notes}
              folders={folders}
              currentNoteId={currentNoteId}
              level={level + 1}
              onSelectNote={onSelectNote}
            />
          ))}
          {childNotes.map((note) => (
            <div key={note.id} style={{ paddingLeft: `${12 + (level + 1) * 16}px` }}>
              <FileItem
                note={note}
                isSelected={note.id === currentNoteId}
                onSelect={() => onSelectNote(note.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
