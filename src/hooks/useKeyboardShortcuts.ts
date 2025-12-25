import { useEffect } from 'react';

interface KeyboardShortcuts {
  onZoomToFit?: () => void;
  onZoomTo100?: () => void;
  onZoomToSelection?: () => void;
  onSelectAll?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onToolSelect?: () => void;
  onToolHand?: () => void;
  onToolZoom?: () => void;
  onToolText?: () => void;
  onToolFrame?: () => void;
}

/**
 * Keyboard Shortcuts Hook
 * Handles all Figma-style keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Prevent shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        // Allow some shortcuts even when typing
        if (cmdOrCtrl && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'z')) {
          // Allow these
        } else {
          return;
        }
      }

      // Zoom shortcuts
      if (cmdOrCtrl && e.key === '0') {
        e.preventDefault();
        shortcuts.onZoomToFit?.();
        return;
      }

      if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        shortcuts.onZoomTo100?.();
        return;
      }

      if (cmdOrCtrl && e.key === '2') {
        e.preventDefault();
        shortcuts.onZoomToSelection?.();
        return;
      }

      // Selection shortcuts
      if (cmdOrCtrl && e.key === 'a') {
        e.preventDefault();
        shortcuts.onSelectAll?.();
        return;
      }

      // Edit shortcuts
      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        shortcuts.onDuplicate?.();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          shortcuts.onDelete?.();
          return;
        }
      }

      if (cmdOrCtrl && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        shortcuts.onGroup?.();
        return;
      }

      if (cmdOrCtrl && e.key === 'g' && e.shiftKey) {
        e.preventDefault();
        shortcuts.onUngroup?.();
        return;
      }

      if (cmdOrCtrl && e.key === 'c') {
        shortcuts.onCopy?.();
        return;
      }

      if (cmdOrCtrl && e.key === 'v') {
        shortcuts.onPaste?.();
        return;
      }

      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        shortcuts.onUndo?.();
        return;
      }

      if (cmdOrCtrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        shortcuts.onRedo?.();
        return;
      }

      // Layer order shortcuts
      if (cmdOrCtrl && e.key === ']' && !e.shiftKey) {
        e.preventDefault();
        shortcuts.onBringForward?.();
        return;
      }

      if (cmdOrCtrl && e.key === '[' && !e.shiftKey) {
        e.preventDefault();
        shortcuts.onSendBackward?.();
        return;
      }

      if (cmdOrCtrl && e.key === ']' && e.shiftKey) {
        e.preventDefault();
        shortcuts.onBringToFront?.();
        return;
      }

      if (cmdOrCtrl && e.key === '[' && e.shiftKey) {
        e.preventDefault();
        shortcuts.onSendToBack?.();
        return;
      }

      // Tool shortcuts (only when not typing)
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        if (e.key === 'v' && !cmdOrCtrl) {
          shortcuts.onToolSelect?.();
          return;
        }

        if (e.key === 'h' && !cmdOrCtrl) {
          shortcuts.onToolHand?.();
          return;
        }

        if (e.key === 'z' && !cmdOrCtrl && !e.shiftKey) {
          shortcuts.onToolZoom?.();
          return;
        }

        if (e.key === 't' && !cmdOrCtrl) {
          shortcuts.onToolText?.();
          return;
        }

        if (e.key === 'f' && !cmdOrCtrl) {
          shortcuts.onToolFrame?.();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

