import { fireEvent, render, screen } from '@testing-library/react';

import { useAuth } from '@/context/AuthContext';

import Authentication from '.';

jest.mock('../../../context/AuthContext', () => ({ useAuth: jest.fn() }));

describe('Authentication', () => {
  const mockGoogleSignIn = jest.fn();
  const mockGithubSignIn = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signInWithGoogle: mockGoogleSignIn,
      signInWithGithub: mockGithubSignIn,
    });
  });

  test("Should render the 'Authentication' component", () => {
    render(<Authentication />);

    expect(screen.getByText('Welcome to biteScript')).toBeInTheDocument();
    expect(
      screen.getByText("Let's kickstart your journey to becoming a programmer!")
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Login with Google' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Login with GitHub' })
    ).toBeInTheDocument();
  });

  test('Should run the signInWithGoogle function on button click', () => {
    render(<Authentication />);
    const googleButton = screen.getByRole('button', {
      name: 'Login with Google',
    });
    fireEvent.click(googleButton);

    expect(mockGoogleSignIn).toHaveBeenCalled();
  });
  test('Should run the signInWithGithub function on button click', () => {
    render(<Authentication />);
    const githubButton = screen.getByRole('button', {
      name: 'Login with GitHub',
    });
    fireEvent.click(githubButton);

    expect(mockGithubSignIn).toHaveBeenCalled();
  });
});
