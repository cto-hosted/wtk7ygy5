import { useNotes } from '../../hooks/useNotes'
import { useTranslation } from 'react-i18next'
import FileItem from './FileItem'
import FolderItem from './FolderItem'
import { File, FolderOpen, FolderPlus, Plus } from 'lucide-react'
import { useState } from 'react'

export default function FileTree() {
  const { t } = useTranslation()
  const { notes, folders, currentNoteId, setCurrentNote, addFolder } = useNotes()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const toggleFolder = (folderId: string) => {
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim() })
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt)
  const pinnedNotes = sortedNotes.filter((n) => n.isPinned)
  const unpinnedNotes = sortedNotes.filter((n) => !n.isPinned)

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('sidebar.allNotes')}
          </h2>
          <button
            onClick={() => setShowNewFolder(!showNewFolder)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title={t('app.newFolder')}
          >
            <FolderPlus className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {showNewFolder && (
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            placeholder={t('app.newFolder')}
            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {pinnedNotes.length > 0 && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              <File className="h-3 w-3" />
              {t('sidebar.favorites')}
            </div>
            <div className="space-y-0.5">
              {pinnedNotes.map((note) => (
                <FileItem
                  key={note.id}
                  note={note}
                  isActive={currentNoteId === note.id}
                  onClick={() => setCurrentNote(note.id)}
                />
              ))}
            </div>
          </div>
        )}

        {unpinnedNotes.length > 0 && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              <File className="h-3 w-3" />
              {t('sidebar.recent')}
            </div>
            <div className="space-y-0.5">
              {unpinnedNotes.map((note) => (
                <FileItem
                  key={note.id}
                  note={note}
                  isActive={currentNoteId === note.id}
                  onClick={() => setCurrentNote(note.id)}
                />
              ))}
            </div>
          </div>
        )}

        {folders.length > 0 && (
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              <FolderOpen className="h-3 w-3" />
              {t('sidebar.folders')}
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  isExpanded={expandedFolders.has(folder.id)}
                  onToggle={() => toggleFolder(folder.id)}
                  currentNoteId={currentNoteId}
                  onNoteClick={(noteId) => setCurrentNote(noteId)}
                  notes={notes.filter((n) => n.folderId === folder.id)}
                />
              ))}
            </div>
          </div>
        )}

        {notes.length === 0 && !showNewFolder && (
          <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="mb-2">
              <File className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600" />
            </div>
            <p className="mb-4">{t('editor.placeholder')}</p>
            <button
              onClick={() => {
                const { createNote } = useNotes.getState()
                createNote()
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t('app.newNote')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
