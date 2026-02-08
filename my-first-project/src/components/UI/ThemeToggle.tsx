import { useTranslation } from 'react-i18next';
import { Sun, Moon, BookOpen } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import type { Theme } from '../../types';

const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun size={18} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={18} />, label: 'Dark' },
  { value: 'sepia', icon: <BookOpen size={18} />, label: 'Sepia' },
];

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useUIStore();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {themes.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={t(`themes.${value}`)}
          className={`p-2 rounded-md transition-colors ${
            theme === value
              ? 'bg-white dark:bg-gray-600 text-blue-500 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
