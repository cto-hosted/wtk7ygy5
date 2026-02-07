import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotesStore } from './stores/notesStore';
import { useUIStore } from './stores/uiStore';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboard } from './hooks/useKeyboard';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { RichEditor } from './components/Editor/RichEditor';
import { CommandPalette } from './components/UI/CommandPalette';
import { WelcomeScreen } from './components/UI/WelcomeScreen';
import { exportToMarkdown, exportToHTML, exportToPDF } from './utils/export';
import { Download, Trash2 } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const {
    notes,
    currentNoteId,
    addNote,
    deleteNote,
    setCurrentNote,
  } = useNotesStore();
  const { theme, language, sidebarOpen, toggleCommandPalette } = useUIStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const currentNote = notes.find((n) => n.id === currentNoteId);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  useAutoSave(currentNoteId, title, content);

  useKeyboard('ctrl+n', () => {
    const id = addNote({
      title: t('editor.titlePlaceholder'),
      content: '',
      folderId: null,
      tags: [],
    });
    setCurrentNote(id);
  });

  useKeyboard('ctrl+k', () => {
    toggleCommandPalette();
  });

  const handleDelete = () => {
    if (currentNoteId && window.confirm(t('messages.confirmDelete'))) {
      deleteNote(currentNoteId);
    }
  };

  const handleExportMarkdown = () => {
    if (currentNote) {
      exportToMarkdown(currentNote.title, currentNote.content);
      setShowExportMenu(false);
    }
  };

  const handleExportHTML = () => {
    if (currentNote) {
      exportToHTML(currentNote.title, currentNote.content);
      setShowExportMenu(false);
    }
  };

  const handleExportPDF = async () => {
    if (currentNote && editorRef.current) {
      try {
        await exportToPDF(currentNote.title, editorRef.current);
        setShowExportMenu(false);
      } catch (error) {
        console.error('Failed to export PDF:', error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 sepia:bg-sepia-50 text-gray-900 dark:text-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && <Sidebar />}
        
        {!currentNoteId ? (
          <WelcomeScreen />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sepia:bg-sepia-100">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('editor.titlePlaceholder')}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none flex-1"
              />
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download size={18} />
                    {t('actions.export')}
                  </button>
                  
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                      <button
                        onClick={handleExportMarkdown}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg"
                      >
                        {t('actions.exportMarkdown')}
                      </button>
                      <button
                        onClick={handleExportHTML}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('actions.exportHTML')}
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg"
                      >
                        {t('actions.exportPDF')}
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleDelete}
                  className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                  title={t('actions.delete')}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6" ref={editorRef}>
              <RichEditor content={content} onChange={setContent} />
            </div>
          </div>
        )}
      </div>
      
      <CommandPalette />
    </div>
  );
}

export default App;
