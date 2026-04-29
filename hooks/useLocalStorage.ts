"use client";

import { useState, useCallback, useEffect } from "react";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    setValue(readStorage(key, initialValue));
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, set] as const;
}
