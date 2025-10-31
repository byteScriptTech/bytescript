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
    const interactiveCard = screen.getByTestId('feature-card-interactive');
    const problemSolvingCard = screen.getByTestId(
      'feature-card-problem-solving'
    );
    const communityCard = screen.getByTestId(
      'feature-card-community-collaboration'
    );

    expect(interactiveCard).toBeInTheDocument();
    expect(problemSolvingCard).toBeInTheDocument();
    expect(communityCard).toBeInTheDocument();

    // Verify card headings
    expect(interactiveCard).toHaveTextContent('Interactive Coding Challenges');
    expect(problemSolvingCard).toHaveTextContent('Adaptive Problem-Solving');
    expect(communityCard).toHaveTextContent('Community Collaboration');

    // Verify card descriptions
    expect(interactiveCard).toHaveTextContent(
      'Dive into byte‑sized exercises tailored to your level. Share your solutions, get community driven feedback, and learn together one challenge at a time.'
    );
    expect(problemSolvingCard).toHaveTextContent(
      'Tackle complex problems with adaptive learning paths, designed to challenge and improve your analytical abilities.'
    );
    expect(communityCard).toHaveTextContent(
      'Join a vibrant community of learners and experts, collaborate on projects, and share your knowledge.'
    );
  });

  it('renders get started button with correct styling', () => {
    const button = screen.getByRole('button', { name: /get started/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#00BFA6]', 'hover:bg-[#00A38C]');

    // Test button click
    button.click();
    expect(mockHandleExploreByteScriptClick).toHaveBeenCalled();
  });
});
