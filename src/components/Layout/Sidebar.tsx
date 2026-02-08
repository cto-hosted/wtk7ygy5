import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Star,
  Clock,
  Trash2,
  Folder,
  FolderPlus,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { useNotes } from '../../hooks/useNotes'
import { useUIStore } from '../../stores/uiStore'
import clsx from 'clsx'

export default function Sidebar() {
  const { t } = useTranslation()
  const { sidebarOpen } = useUIStore()
  const {
    folders,
    currentFolderId,
    setCurrentFolder,
    addFolder,
    updateFolder,
    deleteFolder,
    pinnedNotes,
    recentNotes,
    folderNotes,
  } = useNotes()

  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim() })
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  if (!sidebarOpen) {
    return null
  }

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <button
            onClick={() => setCurrentFolder(null)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              !currentFolderId
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <FileText className="h-4 w-4" />
            {t('sidebar.allNotes')}
          </button>

          <button
            onClick={() => {
              setCurrentFolder('pinned')
            }}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFolderId === 'pinned'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Star className="h-4 w-4" />
            {t('sidebar.favorites')}
            {pinnedNotes.length > 0 && (
              <span className="ml-auto text-xs text-gray-500">
                {pinnedNotes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentFolder('recent')}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFolderId === 'recent'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Clock className="h-4 w-4" />
            {t('sidebar.recent')}
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('sidebar.folders')}
            </h2>
            <button
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <FolderPlus className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {showNewFolder && (
            <div className="mb-2 px-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder={t('app.newFolder')}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          <div className="space-y-1">
            {folders.map((folder) => (
              <div key={folder.id}>
                <button
                  onClick={() => {
                    setCurrentFolder(folder.id)
                    toggleFolderExpansion(folder.id)
                  }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentFolderId === folder.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {expandedFolders.has(folder.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <Folder className="h-4 w-4" />
                  {folder.name}
                </button>

                {expandedFolders.has(folder.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {folderNotes
                      .filter((note) => note.folderId === folder.id)
                      .map((note) => (
                        <button
                          key={note.id}
                          onClick={() => {
                            setCurrentFolder(folder.id)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{note.title}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}

            {folders.length === 0 && !showNewFolder && (
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('sidebar.folders')} not found
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  )
}
