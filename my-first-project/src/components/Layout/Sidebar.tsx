import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileTree } from '../FileManager/FileTree';
import { useNotesStore } from '../../stores/notesStore';

export function Sidebar() {
  const { t } = useTranslation();
  const { notes, folders, currentNoteId, setCurrentNote } = useNotesStore();
  const [activeTab, setActiveTab] = useState<'files' | 'tags'>('files');

  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags))
  ).sort();

  const untaggedCount = notes.filter(
    (note) => note.tags.length === 0
  ).length;

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 sepia:bg-sepia-50 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'files'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t('sidebar.allNotes')} ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'tags'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t('sidebar.tags')} ({allTags.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'files' ? (
          <FileTree
            notes={notes}
            folders={folders}
            currentNoteId={currentNoteId}
            onSelectNote={setCurrentNote}
          />
        ) : (
          <div className="space-y-1">
            {untaggedCount > 0 && (
              <button
                onClick={() => {
                  const untagged = notes.filter((n) => n.tags.length === 0);
                  if (untagged.length > 0) {
                    setCurrentNote(untagged[0].id);
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {t('sidebar.untagged')} ({untaggedCount})
              </button>
            )}
            {allTags.map((tag) => {
              const count = notes.filter((note) => note.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    const tagged = notes.filter((n) => n.tags.includes(tag));
                    if (tagged.length > 0) {
                      setCurrentNote(tagged[0].id);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
