'use client';

import { useEffect } from 'react';

export function MotoScoutThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply MotoScout theme to body when mounted
    document.body.setAttribute('data-motoscout', 'true');
    
    return () => {
      // Remove theme when unmounted
      document.body.removeAttribute('data-motoscout');
    };
  }, []);

  return <>{children}</>;
}
