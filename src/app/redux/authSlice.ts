import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export type Role = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  followers: number;
  current_practice: string;
  training_practice: string;
  speciality: string;
  followings: number;
  instagram: string;
  linkedin: string;
  statistics: [];
  country: string;
  state: string;
  credentials: string;
  twitter_x: string;
  facebook: string;
  bio: string;
  join_date: string;
  created_at: string;
  type: 'admin' | 'user';
}
export interface AuthorizationResponse {
  success: boolean;
  message: string;
  authorization: {
    type: string;
    access_token: string;
    refresh_token: string;
  };
  type: 'user' | 'admin';
}
export interface Credential {
  token: string | null | false;
  role?: Role;
}
export interface AuthState {
  user: AuthUser | null;
  auth: Credential;
}
const initialState: AuthState = {
  user: null as AuthUser | null,
  auth: { token: false },
};

function getJwtExpiry(token: string): Date | undefined {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return undefined;
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr =
      typeof atob !== 'undefined'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    if (payload?.exp && typeof payload.exp === 'number') {
      return new Date(payload.exp * 1000);
    }
  } catch {
    return undefined;
  }
  return undefined;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAuth(state, action: PayloadAction<Credential>) {
      state.auth = action.payload;

      const expires =
        state.auth.token ? getJwtExpiry(state.auth.token) : undefined;

      if (state.auth.token) {
        Cookies.set('token', state.auth.token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
          expires,
        });
      }

      if (state.auth.role) {
        Cookies.set('role', state.auth.role, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
          expires,
        });
      }
    },
    clearUser(state) {
      state.user = null;
      state.auth = { token: false };
      Cookies.remove('token', { path: '/' });
      Cookies.remove('role', { path: '/' });
    },
  },
});

export const { setUser, clearUser, setAuth } = authSlice.actions;
export default authSlice.reducer;
