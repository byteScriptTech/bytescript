import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'user';

export interface AppUser extends User {
  role?: UserRole;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastLogin?: string | null;
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
