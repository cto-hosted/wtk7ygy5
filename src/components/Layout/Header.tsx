import { useTranslation } from 'react-i18next'
import { Search, Settings, Plus } from 'lucide-react'
import { useNotes } from '../../hooks/useNotes'
import ThemeToggle from '../UI/ThemeToggle'
import LanguageSelector from '../UI/LanguageSelector'

export default function Header() {
  const { t } = useTranslation()
  const { setSearchQuery, createNote } = useNotes()

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('app.title')}
        </h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('app.searchPlaceholder')}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => createNote()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('app.newNote')}
        </button>

        <ThemeToggle />
        <LanguageSelector />

        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={t('app.settings')}
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>
  )
}
