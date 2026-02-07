import { useTranslation } from 'react-i18next';
import { useNotesStore } from '../../stores/notesStore';
import { FileText, Palette, Globe, Folder, Download, Keyboard } from 'lucide-react';

export const WelcomeScreen = () => {
  const { t } = useTranslation();
  const { addNote, setCurrentNote } = useNotesStore();

  const handleGetStarted = () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: null,
      tags: [],
    });
    setCurrentNote(id);
  };

  const features = [
    {
      icon: FileText,
      title: t('welcome.features.richText'),
      description: t('welcome.features.richTextDesc'),
    },
    {
      icon: Palette,
      title: t('welcome.features.multiTheme'),
      description: t('welcome.features.multiThemeDesc'),
    },
    {
      icon: Globe,
      title: t('welcome.features.i18n'),
      description: t('welcome.features.i18nDesc'),
    },
    {
      icon: Folder,
      title: t('welcome.features.organize'),
      description: t('welcome.features.organizeDesc'),
    },
    {
      icon: Download,
      title: t('welcome.features.export'),
      description: t('welcome.features.exportDesc'),
    },
    {
      icon: Keyboard,
      title: t('welcome.features.shortcuts'),
      description: t('welcome.features.shortcutsDesc'),
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('welcome.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t('welcome.description')}
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
          >
            {t('welcome.getStarted')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 sepia:bg-sepia-100 rounded-lg border border-gray-300 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 sepia:bg-sepia-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{t('shortcuts.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('shortcuts.newNote')}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">
                Ctrl+N
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('shortcuts.search')}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">
                Ctrl+F
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('shortcuts.commandPalette')}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">
                Ctrl+K
              </kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('shortcuts.save')}</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm">
                Ctrl+S
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
