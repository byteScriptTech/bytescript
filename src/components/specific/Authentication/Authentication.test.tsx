import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useAuth } from '@/context/AuthContext';

import Authentication from '.';

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    signInWithGithub: jest.fn(),
  })),
}));

describe('Authentication Component', () => {
  const mockSignInWithGithub = jest.fn(() => {
    throw new Error('Failed to sign in with GitHub');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signInWithGithub: mockSignInWithGithub,
    });
  });

  test('renders without errors', () => {
    render(<Authentication />);

    // Check logo text
    expect(screen.getByText('bite')).toBeInTheDocument();
    expect(screen.getByText('Script.')).toBeInTheDocument();

    // Check heading
    expect(screen.getByText('Sign in to biteScript')).toBeInTheDocument();

    // Check sign in button
    const signInButton = screen.getByRole('button', {
      name: 'Sign in with GitHub',
    });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveClass('rounded-xl');
    expect(signInButton).toHaveClass('bg-[#283039]');

    // Check GitHub icon
    expect(screen.getByTestId('github-logo')).toBeInTheDocument();
  });

  test('handles GitHub sign in click', async () => {
    render(<Authentication />);

    const signInButton = screen.getByRole('button', {
      name: 'Sign in with GitHub',
    });
    fireEvent.click(signInButton);

    expect(mockSignInWithGithub).toHaveBeenCalledTimes(1);
  });

  test('displays error message when sign in fails', async () => {
    render(<Authentication />);

    // Simulate sign in failure
    await fireEvent.click(
      screen.getByRole('button', { name: 'Sign in with GitHub' })
    );

    // Wait for error message to appear
    await screen.findByText('Failed to sign in with GitHub');
    const errorMessage = screen.getByText('Failed to sign in with GitHub');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
  });

  test('has proper styling for logo text', () => {
    render(<Authentication />);

    // Check logo text colors and sizes
    const biteText = screen.getByText('bite');
    const scriptText = screen.getByText('Script.');

    expect(biteText).toHaveClass('text-md');
    expect(scriptText).toHaveClass('text-[#00BFA6]');
    expect(scriptText).toHaveClass('text-base');
    expect(scriptText).toHaveClass('sm:text-xl');
  });

  test('has proper layout and spacing', () => {
    render(<Authentication />);

    // Check content container layout
    const contentContainer = screen
      .getByText('Sign in to biteScript')
      .closest('div');
    expect(contentContainer).toHaveClass('layout-content-container');
    expect(contentContainer).toHaveClass('flex');
    expect(contentContainer).toHaveClass('flex-col');
    expect(contentContainer).toHaveClass('w-full');
    expect(contentContainer).toHaveClass('max-w-[512px]');
    expect(contentContainer).toHaveClass('py-4');
    expect(contentContainer).toHaveClass('sm:py-5');
    expect(contentContainer).toHaveClass('justify-center');
    expect(contentContainer).toHaveClass('items-center');

    // Check heading alignment
    expect(screen.getByText('Sign in to biteScript')).toHaveClass(
      'text-center'
    );

    // Check logo navigation
    const logoLink = screen.getByText('bite');
    expect(logoLink.closest('a')).toHaveAttribute('href', '/');
  });
});
