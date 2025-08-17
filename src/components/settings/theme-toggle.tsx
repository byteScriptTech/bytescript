'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme</h3>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme('light')}
          className={cn(
            'h-10 w-10',
            theme === 'light' && 'bg-primary/10 border-primary'
          )}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme('dark')}
          className={cn(
            'h-10 w-10',
            theme === 'dark' && 'bg-primary/10 border-primary'
          )}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme('system')}
          className={cn(
            'h-10 w-10',
            theme === 'system' && 'bg-primary/10 border-primary'
          )}
          aria-label="System theme"
        >
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
