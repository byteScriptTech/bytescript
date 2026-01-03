import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'user';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: any[];
  phoneNumber: string | null;
  providerId: string | null;
  role?: UserRole;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastLogin?: string | null;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  refreshToken: string;
}

interface AuthState {
  currentUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  loading: true,
  isAdmin: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.currentUser = action.payload;
      state.isAdmin = action.payload?.role === 'admin';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, setLoading, clearUser } = authSlice.actions;
