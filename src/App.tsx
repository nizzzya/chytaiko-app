import { useEffect } from 'react';

import { initializeAppHydration } from './features/app/services/appHydrationService';
import { initializeStoriesData } from './features/stories/services/storiesService';
import { AppNavigation } from './navigation';
import { ThemeProvider } from './theme';

export default function App() {
  useEffect(() => {
    void initializeAppHydration();
    void initializeStoriesData();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}
