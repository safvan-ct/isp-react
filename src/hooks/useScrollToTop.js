import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop hook resets window scroll coordinates to (0, 0)
 * on router location path change.
 */
export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
