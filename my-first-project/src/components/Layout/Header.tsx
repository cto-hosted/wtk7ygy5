import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Search,
  Plus,
  Settings,
  FolderPlus,
} from 'lucide-react';
import { useNotesStore } from '../../stores/notesStore';
import { useUIStore } from '../../stores/uiStore';
import { ThemeToggle } from '../UI/ThemeToggle';
import { LanguageSelector } from '../UI/LanguageSelector';

export function Header() {
  const { t, i18n } = useTranslation();
  const { toggleSidebar, toggleCommandPalette } = useUIStore();
  const { addNote, addFolder, setCurrentNote } = useNotesStore();
  const [showNewMenu, setShowNewMenu] = useState(false);

  const handleNewNote = () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: null,
      tags: [],
    });
    setCurrentNote(id);
    setShowNewMenu(false);
  };

  const handleNewFolder = () => {
    const name = window.prompt(t('actions.newFolder'));
    if (name && name.trim()) {
      addFolder({ name: name.trim(), parentId: null });
    }
    setShowNewMenu(false);
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-800 sepia:bg-sepia-100 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="font-semibold text-lg ml-2">{t('app.name')}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            {t('actions.newNote')}
          </button>

          {showNewMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <button
                onClick={handleNewNote}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg text-left"
              >
                <Plus size={16} />
                {t('actions.newNote')}
              </button>
              <button
                onClick={handleNewFolder}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg text-left"
              >
                <FolderPlus size={16} />
                {t('actions.newFolder')}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Search size={18} />
          <span className="text-sm hidden sm:inline">{t('actions.search')}</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
            Ctrl K
          </kbd>
        </button>

        <ThemeToggle />
        <LanguageSelector />
      </div>
    </header>
  );
}
