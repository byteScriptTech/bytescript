import { render, screen } from '@testing-library/react';

import { ProblemCard, type ProblemCardProps } from './ProblemCard';

describe('ProblemCard', () => {
  const defaultProps: ProblemCardProps = {
    id: 'test-problem-1',
    title: 'Test Problem',
    description: 'This is a test problem description',
    difficulty: 'Medium' as const,
    tags: ['Array', 'Sorting', 'Two Pointers'],
  };

  it('renders problem title and description', () => {
    render(<ProblemCard {...defaultProps} />);

    expect(screen.getByText('Test Problem')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test problem description')
    ).toBeInTheDocument();
  });

  it('displays the correct difficulty badge', () => {
    render(<ProblemCard {...defaultProps} difficulty="Easy" />);

    const badge = screen.getByTestId('problem-difficulty');
    expect(badge).toHaveTextContent('Easy');
  });

  it('shows up to 3 tags and a +n indicator if more exist', () => {
    render(
      <ProblemCard {...defaultProps} tags={['Tag1', 'Tag2', 'Tag3', 'Tag4']} />
    );

    const tags = screen.getAllByTestId('problem-tag');
    expect(tags).toHaveLength(3);
    expect(screen.getByTestId('problem-tag-more')).toHaveTextContent('+1');
  });

  it('links to the correct problem page', () => {
    render(<ProblemCard {...defaultProps} />);

    const link = screen.getByTestId('problem-title-link');
    expect(link).toHaveAttribute(
      'href',
      '/competitive-programming/problems/test-problem-1'
    );
  });

  it('shows solve button with correct link', () => {
    render(<ProblemCard {...defaultProps} />);

    const button = screen.getByTestId('solve-button');
    expect(button).toHaveTextContent('Solve Challenge');
    expect(button.closest('a')).toHaveAttribute(
      'href',
      '/competitive-programming/problems/test-problem-1'
    );
  });
});
