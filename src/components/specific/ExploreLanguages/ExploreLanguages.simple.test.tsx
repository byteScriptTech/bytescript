import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

// Mock the LanguagesList component with a simple implementation
jest.mock('../LanguagesList', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-languages-list">Mock Languages List</div>
  ),
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: ReactNode }) => (
    <button data-testid="mock-button">{children}</button>
  ),
}));

// Mock the Card components
jest.mock('@/components/ui/card', () => {
  const originalModule = jest.requireActual('@/components/ui/card');
  return {
    ...originalModule,
    Card: ({ children }: { children: ReactNode }) => (
      <div data-testid="mock-card">{children}</div>
    ),
    CardContent: ({ children }: { children: ReactNode }) => (
      <div data-testid="mock-card-content">{children}</div>
    ),
    CardHeader: ({ children }: { children: ReactNode }) => (
      <div data-testid="mock-card-header">{children}</div>
    ),
    CardTitle: ({ children }: { children: ReactNode }) => (
      <h3 data-testid="mock-card-title">{children}</h3>
    ),
  };
});

// Mock the BookOpen icon
jest.mock('lucide-react', () => ({
  BookOpen: () => <div data-testid="mock-book-icon" />,
}));

// Import the component after setting up mocks
import { ExploreLanguages } from '.';

describe('ExploreLanguages Component - Simple Test', () => {
  it('should render without crashing', () => {
    // Just test that the component renders without throwing an error
    expect(() => render(<ExploreLanguages />)).not.toThrow();
  });
});
