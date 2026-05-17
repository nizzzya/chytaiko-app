import { ThemeProvider } from './theme';
import { AppNavigation } from './navigation';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}
