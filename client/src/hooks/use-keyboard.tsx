import { useState, useCallback, useEffect } from "react";

interface KeyLogEntry {
  key: string;
  type: "down" | "up";
  timestamp: string;
}

export function useKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [keyLog, setKeyLog] = useState<KeyLogEntry[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    const code = event.code;
    const displayKey = key === ' ' ? 'Space' : key;
    
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(key);
      // Also add the physical key code for proper highlighting
      if (code.startsWith('Digit') || code.startsWith('Key')) {
        const physicalKey = code.replace('Digit', '').replace('Key', '').toLowerCase();
        newSet.add(physicalKey);
      }
      return newSet;
    });
    
    const timestamp = new Date().toLocaleTimeString();
    setKeyLog(prev => [...prev, { key: displayKey, type: "down", timestamp }]);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    const code = event.code;
    
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      // Also remove the physical key code
      if (code.startsWith('Digit') || code.startsWith('Key')) {
        const physicalKey = code.replace('Digit', '').replace('Key', '').toLowerCase();
        newSet.delete(physicalKey);
      }
      return newSet;
    });
  }, []);

  const clearKeyLog = useCallback(() => {
    setKeyLog([]);
  }, []);

  // Auto-attach event listeners globally
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      // Prevent duplicate handling from virtual keyboard component
      if (!event.repeat) {
        handleKeyDown(event);
      }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
      handleKeyUp(event);
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    pressedKeys,
    keyLog,
    handleKeyDown,
    handleKeyUp,
    clearKeyLog,
  };
}
