import { useEffect, useState } from 'react';

// Tailwind CSS 기본 브레이크포인트
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  const query = `(max-width: ${breakpoints[breakpoint]})`;
  return useMediaQuery(query);
}
