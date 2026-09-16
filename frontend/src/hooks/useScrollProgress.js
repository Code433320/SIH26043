import { useState, useEffect, createContext, useContext } from 'react';

export const ScrollContext = createContext(0);

export function useScrollProgress() {
  return useContext(ScrollContext);
}

/**
 * Returns a 0→1 value scoped to a section band of the total scroll.
 * e.g. useSectionProgress(0.2, 0.4) → 0 when global progress=0.2, 1 when global=0.4
 */
export function useSectionProgress(start, end) {
  const progress = useScrollProgress();
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

/**
 * Top-level hook — use once in LandingPage to drive the Provider value.
 */
export function useGlobalScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
}
