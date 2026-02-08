import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, MoreVertical, Trash2, Edit3, Tag } from 'lucide-react';
import type { Note } from '../../types';
import { useNotesStore } from '../../stores/notesStore';

interface FileItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
}

export function FileItem({ note, isSelected, onSelect }: FileItemProps) {
  const { t } = useTranslation();
  const { updateNote, deleteNote } = useNotesStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(note.title);

  const handleRename = () => {
    if (editName.trim() && editName !== note.title) {
      updateNote(note.id, { title: editName.trim() });
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('messages.confirmDelete'))) {
      deleteNote(note.id);
    }
    setShowMenu(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      <div onClick={onSelect} className="flex-1 flex items-center gap-2 min-w-0">
        <FileText size={16} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
        
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(note.title);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="flex-1 bg-transparent border-b border-blue-500 outline-none text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {note.title || t('editor.titlePlaceholder')}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>{formatDate(note.updatedAt)}</span>
              {note.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag size={10} />
                  {note.tags.length}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

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
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg text-left"
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
  );
}
