import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { useNotes } from '../../hooks/useNotes'
import { useUIStore } from '../../stores/uiStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { exportNote } from '../../utils/export'
import clsx from 'clsx'

export default function CommandPalette() {
  const { t } = useTranslation()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const { notes, currentNote, setCurrentNote, createNote, togglePinNote, duplicateNote, deleteNote } = useNotes()
  const { setTheme, setLanguage } = useSettingsStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const categories = {
    notes: { icon: '📝', label: 'Notes' },
    actions: { icon: '⚡', label: 'Actions' },
    settings: { icon: '⚙️', label: 'Settings' },
  }

  const commands = [
    {
      category: 'notes',
      items: notes.slice(0, 10).map((note) => ({
        id: note.id,
        label: note.title,
        action: () => {
          setCurrentNote(note.id)
          setCommandPaletteOpen(false)
        },
      })),
    },
    {
      category: 'actions',
      items: [
        {
          id: 'new-note',
          label: t('app.newNote'),
          shortcut: 'Ctrl+N',
          action: () => {
            createNote()
            setCommandPaletteOpen(false)
          },
        },
        {
          id: 'save',
          label: t('common.save'),
          shortcut: 'Ctrl+S',
          action: () => {
            if (currentNote) {
              const { saveCurrentNote } = useNotes.getState()
              saveCurrentNote()
            }
            setCommandPaletteOpen(false)
          },
        },
        {
          id: 'export-html',
          label: `${t('export.html')}`,
          action: () => {
            if (currentNote) {
              exportNote(currentNote, 'html')
            }
            setCommandPaletteOpen(false)
          },
        },
        {
          id: 'export-md',
          label: `${t('export.md')}`,
          action: () => {
            if (currentNote) {
              exportNote(currentNote, 'md')
            }
            setCommandPaletteOpen(false)
          },
        },
      ],
    },
    {
      category: 'settings',
      items: [
        {
          id: 'theme-light',
          label: `${t('settings.theme')}: ${t('settings.themes.light')}`,
          action: () => {
            setTheme('light')
            setCommandPaletteOpen(false)
          },
        },
        {
          id: 'theme-dark',
          label: `${t('settings.theme')}: ${t('settings.themes.dark')}`,
          action: () => {
            setTheme('dark')
            setCommandPaletteOpen(false)
          },
        },
        {
          id: 'theme-system',
          label: `${t('settings.theme')}: ${t('settings.themes.system')}`,
          action: () => {
            setTheme('system')
            setCommandPaletteOpen(false)
          },
        },
      ],
    },
  ]

  const filteredCommands = commands.flatMap((category) => {
    const filteredItems = category.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    return filteredItems.length > 0
      ? [{ category: category.category, items: filteredItems }]
      : []
  })

  const allItems = filteredCommands.flatMap((group) => group.items)

  useEffect(() => {
    const handleOpen = () => {
      setCommandPaletteOpen(true)
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }

    window.addEventListener('open-command-palette', handleOpen)

    return () => {
      window.removeEventListener('open-command-palette', handleOpen)
    }
  }, [setCommandPaletteOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return

      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % allItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = allItems[selectedIndex]
        if (item) {
          item.action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, selectedIndex, allItems])

  if (!commandPaletteOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder={t('commands.placeholder')}
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div ref={listRef} className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          ) : (
            filteredCommands.map((group, groupIndex) => (
              <div key={group.category}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {categories[group.category as keyof typeof categories]?.label || group.category}
                </div>
                {group.items.map((item, itemIndex) => {
                  const globalIndex = allItems.indexOf(item)
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        selectedIndex === globalIndex
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      <span className="text-lg">
                        {categories[group.category as keyof typeof categories]?.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}
