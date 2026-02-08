import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  FileText,
  Folder,
  Plus,
  Settings,
  X,
  Tag,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useNotesStore } from '../../stores/notesStore';

interface CommandItem {
  id: string;
  type: 'note' | 'folder' | 'action';
  title: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const { t } = useTranslation();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { notes, folders, setCurrentNote, addNote, addFolder } = useNotesStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    if (commandPaletteOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const items = useMemo(() => {
    const commandItems: CommandItem[] = [];

    // Add notes
    notes.forEach((note) => {
      commandItems.push({
        id: `note-${note.id}`,
        type: 'note',
        title: note.title || t('editor.titlePlaceholder'),
        icon: <FileText size={18} className="text-blue-500" />,
        action: () => {
          setCurrentNote(note.id);
          setCommandPaletteOpen(false);
        },
      });
    });

    // Add folders
    folders.forEach((folder) => {
      commandItems.push({
        id: `folder-${folder.id}`,
        type: 'folder',
        title: folder.name,
        icon: <Folder size={18} className="text-yellow-500" />,
        action: () => {
          // Could navigate to folder view
          setCommandPaletteOpen(false);
        },
      });
    });

    // Add actions
    commandItems.push(
      {
        id: 'action-new-note',
        type: 'action',
        title: t('actions.newNote'),
        icon: <Plus size={18} className="text-green-500" />,
        action: () => {
          const id = addNote({
            title: t('editor.titlePlaceholder'),
            content: '',
            folderId: null,
            tags: [],
          });
          setCurrentNote(id);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'action-new-folder',
        type: 'action',
        title: t('actions.newFolder'),
        icon: <Folder size={18} className="text-green-500" />,
        action: () => {
          const name = window.prompt(t('actions.newFolder'));
          if (name?.trim()) {
            addFolder({ name: name.trim(), parentId: null });
          }
          setCommandPaletteOpen(false);
        },
      }
    );

    // Filter by query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      return commandItems.filter((item) =>
        item.title.toLowerCase().includes(lowerQuery)
      );
    }

    return commandItems;
  }, [notes, folders, query, t, setCurrentNote, setCommandPaletteOpen, addNote, addFolder]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter' && items[selectedIndex]) {
      items[selectedIndex].action();
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 sepia:bg-sepia-100 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('commandPalette.placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {t('commandPalette.noResults')}
            </div>
          ) : (
            <div className="py-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left text-gray-900 dark:text-gray-100">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-400 uppercase">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
