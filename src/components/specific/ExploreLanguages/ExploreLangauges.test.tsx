import { render, screen } from '@testing-library/react';

// Mock next/navigation
const mockPush = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
  pathname: '/',
}));

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => '/',
}));

// Mock the LanguagesList component with a simple implementation
jest.mock('../LanguagesList', () => {
  const MockLanguagesList = () => (
    <div data-testid="languages-list">Languages List</div>
  );
  MockLanguagesList.displayName = 'LanguagesList';
  return MockLanguagesList;
});

// Mock the ContentContext
jest.mock('@/context/ContentContext', () => ({
  useContentContext: () => ({
    content: [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'Python', slug: 'python' },
    ],
  }),
}));

// Mock the LocalhostContext
jest.mock('@/context/LocalhostContext', () => ({
  useLocalStorage: () => ({
    getItem: jest.fn(() => []),
    setItem: jest.fn(),
  }),
}));

// Mock the useTopics hook
jest.mock('@/hooks/useTopics', () => ({
  useTopics: () => ({
    topics: [
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'Python' },
    ],
    loading: false,
  }),
}));

import ExploreLanguages from '.';

describe('ExploreLanguages Component', () => {
  it('Should render the LanguagesList component', () => {
    render(<ExploreLanguages />);
    expect(screen.getByTestId('languages-list')).toBeInTheDocument();
  });
});
