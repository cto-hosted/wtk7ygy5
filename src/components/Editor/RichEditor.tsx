import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useNotes } from '../../hooks/useNotes'
import { useTranslation } from 'react-i18next'
import Toolbar from './Toolbar'
import { useSettingsStore } from '../../stores/settingsStore'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useEffect } from 'react'

const lowlight = createLowlight(common)

export default function RichEditor() {
  const { t } = useTranslation()
  const { currentNote, updateNote } = useNotes()
  const { fontSize, fontFamily } = useSettingsStore()
  const { markUnsavedChanges } = useAutoSave()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: currentNote?.content || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      if (currentNote) {
        updateNote(currentNote.id, { content })
        markUnsavedChanges()
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && currentNote && editor.getHTML() !== currentNote.content) {
      editor.commands.setContent(currentNote.content)
    }
  }, [currentNote?.id])

  if (!editor) {
    return null
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentNote) {
      updateNote(currentNote.id, { title: e.target.value })
      markUnsavedChanges()
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {currentNote ? (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-4 bg-white dark:bg-gray-800">
            <input
              type="text"
              value={currentNote.title}
              onChange={handleTitleChange}
              placeholder={t('notes.untitled')}
              className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <Toolbar editor={editor} />

          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-800">
            <EditorContent
              editor={editor}
              className="h-full"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('editor.placeholder')}
            </p>
            <button
              onClick={() => {
                const { createNote } = useNotes.getState()
                createNote()
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('app.newNote')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
