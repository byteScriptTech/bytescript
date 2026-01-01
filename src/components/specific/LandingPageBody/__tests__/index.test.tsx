import { render, screen } from '@testing-library/react';
import React from 'react';

import LandingPageBody from '../index';

describe('LandingPageBody', () => {
  const mockHandleExploreByteScriptClick = jest.fn();

  beforeEach(() => {
    render(
      <LandingPageBody
        handleExploreByteScriptClick={mockHandleExploreByteScriptClick}
      />
    );
  });

  it('displays main heading and description', () => {
    const heading = screen.getByText(/Master Programming Through Practice/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-4xl', 'font-black');

    const description = screen.getByText(
      /byteScript is an interactive platform/i
    );
    expect(description).toBeInTheDocument();
  });

  it('renders three feature cards', () => {
    // Get all feature card containers by their test IDs
    const competitiveCard = screen.getByTestId('feature-card-competitive');
    const problemsCard = screen.getByTestId('feature-card-problems');
    const dsaCard = screen.getByTestId('feature-card-dsa');

    expect(competitiveCard).toBeInTheDocument();
    expect(problemsCard).toBeInTheDocument();
    expect(dsaCard).toBeInTheDocument();

    // Verify card headings
    expect(competitiveCard).toHaveTextContent('Competitive Programming');
    expect(problemsCard).toHaveTextContent('Problem Solving');
    expect(dsaCard).toHaveTextContent('Data Structures');

    // Verify card descriptions
    expect(competitiveCard).toHaveTextContent(
      'Practice curated patterns and templates for contest problems with explanations and variations.'
    );
    expect(problemsCard).toHaveTextContent(
      'Large catalog of practice problems with difficulty tags, solutions, and testcases.'
    );
    expect(dsaCard).toHaveTextContent(
      'Learn core data structures with interactive visualizations and step-through animations.'
    );
  });

  it('renders start learning button with correct styling', () => {
    const button = screen.getByRole('button', { name: /start learning now/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'hover:bg-primary/90');

    // Verify the button is wrapped in a link to /learn
    const link = button.closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/learn');
  });
});
