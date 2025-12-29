import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useTopics', () => ({
  useTopics: jest.fn(),
}));

jest.mock('@/context/ContentContext', () => ({
  useContentContext: jest.fn(),
}));

jest.mock('@/context/LocalhostContext', () => ({
  useLocalStorage: jest.fn(),
}));

import { useContentRedux } from '@/hooks/useContentRedux';
import { useLocalStorage } from '@/context/LocalhostContext';
import { useTopics } from '@/hooks/useTopics';

import { LanguagesList } from './index';

describe('LanguagesList Component', () => {
  const mockPush = jest.fn();
  const mockSetItem = jest.fn();
  const mockGetItem = jest.fn();

  const sampleTopics = [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'Python' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useLocalStorage as jest.Mock).mockReturnValue({
      getItem: mockGetItem,
      setItem: mockSetItem,
    });
  });

  it('shows loading spinner when loading is true', () => {
    (useTopics as jest.Mock).mockReturnValue({ topics: [], loading: true });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: null,
      fetchContent: jest.fn(),
    });

    render(<LanguagesList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows "No topics found" when topics is empty', () => {
    (useTopics as jest.Mock).mockReturnValue({ topics: [], loading: false });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: null,
      fetchContent: jest.fn(),
    });

    render(<LanguagesList />);

    expect(screen.getByText('No topics found')).toBeInTheDocument();
  });

  it('renders topics and handles topic click navigation', () => {
    (useTopics as jest.Mock).mockReturnValue({
      topics: sampleTopics,
      loading: false,
    });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: null,
      fetchContent: jest.fn(),
    });
    mockGetItem.mockReturnValue(JSON.stringify([]));

    render(<LanguagesList />);

    const topic = screen.getByTestId('topic-javascript');
    expect(topic).toBeInTheDocument();
    fireEvent.click(topic);

    expect(mockPush).toHaveBeenCalledWith('/learn/javascript');
    expect(mockSetItem).toHaveBeenCalledWith('lvl_name', 'javascript');
  });

  it('redirects to correct custom routes for known topics', () => {
    (useTopics as jest.Mock).mockReturnValue({
      topics: [{ id: '99', name: 'Competitive-Programming' }],
      loading: false,
    });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: null,
      fetchContent: jest.fn(),
    });
    mockGetItem.mockReturnValue([]);
    render(<LanguagesList />);
    const cpTopic = screen.getByTestId('topic-competitive-programming');
    fireEvent.click(cpTopic);
    expect(mockPush).toHaveBeenCalledWith('/competitive-programming');
  });

  it('adds new language to progressCache in useEffect', () => {
    const sampleContent = [{ name: 'Python' }];
    (useTopics as jest.Mock).mockReturnValue({
      topics: sampleTopics,
      loading: false,
    });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: sampleContent,
      fetchContent: jest.fn(),
    });

    mockGetItem.mockReturnValue(['javascript']); // old progress

    render(<LanguagesList />);

    expect(mockSetItem).toHaveBeenCalledWith('progressCache', [
      'javascript',
      'Python',
    ]);
  });

  it('does not update progressCache if language already in progress', () => {
    const sampleContent = [{ name: 'Python' }];
    (useTopics as jest.Mock).mockReturnValue({
      topics: sampleTopics,
      loading: false,
    });
    (useContentRedux as jest.Mock).mockReturnValue({
      content: sampleContent,
      fetchContent: jest.fn(),
    });

    mockGetItem.mockReturnValue(['python']); // already exists

    render(<LanguagesList />);

    expect(mockSetItem).not.toHaveBeenCalledWith(
      'progressCache',
      expect.arrayContaining(['Python'])
    );
  });
});
