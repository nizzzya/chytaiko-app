import { useEffect } from 'react';

import { initializeAppHydration } from './features/app/services/appHydrationService';
import { AppNavigation } from './navigation';
import { ThemeProvider } from './theme';

export default function App() {
  useEffect(() => {
    void initializeAppHydration();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}
