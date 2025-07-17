// src/components/common/Navbar/Navbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AuthContext, AuthContextType } from '@/context/AuthContext';

// ——— Mock Logo component ———
jest.mock('@/components/common/Logo', () => {
  const Logo = () => <div>Logo</div>;
  Logo.displayName = 'Logo';
  return Logo;
});

// ——— Mock signOut from firebase/auth ———
const mockSignOut = jest.fn();
jest.mock('firebase/auth', () => ({
  signOut: (...args: any[]) => mockSignOut(...args),
  getAuth: () => ({}),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));

// ——— Mock the firebase config (so Navbar can import `auth`) ———
jest.mock('@/firebase/config', () => ({
  auth: {},
}));

// ——— Mock next/navigation useRouter ———
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

// ——— Mock UserDropDown inline ———
jest.mock('@/components/specific/UserDropDown', () => {
  const UserDropDown = (props: any) => (
    <div>
      <button aria-label="user">User</button>
      <button role="menuitem" onClick={props.handleSignOut}>
        Sign Out
      </button>
    </div>
  );
  UserDropDown.displayName = 'UserDropDown';
  return UserDropDown;
});

// ——— Mock window.history API ———
const mockHistory = {
  back: jest.fn(),
  forward: jest.fn(),
  length: 1,
  state: { forward: null },
};
Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true,
});

// ——— Now import the component under test ———
import Navbar from './index';

describe('Navbar', () => {
  let authContextValue: AuthContextType;

  beforeEach(() => {
    jest.clearAllMocks();
    // reset history
    mockHistory.length = 1;
    mockHistory.state = { forward: null };

    authContextValue = {
      currentUser: null,
      signInWithGoogle: jest.fn(),
      signInWithGithub: jest.fn(),
      signOut: jest.fn(),
    };
  });

  it('renders logo and dashboard link', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to dashboard/i })
    ).toHaveAttribute('href', '/dashboard');
  });

  it('disables Back when history.length ≤ 1', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[1];
    expect(backButton).toBeDisabled();
  });

  it('enables Back when history.length > 1', () => {
    mockHistory.length = 2;
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[1];
    expect(backButton).toBeEnabled();
  });

  it('calls window.history.back() on Back click', () => {
    mockHistory.length = 2;
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(window.history.back).toHaveBeenCalled();
  });

  it('disables Forward when history.state.forward is falsy', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const forwardButton = buttons[2];
    expect(forwardButton).toBeDisabled();
  });

  it('enables Forward when history.state.forward is true', () => {
    mockHistory.state = { forward: true };
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const forwardButton = buttons[2];
    expect(forwardButton).toBeEnabled();
  });

  it('calls window.history.forward() on Forward click', () => {
    mockHistory.state = { forward: true };
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(window.history.forward).toHaveBeenCalled();
  });

  it('calls signOut and navigates to /login on Sign Out', async () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const userButton = buttons[3];
    fireEvent.click(userButton);

    const signOutButton = screen.getByRole('menuitem', { name: /sign out/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({});
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
