import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { Menu, Sun, Moon, Palette, Globe, Command } from 'lucide-react';
import type { Theme, Language } from '../../types';

export const Header = () => {
  const { t } = useTranslation();
  const { theme, language, setTheme, setLanguage, toggleSidebar, toggleCommandPalette } = useUIStore();

  const themes: { value: Theme; icon: any; label: string }[] = [
    { value: 'light', icon: Sun, label: t('theme.light') },
    { value: 'dark', icon: Moon, label: t('theme.dark') },
    { value: 'sepia', icon: Palette, label: t('theme.sepia') },
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pt', name: 'Português' },
  ];

  return (
    <header className="h-14 bg-white dark:bg-gray-800 sepia:bg-sepia-100 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t('app.title')}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Command Palette (Ctrl+K)"
        >
          <Command size={16} />
          <span className="hidden sm:inline">Ctrl+K</span>
        </button>

        <div className="relative group">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {themes.find(t => t.value === theme)?.icon ? (
              (() => {
                const Icon = themes.find(t => t.value === theme)!.icon;
                return <Icon size={20} />;
              })()
            ) : null}
          </button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                    theme === themeOption.value ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                >
                  <Icon size={16} />
                  {themeOption.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative group">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Globe size={20} />
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
