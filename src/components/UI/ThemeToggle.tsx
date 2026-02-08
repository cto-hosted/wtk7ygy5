import { useTranslation } from 'react-i18next'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useState } from 'react'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme } = useSettingsStore()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { id: 'light' as const, icon: Sun, label: t('settings.themes.light') },
    { id: 'dark' as const, icon: Moon, label: t('settings.themes.dark') },
    { id: 'system' as const, icon: Monitor, label: t('settings.themes.system') },
  ]

  const currentTheme = themes.find((t) => t.id === theme) || themes[2]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={t('app.toggleTheme')}
      >
        <currentTheme.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    theme === themeOption.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {themeOption.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
