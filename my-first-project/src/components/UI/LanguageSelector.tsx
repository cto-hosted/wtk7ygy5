import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import type { Language } from '../../types';

const languages: { value: Language; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'es', label: 'Spanish', native: 'Español' },
  { value: 'fr', label: 'French', native: 'Français' },
  { value: 'de', label: 'German', native: 'Deutsch' },
  { value: 'zh', label: 'Chinese', native: '中文' },
  { value: 'ja', label: 'Japanese', native: '日本語' },
  { value: 'ko', label: 'Korean', native: '한국어' },
  { value: 'ar', label: 'Arabic', native: 'العربية' },
  { value: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { value: 'pt', label: 'Portuguese', native: 'Português' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleSelect = (value: Language) => {
    setLanguage(value);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((l) => l.value === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Select Language"
      >
        <Globe size={18} />
        <span className="hidden sm:inline uppercase font-medium">
          {currentLanguage?.value}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lang.native}</span>
                  <span className="text-sm text-gray-400">{lang.label}</span>
                </div>
                {language === lang.value && <Check size={16} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
