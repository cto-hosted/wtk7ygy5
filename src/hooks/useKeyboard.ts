import { useEffect } from 'react';

type KeyboardHandler = (event: KeyboardEvent) => void;

export const useKeyboard = (key: string, handler: KeyboardHandler, deps: any[] = []) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keys = key.split('+').map(k => k.trim().toLowerCase());
      const hasCtrl = keys.includes('ctrl') || keys.includes('cmd');
      const hasShift = keys.includes('shift');
      const hasAlt = keys.includes('alt');
      const mainKey = keys.find(k => !['ctrl', 'cmd', 'shift', 'alt'].includes(k));

      const ctrlPressed = event.ctrlKey || event.metaKey;
      const shiftPressed = event.shiftKey;
      const altPressed = event.altKey;

      if (
        (!hasCtrl || ctrlPressed) &&
        (!hasShift || shiftPressed) &&
        (!hasAlt || altPressed) &&
        event.key.toLowerCase() === mainKey
      ) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, deps);
};
