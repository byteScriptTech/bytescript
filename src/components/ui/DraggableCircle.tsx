'use client';

import { Code2 } from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect } from 'react';

import { cn } from '@/lib/utils';

interface DraggableCircleProps {
  size?: number;
  _color?: string; // Prefix with underscore to indicate unused
  onClick?: () => void;
}

export function DraggableCircle({
  size = 50,
  _color = 'bg-blue-500', // Prefix with underscore to indicate unused
  onClick,
}: DraggableCircleProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;

    // Position in top-right corner initially
    const parent = circleRef.current.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: parentRect.width - size - 20, // 20px from right
        y: 20, // 20px from top
      });

      // Ensure the parent has proper stacking context
      parent.style.position = 'relative';
      parent.style.overflow = 'visible';
      parent.style.zIndex = '1';
    }
  }, [size]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!circleRef.current) return;

    const rect = circleRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !circleRef.current) return;

      const parent = circleRef.current.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      let newX = e.clientX - parentRect.left - offset.x;
      let newY = e.clientY - parentRect.top - offset.y;

      // Keep circle within parent bounds
      newX = Math.max(0, Math.min(newX, parentRect.width - size));
      newY = Math.max(0, Math.min(newY, parentRect.height - size));

      setPosition({ x: newX, y: newY });
    },
    [isDragging, offset.x, offset.y, size]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={circleRef}
      className={cn(
        'absolute rounded-full cursor-move flex items-center justify-center',
        'bg-primary text-primary-foreground hover:opacity-80 active:opacity-70',
        'transition-opacity select-none shadow-md',
        'dark:bg-primary/90 dark:hover:bg-primary/80',
        'transition-colors duration-200',
        'pointer-events-auto' // Ensure it doesn't block pointer events when not interacting
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none',
        zIndex: 10, // Lower z-index to not interfere with the editor
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!circleRef.current) return;

        const rect = circleRef.current.getBoundingClientRect();
        setOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        setIsDragging(true);
      }}
      onTouchMove={(e) => {
        if (!isDragging || !circleRef.current) return;
        const touch = e.touches[0];

        const parent = circleRef.current.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        let newX = touch.clientX - parentRect.left - offset.x;
        let newY = touch.clientY - parentRect.top - offset.y;

        // Keep circle within parent bounds
        newX = Math.max(0, Math.min(newX, parentRect.width - size));
        newY = Math.max(0, Math.min(newY, parentRect.height - size));

        setPosition({ x: newX, y: newY });
      }}
      onTouchEnd={() => {
        setIsDragging(false);
      }}
      onClick={() => {
        // Only trigger click if not dragging (to prevent accidental clicks after dragging)
        if (!isDragging && onClick) {
          onClick();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      aria-label="Open code editor"
      tabIndex={0}
    >
      <Code2 className="w-1/2 h-1/2" />
    </div>
  );
}
