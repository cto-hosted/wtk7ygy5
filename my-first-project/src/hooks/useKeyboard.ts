import { useEffect, useCallback } from 'react';

type Shortcut =
  | 'ctrl+n'
  | 'ctrl+s'
  | 'ctrl+k'
  | 'ctrl+b'
  | 'ctrl+i'
  | 'ctrl+u'
  | 'escape';

export function useKeyboard(
  shortcut: Shortcut,
  callback: () => void,
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      const matches = () => {
        switch (shortcut) {
          case 'ctrl+n':
            return isCtrl && key === 'n';
          case 'ctrl+s':
            return isCtrl && key === 's';
          case 'ctrl+k':
            return isCtrl && key === 'k';
          case 'ctrl+b':
            return isCtrl && key === 'b';
          case 'ctrl+i':
            return isCtrl && key === 'i';
          case 'ctrl+u':
            return isCtrl && key === 'u';
          case 'escape':
            return key === 'escape';
          default:
            return false;
        }
      };

      if (matches()) {
        event.preventDefault();
        callback();
      }
    },
    [shortcut, callback]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export function useKeyboardShortcuts(
  shortcuts: Record<Shortcut, () => void>,
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      const getPressedShortcut = (): Shortcut | null => {
        if (isCtrl && key === 'n') return 'ctrl+n';
        if (isCtrl && key === 's') return 'ctrl+s';
        if (isCtrl && key === 'k') return 'ctrl+k';
        if (isCtrl && key === 'b') return 'ctrl+b';
        if (isCtrl && key === 'i') return 'ctrl+i';
        if (isCtrl && key === 'u') return 'ctrl+u';
        if (key === 'escape') return 'escape';
        return null;
      };

      const pressed = getPressedShortcut();
      if (pressed && shortcuts[pressed]) {
        event.preventDefault();
        shortcuts[pressed]();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
