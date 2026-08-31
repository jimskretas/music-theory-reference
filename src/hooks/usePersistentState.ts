import { useCallback, useEffect, useRef, useState } from 'react';

export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {
      // ignore
    }
    return initialValue;
  });

  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    try {
      localStorage.setItem(keyRef.current, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => (typeof value === 'function' ? (value as (p: T) => T)(prev) : value));
  }, []);

  return [state, set];
}
