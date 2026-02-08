import { useTranslation } from 'react-i18next';
import { FileText, Plus, Command } from 'lucide-react';
import { useNotesStore } from '../../stores/notesStore';

export function WelcomeScreen() {
  const { t } = useTranslation();
  const { addNote, setCurrentNote } = useNotesStore();

  const handleCreateNote = () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: null,
      tags: [],
    });
    setCurrentNote(id);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 sepia:bg-sepia-50">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText size={40} className="text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('welcome.title')}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('welcome.subtitle')}
        </p>

        <button
          onClick={handleCreateNote}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
        >
          <Plus size={20} />
          {t('welcome.createNote')}
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Command size={14} />
          <span>{t('welcome.shortcutHint')}</span>
        </div>
      </div>
    </div>
  );
}
