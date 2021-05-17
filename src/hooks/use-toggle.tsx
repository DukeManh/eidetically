import { useState, useCallback } from 'react';

export default function useToggle(on?: boolean) {
  const [value, setToggle] = useState(!!on);

  return {
    value,
    toggle: useCallback((val = !value) => setToggle(val), [value]),
  };
}
