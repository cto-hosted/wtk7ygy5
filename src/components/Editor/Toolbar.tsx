import { useTranslation } from 'react-i18next'
import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  ListTodo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Undo,
  Redo,
  MoreHorizontal,
} from 'lucide-react'
import { useState } from 'react'

interface ToolbarProps {
  editor: Editor
}

export default function Toolbar({ editor }: ToolbarProps) {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  const addImage = () => {
    const url = window.prompt(t('editor.image'))
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt(t('editor.link'))
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  const Button = ({
    onClick,
    children,
    active = false,
    disabled = false,
    title,
  }: {
    onClick: () => void
    children: React.ReactNode
    active?: boolean
    disabled?: boolean
    title?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )

  const Separator = () => (
    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
  )

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center gap-1 overflow-x-auto">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title={t('editor.bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title={t('editor.italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title={t('editor.underline')}>
        <Underline className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title={t('editor.strike')}>
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title={t('editor.code')}>
        <Code className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title={t('editor.heading')}>
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title={t('editor.heading')}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title={t('editor.heading')}>
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title={t('editor.bulletList')}>
        <List className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title={t('editor.orderedList')}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title={t('editor.taskList')}>
        <ListTodo className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title={t('editor.quote')}>
        <Quote className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={addLink} active={editor.isActive('link')} title={t('editor.link')}>
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button onClick={addImage} title={t('editor.image')}>
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={addTable} title={t('editor.table')}>
        <Table className="h-4 w-4" />
      </Button>

      <Separator />

      <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title={t('editor.undo')}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title={t('editor.redo')}>
        <Redo className="h-4 w-4" />
      </Button>

      <Separator />

      <div className="relative">
        <Button onClick={() => setShowMore(!showMore)} title={t('common.more')}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
