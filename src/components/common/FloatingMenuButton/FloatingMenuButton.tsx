// src/components/common/FloatingMenuButton/FloatingMenuButton.tsx
'use client';

import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FloatingMenuButton({
  isOpen,
  onToggle,
  className,
}: FloatingMenuButtonProps) {
  return (
    <Button
      onClick={onToggle}
      className={cn(
        'fixed bottom-4 left-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform md:hidden',
        isOpen && 'transform rotate-90',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      variant="default"
      size="icon"
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );
}
