'use client';

import * as React from 'react';

import { useTheme } from '@/context/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme</h3>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setTheme('light')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
            theme === 'light'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:bg-accent/50'
          }`}
        >
          <div className="w-full aspect-square bg-white rounded mb-2 border" />
          <span className="text-sm">Light</span>
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
            theme === 'dark'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:bg-accent/50'
          }`}
        >
          <div className="w-full aspect-square bg-gray-900 rounded mb-2 border border-gray-800" />
          <span className="text-sm">Dark</span>
        </button>

        <button
          onClick={() => setTheme('system')}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
            theme === 'system'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:bg-accent/50'
          }`}
        >
          <div className="w-full aspect-square rounded mb-2 overflow-hidden border">
            <div className="h-1/2 bg-white dark:bg-gray-900 w-full" />
            <div className="h-1/2 bg-gray-100 dark:bg-gray-800 w-full" />
          </div>
          <span className="text-sm">System</span>
        </button>
      </div>
    </div>
  );
}
