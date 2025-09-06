import { render, screen } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';

import ProblemDetail from '.';

// Mock the Markdown component
jest.mock('@/components/common/Markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => (
    <div data-testid="markdown">{children}</div>
  ),
}));

describe('ProblemDetail', () => {
  const mockProblem = {
    id: 'test-problem',
    title: 'Test Problem',
    difficulty: 'Medium' as const,
    category: 'Algorithms',
    description: 'This is a test problem description.',
    examples: [
      {
        input: 'Input: 1',
        output: 'Output: 1',
        explanation: '1 is equal to 1',
      },
    ],
    constraints: ['1 <= n <= 100'],
    starterCode: 'function solve() {}',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  it('renders the problem title', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByText('Test Problem')).toBeInTheDocument();
  });

  it('displays the problem difficulty', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('displays the problem category', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
  });

  it('renders the problem description using Markdown', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
  });

  it('displays the example input and output', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByText('Example 1')).toBeInTheDocument();
    expect(screen.getByText('Input:')).toBeInTheDocument();
    expect(screen.getByText('Output:')).toBeInTheDocument();
    expect(screen.getByText('1 is equal to 1')).toBeInTheDocument();
  });

  it('displays the problem constraints', () => {
    render(<ProblemDetail problem={mockProblem} />);
    expect(screen.getByText('Constraints')).toBeInTheDocument();
    expect(screen.getByText('1 <= n <= 100')).toBeInTheDocument();
  });
});
