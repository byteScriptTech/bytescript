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
  state: { forward: null as boolean | null },
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

  it('renders logo, dashboard link, practice link and learn link', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByRole('link', { name: /practice/i })).toHaveAttribute(
      'href',
      '/practice'
    );
    expect(screen.getByRole('link', { name: /learn/i })).toHaveAttribute(
      'href',
      '/learn'
    );
  });

  it('disables Back when history.length ≤ 1', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[3];
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
    const backButton = buttons[3];
    expect(backButton).toBeEnabled();
  });

  it('calls window.history.back() on Back click', () => {
    // Mock window.history.back
    const backSpy = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    mockHistory.length = 2;
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[3]);
    expect(window.history.back).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  it('disables Forward when history.state.forward is falsy', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const forwardButton = buttons[4];
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
    const forwardButton = buttons[4];
    expect(forwardButton).toBeEnabled();
  });

  it('calls window.history.forward() on Forward click', () => {
    // Mock window.history.forward
    const forwardSpy = jest
      .spyOn(window.history, 'forward')
      .mockImplementation(() => {});

    // Mock history.state.forward to be true
    const originalHistoryState = window.history.state;
    Object.defineProperty(window, 'history', {
      value: {
        ...window.history,
        state: { forward: true },
      },
    });

    render(
      <AuthContext.Provider
        value={{ ...authContextValue, currentUser: { uid: '123' } }}
      >
        <Navbar />
      </AuthContext.Provider>
    );

    const buttons = screen.getAllByRole('button');
    // Forward button is now at index 4 (after Dashboard, Learn, Practice, Back)
    fireEvent.click(buttons[4]);
    expect(window.history.forward).toHaveBeenCalled();

    // Restore original implementation
    forwardSpy.mockRestore();
    Object.defineProperty(window, 'history', {
      value: {
        ...window.history,
        state: originalHistoryState,
      },
    });
  });

  it('does not render UserDropDown when there is no current user', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Should only have 4 buttons: Dashboard, Learn, Practice, Back, Forward
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    // Verify the buttons are in the expected order
    expect(buttons[0]).toHaveTextContent(/dashboard/i);
    expect(buttons[1]).toHaveTextContent(/learn/i);
    expect(buttons[2]).toHaveTextContent(/practice/i);
    expect(buttons[3]).toHaveAttribute('aria-label', 'Go back');
    expect(buttons[4]).toHaveAttribute('aria-label', 'Go forward');

    // User button should not be in the document
    expect(screen.queryByLabelText('user')).not.toBeInTheDocument();
  });

  it('renders UserDropDown when there is a current user', () => {
    render(
      <AuthContext.Provider
        value={{ ...authContextValue, currentUser: { uid: '123' } }}
      >
        <Navbar />
      </AuthContext.Provider>
    );

    // Should have 6 buttons now: Dashboard, Learn, Practice, Back, Forward, User
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);

    // The last button should be the user button
    const userButton = buttons[5];
    expect(userButton).toHaveAttribute('aria-label', 'user');
  });

  it('calls signOut and navigates to /login on Sign Out', async () => {
    // Set up a mock current user for the sign out test
    authContextValue.currentUser = { uid: '123', displayName: 'Test User' };

    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Click the user button to open the dropdown
    const userButton = screen.getByLabelText('user');
    fireEvent.click(userButton);

    // Click the sign out button
    const signOutButton = screen.getByRole('menuitem', { name: /sign out/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({});
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
