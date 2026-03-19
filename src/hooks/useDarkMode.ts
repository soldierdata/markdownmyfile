import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('md-converter-dark');
    if (stored !== null) return stored === 'true';
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('md-converter-dark', String(dark));
  }, [dark]);

  return [dark, () => setDark(d => !d)] as const;
}
