'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

// This function runs only on the server during the initial render
const getInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  // Always return the default theme during SSR/SSG
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  // On client side, try to get the theme from localStorage
  try {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    return storedTheme || defaultTheme;
  } catch (e) {
    // In case localStorage is not available, return default
    return defaultTheme;
  }
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'bytescript-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme)
  );
  const [mounted, setMounted] = React.useState(false);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      },
    }),
    [theme, storageKey]
  );

  // Apply theme class to the HTML element before the initial render
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let themeToApply = theme;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      themeToApply = systemTheme;
    }

    root.classList.add(themeToApply);
    setMounted(true);
  }, [theme, storageKey]);

  // Prevent the UI from rendering until the theme is applied
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
