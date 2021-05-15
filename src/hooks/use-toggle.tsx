import { useState, useCallback } from 'react';

export default function useToggle(on?: boolean) {
  const [value, setToggle] = useState(!!on);

  return {
    value,
    toggleOff: useCallback(() => setToggle(false), []),
    toggleOn: useCallback(() => setToggle(true), []),
    toggle: useCallback(() => setToggle(!value), [value]),
  };
}
