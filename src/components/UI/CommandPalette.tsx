import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { useNotesStore } from '../../stores/notesStore';
import { X, FileText, FolderPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
}

export const CommandPalette = () => {
  const { t } = useTranslation();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { addNote, setCurrentNote } = useNotesStore();
  const [search, setSearch] = useState('');

  const commands: Command[] = [
    {
      id: 'new-note',
      label: t('sidebar.newNote'),
      icon: FileText,
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
      id: 'new-folder',
      label: t('sidebar.newFolder'),
      icon: FolderPlus,
      action: () => {
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-600">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent focus:outline-none text-lg"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Icon size={20} />
                  <span>{cmd.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
