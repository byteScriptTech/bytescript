import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Topic } from '@/types/content';

import { LearnTopicCard } from '.';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../CourseIcon', () => {
  const MockCourseIcon = () => <div data-testid="course-icon" />;
  MockCourseIcon.displayName = 'MockCourseIcon';
  return MockCourseIcon;
});

describe('LearnTopicCard', () => {
  const mockTopic: Topic = {
    id: 'test-topic',
    name: 'JavaScript',
    slug: 'javascript',
    challenges: [],
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('displays the correct topic name for different topics', () => {
    const testCases = [
      {
        name: 'JavaScript',
        expectedDisplay: 'JavaScript',
      },
      {
        name: 'Python',
        expectedDisplay: 'Python',
      },
      {
        name: 'competitive-programming',
        expectedDisplay: 'competitive programming',
      },
      {
        name: 'data-structures-&-algorithms',
        expectedDisplay: 'data structures & algorithms',
      },
    ];

    testCases.forEach(({ name, expectedDisplay }) => {
      const topic = { ...mockTopic, name };
      const { unmount } = render(<LearnTopicCard topic={topic} />);

      expect(
        screen.getByText(new RegExp(expectedDisplay, 'i'))
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: new RegExp(expectedDisplay, 'i') })
      ).toBeInTheDocument();

      unmount();
    });
  });

  it('navigates to correct path when clicked', () => {
    render(<LearnTopicCard topic={mockTopic} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRouter.push).toHaveBeenCalledWith('/learn/javascript');
  });

  it('handles special routes correctly', () => {
    const testCases = [
      {
        name: 'competitive-programming',
        expectedPath: '/competitive-programming',
      },
      {
        name: 'data-structures-&-algorithms',
        expectedPath: '/learn/data-structures',
      },
      {
        name: 'some-other-topic',
        expectedPath: '/learn/some-other-topic',
      },
    ];

    testCases.forEach(({ name, expectedPath }) => {
      mockRouter.push.mockClear();
      const topic = { ...mockTopic, name };
      render(<LearnTopicCard topic={topic} />);
      const card = screen.getByRole('button', {
        name: new RegExp(`Learn ${name}`, 'i'),
      });
      fireEvent.click(card);
      expect(mockRouter.push).toHaveBeenCalledWith(expectedPath);
    });
  });

  it('calls onTopicClick when provided instead of default navigation', () => {
    const mockOnClick = jest.fn();
    render(<LearnTopicCard topic={mockTopic} onTopicClick={mockOnClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockTopic);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(<LearnTopicCard topic={mockTopic} />);
    const card = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockRouter.push).toHaveBeenCalledWith('/learn/javascript');

    // Test Space key
    mockRouter.push.mockClear();
    fireEvent.keyDown(card, { key: ' ' });
    expect(mockRouter.push).toHaveBeenCalledWith('/learn/javascript');
  });

  it('handles undefined or null difficulty', () => {
    const topicWithoutDifficulty = { ...mockTopic, difficulty: undefined };
    render(<LearnTopicCard topic={topicWithoutDifficulty} />);

    // Should render without errors
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });
});
