import { useTranslation } from 'react-i18next'
import { FileText, Pin, MoreVertical } from 'lucide-react'
import { Note } from '../../types'
import clsx from 'clsx'
import { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'

interface FileItemProps {
  note: Note
  isActive: boolean
  onClick: () => void
}

export default function FileItem({ note, isActive, onClick }: FileItemProps) {
  const { t } = useTranslation()
  const { togglePinNote, duplicateNote, deleteNote } = useNotes()
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={clsx(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{note.title || t('notes.untitled')}</span>
        {note.isPinned && <Pin className="h-3 w-3 text-yellow-500 shrink-0" />}
        <span className="text-xs text-gray-400 shrink-0">
          {formatDate(note.updatedAt)}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
        >
          <MoreVertical className="h-3 w-3 text-gray-400" />
        </button>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePinNote(note.id)
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {note.isPinned ? (
                <>
                  <span>📌</span>
                  {t('notes.unpin')}
                </>
              ) : (
                <>
                  <span>📌</span>
                  {t('notes.pin')}
                </>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateNote(note.id)
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>📋</span>
              {t('notes.duplicate')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Are you sure you want to delete this note?')) {
                  deleteNote(note.id)
                }
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <span>🗑️</span>
              {t('notes.delete')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
