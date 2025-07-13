import { render, screen, fireEvent } from '@testing-library/react';

import { ActionButtons } from './ActionButtons';

describe('ActionButtons', () => {
  const mockOnCarryOn = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders resume learning button', () => {
    render(
      <ActionButtons onCarryOn={mockOnCarryOn} lastVisitedTopic="basics" />
    );
    expect(
      screen.getByRole('button', { name: /resume learning/i })
    ).toBeInTheDocument();
  });

  it('calls onCarryOn when button is clicked', () => {
    render(
      <ActionButtons onCarryOn={mockOnCarryOn} lastVisitedTopic="basics" />
    );
    const button = screen.getByRole('button', { name: /resume learning/i });
    fireEvent.click(button);
    expect(mockOnCarryOn).toHaveBeenCalled();
  });

  it('displays last visited topic correctly', () => {
    render(
      <ActionButtons onCarryOn={mockOnCarryOn} lastVisitedTopic="basics" />
    );
    expect(
      screen.getByText('Continue with your last topic: basics')
    ).toBeInTheDocument();
  });

  it('shows "Select a topic" when no last visited topic', () => {
    render(<ActionButtons onCarryOn={mockOnCarryOn} lastVisitedTopic={null} />);
    expect(
      screen.getByText('Continue with your last topic: Select a topic')
    ).toBeInTheDocument();
  });
});
