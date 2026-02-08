import { Note } from '../types'

export const exportNoteAsTxt = (note: Note): Blob => {
  const content = `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}`
  return new Blob([content], { type: 'text/plain;charset=utf-8' })
}

export const exportNoteAsHtml = (note: Note): Blob => {
  const content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="content">
    ${note.content}
  </div>
  <footer>
    <p><small>Created: ${new Date(note.createdAt).toLocaleString()}</small></p>
    <p><small>Last modified: ${new Date(note.updatedAt).toLocaleString()}</small></p>
  </footer>
</body>
</html>`
  return new Blob([content], { type: 'text/html;charset=utf-8' })
}

export const exportNoteAsMarkdown = (note: Note): Blob => {
  const content = `# ${note.title}\n\n${note.content}`
  return new Blob([content], { type: 'text/markdown;charset=utf-8' })
}

export const exportNoteAsJson = (note: Note): Blob => {
  const content = JSON.stringify(note, null, 2)
  return new Blob([content], { type: 'application/json;charset=utf-8' })
}

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportNote = (note: Note, format: 'txt' | 'html' | 'md' | 'json') => {
  let blob: Blob
  let extension: string

  switch (format) {
    case 'txt':
      blob = exportNoteAsTxt(note)
      extension = 'txt'
      break
    case 'html':
      blob = exportNoteAsHtml(note)
      extension = 'html'
      break
    case 'md':
      blob = exportNoteAsMarkdown(note)
      extension = 'md'
      break
    case 'json':
      blob = exportNoteAsJson(note)
      extension = 'json'
      break
  }

  const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`
  downloadFile(blob, filename)
}

export const exportAllNotes = (notes: Note[], format: 'txt' | 'html' | 'md' | 'json') => {
  const timestamp = new Date().toISOString().split('T')[0]
  
  if (format === 'json') {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json;charset=utf-8' })
    downloadFile(blob, `all-notes-${timestamp}.json`)
  } else {
    notes.forEach((note, index) => {
      setTimeout(() => {
        exportNote(note, format)
      }, index * 100)
    })
  }
}
