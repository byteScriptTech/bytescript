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

import { useLanguages } from '@/context/LanguagesContext';

import LanguageBody from '../LanguageBody';

// Mock Firebase
jest.mock('../../../../lib/firebase', () => ({
  auth: () => ({
    currentUser: null,
    signOut: jest.fn(),
  }),
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
  });

  it('renders correctly with valid language', () => {
    (useLanguages as jest.Mock).mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

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
    (useLanguages as jest.Mock).mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={{ name: 'javascript', id: '1' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: 'ruby', id: '1' }}
      />
    );

    expect(warnSpy).toHaveBeenCalledWith('Language not found:', 'ruby');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when search parameters are missing', () => {
    (useLanguages as jest.Mock).mockReturnValue({
      loading: false,
      languages: mockLanguages,
    });

    render(
      <LanguageBody
        currentTopic={{ name: 'javascript', id: '1' }}
        setCurrentTopic={mockSetCurrentTopic}
        searchParams={{ name: '', id: '' }}
      />
    );

    expect(warnSpy).toHaveBeenCalledWith(
      'Missing required search parameters:',
      { name: '', id: '' }
    );
    expect(notFound).toHaveBeenCalled();
  });

  it('handles array values for name parameter', () => {
    (useLanguages as jest.Mock).mockReturnValue({
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
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when loading is true', () => {
    (useLanguages as jest.Mock).mockReturnValue({
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

    expect(notFound).not.toHaveBeenCalled();
  });
});
