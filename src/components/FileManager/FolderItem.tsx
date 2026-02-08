import { Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical } from 'lucide-react'
import { Folder as FolderType, Note } from '../../types'
import { useTranslation } from 'react-i18next'
import FileItem from './FileItem'
import clsx from 'clsx'
import { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'

interface FolderItemProps {
  folder: FolderType
  isExpanded: boolean
  onToggle: () => void
  currentNoteId: string | null
  onNoteClick: (noteId: string) => void
  notes: Note[]
}

export default function FolderItem({
  folder,
  isExpanded,
  onToggle,
  currentNoteId,
  onNoteClick,
  notes,
}: FolderItemProps) {
  const { t } = useTranslation()
  const { updateFolder, deleteFolder } = useNotes()
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)

  const handleRename = () => {
    if (newName.trim()) {
      updateFolder(folder.id, { name: newName.trim() })
      setIsRenaming(false)
    }
  }

  return (
    <div>
      <div className="relative group">
        <button
          onClick={onToggle}
          className={clsx(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors',
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-blue-500 shrink-0" />
          )}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-white dark:bg-gray-700 border border-blue-500 rounded px-2 py-0.5 text-sm focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="flex-1 truncate">{folder.name}</span>
          )}
          <span className="text-xs text-gray-400">{notes.length}</span>
          
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
                  setIsRenaming(true)
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span>✏️</span>
                {t('sidebar.renameFolder')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
                    deleteFolder(folder.id)
                  }
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <span>🗑️</span>
                {t('sidebar.deleteFolder')}
              </button>
            </div>
          </>
        )}
      </div>

      {isExpanded && notes.length > 0 && (
        <div className="ml-6 mt-1 space-y-0.5">
          {notes.map((note) => (
            <FileItem
              key={note.id}
              note={note}
              isActive={currentNoteId === note.id}
              onClick={() => onNoteClick(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
