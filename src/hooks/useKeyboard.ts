import { useEffect } from 'react'

type KeyboardHandler = (e: KeyboardEvent) => void

const keyMap = new Map<string, Set<KeyboardHandler>>()

export const useKeyboard = (
  key: string,
  handler: KeyboardHandler,
  deps: any[] = []
) => {
  useEffect(() => {
    if (!keyMap.has(key)) {
      keyMap.set(key, new Set())
    }
    keyMap.get(key)!.add(handler)

    return () => {
      keyMap.get(key)?.delete(handler)
    }
  }, [key, ...deps])
}

useKeyboard.init = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    const modifiers: string[] = []
    
    if (e.ctrlKey || e.metaKey) modifiers.push('ctrl')
    if (e.shiftKey) modifiers.push('shift')
    if (e.altKey) modifiers.push('alt')
    
    modifiers.push(key)
    const shortcut = modifiers.join('+')
    
    const handlers = keyMap.get(shortcut)
    if (handlers && handlers.size > 0) {
      handlers.forEach((handler) => handler(e))
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}

export const formatShortcut = (shortcut: string): string => {
  return shortcut
    .split('+')
    .map((key) => {
      if (key === 'ctrl' || key === 'cmd') {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'
      }
      if (key === 'shift') return '⇧'
      if (key === 'alt') return '⌥'
      return key.charAt(0).toUpperCase() + key.slice(1)
    })
    .join(' ')
}
