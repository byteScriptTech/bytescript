// Mock Firebase modules to prevent actual initialization
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  GithubAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useTopics } from '@/hooks/useTopics';
import { Topic } from '@/types/content';

import LearnContent from './LearnContent';

// Mock the useTopics hook
jest.mock('@/hooks/useTopics');

// Mock the LearnTopicCard component
jest.mock('@/components/specific/LearnTopicCard', () => ({
  LearnTopicCard: ({ topic }: { topic: Topic }) => (
    <div data-testid="learn-topic-card">{topic.name}</div>
  ),
}));

const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'JavaScript',
    slug: 'javascript',
    challenges: [],
  },
  {
    id: '2',
    name: 'Python',
    slug: 'python',
    challenges: [],
  },
];

describe('LearnContent', () => {
  const mockUseTopics = useTopics as jest.MockedFunction<typeof useTopics>;
  const mockAddTopic = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTopics.mockReturnValue({
      topics: [],
      loading: true,
      addTopic: mockAddTopic,
    });
  });

  it('displays loading state initially', () => {
    const { container } = render(<LearnContent />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays topics when loaded', async () => {
    mockUseTopics.mockReturnValue({
      topics: mockTopics,
      loading: false,
      addTopic: mockAddTopic,
    });

    render(<LearnContent />);

    // Check if all topics are rendered
    const topicCards = screen.getAllByTestId('learn-topic-card');
    expect(topicCards).toHaveLength(2);
    expect(topicCards[0]).toHaveTextContent('JavaScript');
    expect(topicCards[1]).toHaveTextContent('Python');
  });

  it('displays the correct heading', () => {
    mockUseTopics.mockReturnValue({
      topics: [],
      loading: false,
      addTopic: mockAddTopic,
    });

    render(<LearnContent />);
    expect(screen.getByText('All Learning Paths')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading', () => {
    mockUseTopics.mockReturnValue({
      topics: [],
      loading: true,
      addTopic: mockAddTopic,
    });

    const { container } = render(<LearnContent />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(8); // 8 skeleton loaders as per the component
  });

  it('displays no topics message when no topics are available', () => {
    mockUseTopics.mockReturnValue({
      topics: [],
      loading: false,
      addTopic: mockAddTopic,
    });

    render(<LearnContent />);
    const topicCards = screen.queryAllByTestId('learn-topic-card');
    expect(topicCards).toHaveLength(0);
  });
});
