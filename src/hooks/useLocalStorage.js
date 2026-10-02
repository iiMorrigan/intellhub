import { useState, useEffect } from 'react';

// A reusable hook that behaves like useState, but automatically
// saves the value to the browser's localStorage and reloads it
// on the next visit. This is the ONLY place in the app that talks
// to localStorage — when we add a real backend later, we can swap
// this one hook out for API calls instead of hunting through every file.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`Could not read localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not write localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
