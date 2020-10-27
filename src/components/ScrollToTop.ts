// ScrollToTop.ts
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

/*
 * Registers a history listener on mount which
 * scrolls to the top of the page on route change
 */
export const ScrollToTop = () => {
  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return unlisten;
  }, [history]);

  return null;
};