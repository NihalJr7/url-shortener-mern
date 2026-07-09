import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debounced values
 * Useful for search inputs to avoid excessive API calls
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 * @returns {*} The debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
