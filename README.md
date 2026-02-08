# Advanced Notepad

A professional, feature-rich note-taking application built with React, TypeScript, and modern web technologies.

## Features

### 🎨 Rich Text Editing
- Full-featured WYSIWYG editor powered by TipTap/ProseMirror
- Text formatting: **Bold**, *Italic*, <u>Underline</u>, ~~Strikethrough~~
- Headings (H1, H2, H3)
- Lists (bullet and numbered)
- Text highlighting
- Hyperlinks
- Text alignment (left, center, right)
- Undo/Redo functionality

### 🌍 International Support
Available in 10+ languages:
- English (en)
- Español (es)
- Français (fr)
- Deutsch (de)
- 中文 (zh)
- 日本語 (ja)
- 한국어 (ko)
- العربية (ar)
- हिन्दी (hi)
- Português (pt)

### 🎨 Multiple Themes
- Light mode - Clean and bright
- Dark mode - Easy on the eyes
- Sepia mode - Comfortable reading

### 📁 Smart Organization
- Create and manage folders
- Organize notes hierarchically
- Quick search functionality
- Tag support for better categorization

### 📥 Export Options
Export your notes in multiple formats:
- Markdown (.md)
- HTML (.html)
- PDF (.pdf)

### ⌨️ Keyboard Shortcuts
Work efficiently with powerful keyboard shortcuts:
- `Ctrl+N` - Create new note
- `Ctrl+K` - Open command palette
- `Ctrl+F` - Search notes
- `Ctrl+S` - Save note (auto-save enabled)
- `Esc` - Close dialogs

### 💾 Auto-Save
Never lose your work! Notes are automatically saved as you type with intelligent debouncing.

### 📱 Responsive Design
Works seamlessly on desktop, tablet, and mobile devices.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TipTap** - Rich text editor
- **Zustand** - State management
- **i18next** - Internationalization
- **jsPDF & html2canvas** - PDF export
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd advanced-notepad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Editor/
│   │   └── RichEditor.tsx       # TipTap rich text editor
│   ├── Layout/
│   │   ├── Header.tsx           # Top navigation bar
│   │   └── Sidebar.tsx          # Notes and folders sidebar
│   └── UI/
│       ├── CommandPalette.tsx   # Command search interface
│       └── WelcomeScreen.tsx    # First-time user screen
├── hooks/
│   ├── useAutoSave.ts           # Auto-save functionality
│   └── useKeyboard.ts           # Keyboard shortcuts handler
├── stores/
│   ├── notesStore.ts            # Notes and folders state
│   └── uiStore.ts               # UI preferences state
├── i18n/
│   ├── index.ts                 # i18n configuration
│   └── locales/                 # Translation files
│       ├── en.json
│       ├── es.json
│       └── ...
├── utils/
│   ├── export.ts                # Export functionality
│   └── storage.ts               # LocalStorage helpers
├── types/
│   └── index.ts                 # TypeScript type definitions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## Features in Detail

### State Management
The application uses Zustand for state management with persistence:
- **Notes Store**: Manages notes, folders, and search functionality
- **UI Store**: Manages theme, language, and UI state

All data is persisted to localStorage automatically.

### Internationalization
Built with react-i18next for seamless language switching. Adding new languages is straightforward - just add a new JSON file in `src/i18n/locales/`.

### Theme System
Three carefully crafted themes:
- Implemented with Tailwind CSS dark mode
- Custom sepia theme for comfortable extended reading
- Theme preference persisted across sessions

### Export Functionality
- **Markdown**: Plain text export with formatting preserved
- **HTML**: Styled HTML document ready to open in any browser
- **PDF**: High-quality PDF export using html2canvas and jsPDF

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Storage

The application stores all data locally in your browser using localStorage. No server or account required!

**Note**: localStorage has a size limit (typically 5-10MB). For large note collections, consider exporting important notes regularly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Future Enhancements

Potential features for future releases:
- [ ] Cloud sync with backend integration
- [ ] Real-time collaboration
- [ ] Note encryption
- [ ] Advanced search with filters
- [ ] Code syntax highlighting
- [ ] Image and file attachments
- [ ] Import from other note-taking apps
- [ ] Browser extension
- [ ] Desktop application (Electron)
- [ ] Mobile app (React Native)

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

Built with modern web technologies and inspired by the best note-taking applications.
