import { useEffect } from 'react'
import { useNotesStore } from './stores/notesStore'
import { useSettingsStore } from './stores/settingsStore'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import RichEditor from './components/Editor/RichEditor'
import CommandPalette from './components/UI/CommandPalette'
import { useKeyboard } from './hooks/useKeyboard'

function App() {
  const { loadNotes } = useNotesStore()
  const { theme } = useSettingsStore()

  useKeyboard('ctrl+k', () => {
    const event = new CustomEvent('open-command-palette')
    window.dispatchEvent(event)
  })

  useKeyboard('ctrl+s', (e) => {
    e.preventDefault()
    const { saveCurrentNote } = useNotesStore.getState()
    saveCurrentNote()
  })

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          <RichEditor />
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}

export default App
