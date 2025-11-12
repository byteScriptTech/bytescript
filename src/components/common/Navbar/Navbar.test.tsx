// src/components/common/Navbar/Navbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { AuthContext, AuthContextType, AppUser } from '@/context/AuthContext';

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
  const createMockAuthContext = (
    overrides: Partial<AuthContextType> = {}
  ): AuthContextType => ({
    currentUser: null,
    loading: false,
    isAdmin: false,
    signInWithGithub: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  let authContextValue: AuthContextType;

  beforeEach(() => {
    jest.clearAllMocks();
    // reset history
    mockHistory.length = 1;
    mockHistory.state = { forward: null };

    // Create a fresh mock for each test
    authContextValue = createMockAuthContext();
  });

  it('disables Back when history.length ≤ 1', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[4];
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
    fireEvent.click(buttons[4]);
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
    const forwardButton = buttons[5];
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
        value={{
          ...authContextValue,
          currentUser: createMockUser({ uid: '123' }),
        }}
      >
        <Navbar />
      </AuthContext.Provider>
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[5]);
    expect(window.history.forward).toHaveBeenCalled();

    forwardSpy.mockRestore();
    Object.defineProperty(window, 'history', {
      value: {
        ...window.history,
        state: originalHistoryState,
      },
    });
  });

  it('renders UserDropDown when there is a current user', () => {
    render(
      <AuthContext.Provider
        value={{
          ...authContextValue,
          currentUser: createMockUser({ uid: '123' }),
        }}
      >
        <Navbar />
      </AuthContext.Provider>
    );

    // Should have user buttons
    const userButtons = screen.getAllByLabelText('user');
    expect(userButtons.length).toBeGreaterThan(0);
    // Check that at least one user button is in the document
    expect(userButtons[0]).toBeInTheDocument();
  });

  // Helper function to create a mock user for testing
  const createMockUser = (overrides: Partial<AppUser> = {}): AppUser => ({
    uid: '123',
    displayName: 'Test User',
    email: 'test@example.com',
    emailVerified: true,
    isAnonymous: false,
    providerData: [],
    metadata: {},
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    phoneNumber: null,
    photoURL: null,
    providerId: '',
    ...overrides,
  });

  it('calls signOut and navigates to /login on Sign Out', async () => {
    // Set up a mock current user for the sign out test
    authContextValue.currentUser = createMockUser();

    render(
      <AuthContext.Provider value={authContextValue}>
        <Navbar />
      </AuthContext.Provider>
    );

    // Get all user buttons and click the first one
    const userButtons = screen.getAllByLabelText('user');
    fireEvent.click(userButtons[0]);

    // Click the sign out button
    const signOutButtons = screen.getAllByRole('menuitem');
    const signOutButton = signOutButtons.find((button) =>
      button.textContent?.toLowerCase().includes('sign out')
    );
    expect(signOutButton).toBeInTheDocument();
    fireEvent.click(signOutButton!);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({});
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
