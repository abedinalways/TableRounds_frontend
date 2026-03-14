import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export type Role = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  followers: string;
  followings: string;
  instagram: string;
  linkedin: string;
  twitter_x: string;
  facebook: string;
  bio: string;
  join_date: string;
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAuth(state, action: PayloadAction<Credential>) {
      state.auth = action.payload;

      console.log('Setting auth:', state.auth);
      if (state.auth.token) {
        Cookies.set('token', state.auth.token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
        });
      }

      if (state.auth.role) {
        Cookies.set('role', state.auth.role, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
        });
      }
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, setAuth } = authSlice.actions;
export default authSlice.reducer;
