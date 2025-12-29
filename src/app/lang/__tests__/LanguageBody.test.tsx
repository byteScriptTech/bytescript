import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';

// Mock console.warn
const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

// Clean up mock after each test
afterEach(() => {
  warnSpy.mockClear();
});

// Mock Navbar
jest.mock('@/components/common/Navbar', () => {
  const Navbar = () => <div data-testid="navbar">Navbar</div>;
  Navbar.displayName = 'Navbar';
  return Navbar;
});

// Mock Sidebar
jest.mock('@/components/common/Sidebar', () => {
  const Sidebar = () => <div data-testid="sidebar">Sidebar</div>;
  Sidebar.displayName = 'Sidebar';
  return Sidebar;
});

// Mock LearnScreenBreadCrumb
jest.mock('@/components/specific/LearnScreenBreadCrumb', () => {
  const LearnScreenBreadCrumb = () => (
    <div data-testid="breadcrumb">LearnScreenBreadCrumb</div>
  );
  LearnScreenBreadCrumb.displayName = 'LearnScreenBreadCrumb';
  return LearnScreenBreadCrumb;
});

// Mock LearnContent
jest.mock('@/components/specific/LearnContent', () => {
  const LearnContent = () => (
    <div data-testid="learn-content">Learn Content</div>
  );
  LearnContent.displayName = 'LearnContent';
  return LearnContent;
});

import LanguageBody from '../LanguageBody';

// Mock Firebase auth
jest.mock('@/firebase/config', () => ({
  auth: {
    currentUser: null,
    signOut: jest.fn(),
  },
}));

// Mock Firebase services
jest.mock('@/services/firebase/problemsService', () => ({
  problemsService: {
    getAllProblems: jest.fn(),
    getProblemById: jest.fn(),
    createProblem: jest.fn(),
    updateProblem: jest.fn(),
    deleteProblem: jest.fn(),
  },
}));

// Mock Redux hooks
const mockUseLanguagesRedux = jest.fn();
jest.mock('@/hooks/useLanguagesRedux', () => ({
  useLanguagesRedux: () => mockUseLanguagesRedux(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  notFound: jest.fn(),
}));

// Mock the useLanguages hook
jest.mock('@/context/LanguagesContext', () => ({
  useLanguages: jest.fn(),
}));

describe('LanguageBody', () => {
  const mockLanguages = [
    { name: 'javascript', id: '1' },
    { name: 'python', id: '2' },
  ];

  const mockSetCurrentTopic = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLanguagesRedux.mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });
  });

  it('renders correctly with valid language', () => {
    render(
      <LanguageBody
        currentTopic={{ name: 'javascript', id: '1' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: 'javascript', id: '1' }}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'javascript'
    );
    expect(screen.getByText('Learn Content')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when language is invalid', () => {
    mockUseLanguagesRedux.mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={{ name: 'invalid', id: '999' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: 'invalid', id: '999' }}
      />
    );

    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when search parameters are missing', () => {
    mockUseLanguagesRedux.mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={undefined}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: '', id: '' }}
      />
    );

    expect(notFound).toHaveBeenCalled();
  });

  it('handles array values for name parameter', () => {
    mockUseLanguagesRedux.mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={{ name: 'javascript', id: '1' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: ['javascript'], id: '1' }}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'javascript'
    );
  });

  it('calls notFound when loading is true', () => {
    mockUseLanguagesRedux.mockReturnValue({
      loading: true,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={{ name: 'javascript', id: '1' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: 'javascript', id: '1' }}
      />
    );

    expect(screen.getByText('Learn Content')).toBeInTheDocument();
  });
});
