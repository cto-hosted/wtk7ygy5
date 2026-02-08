import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotesStore } from '../../stores/notesStore';
import { Plus, Folder, FileText, Search, X } from 'lucide-react';

export const Sidebar = () => {
  const { t } = useTranslation();
  const {
    folders,
    currentNoteId,
    searchQuery,
    addNote,
    addFolder,
    setCurrentNote,
    setSearchQuery,
    getFilteredNotes,
  } = useNotesStore();
  
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const filteredNotes = getFilteredNotes();

  const handleNewNote = () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: null,
      tags: [],
    });
    setCurrentNote(id);
  };

  const handleNewFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName, parentId: null });
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-64 h-full bg-gray-100 dark:bg-gray-900 sepia:bg-sepia-200 border-r border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('sidebar.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 sepia:bg-sepia-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button
          onClick={handleNewNote}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
          {t('sidebar.newNote')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {folders.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">
              {t('sidebar.folders')}
            </div>
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              >
                <Folder size={16} />
                <span className="text-sm truncate">{folder.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">
            {t('sidebar.allNotes')}
          </div>
          {filteredNotes.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-4 text-center">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setCurrentNote(note.id)}
                className={`px-2 py-2 rounded cursor-pointer transition-colors ${
                  currentNoteId === note.id
                    ? 'bg-blue-100 dark:bg-blue-900 sepia:bg-sepia-400'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText size={16} className="mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{note.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-2 border-t border-gray-300 dark:border-gray-700">
        {showNewFolder ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNewFolder()}
              placeholder="Folder name"
              className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 sepia:bg-sepia-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleNewFolder}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowNewFolder(false);
                setNewFolderName('');
              }}
              className="px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewFolder(true)}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            {t('sidebar.newFolder')}
          </button>
        )}
      </div>
    </div>
  );
};
