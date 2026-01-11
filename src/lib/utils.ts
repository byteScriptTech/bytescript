import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const errorData = error as { data?: unknown };
    if (typeof errorData.data === 'string') {
      return errorData.data;
    }
    return String(errorData.data || 'Unknown error');
  }
  return 'Unknown error';
}
