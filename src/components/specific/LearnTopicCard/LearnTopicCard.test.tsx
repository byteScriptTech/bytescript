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
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders topic name and icon', () => {
    render(<LearnTopicCard topic={mockTopic} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Start learning')).toBeInTheDocument();
    expect(screen.getByTestId('course-icon')).toBeInTheDocument();
  });

  it('navigates to language page when clicked', () => {
    render(<LearnTopicCard topic={mockTopic} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/lang?name=javascript&id=test-topic'
    );
  });

  it('navigates to competitive programming when topic is competitive-programming', () => {
    const competitiveTopic: Topic = {
      ...mockTopic,
      name: 'competitive-programming',
    };

    render(<LearnTopicCard topic={competitiveTopic} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockRouter.push).toHaveBeenCalledWith('/competitive-programming');
  });

  it('navigates to data structures when topic is data-structures-&-algorithms', () => {
    const dsTopic: Topic = {
      ...mockTopic,
      name: 'data-structures-&-algorithms',
    };

    render(<LearnTopicCard topic={dsTopic} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockRouter.push).toHaveBeenCalledWith('/data-structures');
  });

  it('calls onTopicClick when provided', () => {
    const onTopicClick = jest.fn();

    render(<LearnTopicCard topic={mockTopic} onTopicClick={onTopicClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onTopicClick).toHaveBeenCalledWith(mockTopic);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation (Enter and Space)', () => {
    render(<LearnTopicCard topic={mockTopic} />);

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    expect(mockRouter.push).toHaveBeenCalledTimes(2);
  });
});
