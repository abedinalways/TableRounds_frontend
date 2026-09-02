'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hook';
import { setAuth, Role, setUser, clearUser } from '@/app/redux/authSlice';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useMeQuery } from './redux/api/authApi';
import { setSessionExpiredHandler } from '@/lib/socket';

function useInitiateAuthState() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.auth?.token);
  const isAppLoading = token === false;

  useEffect(() => {
    const [savedToken, savedRole] = ['token', 'role'].map(key =>
      Cookies.get(key),
    );

    dispatch(
      setAuth({
        token: savedToken || null,
        role: (savedRole as Role) || null,
      }),
    );
  }, [dispatch]);

  // Global session-expiry handler: when the socket detects an expired JWT
  // (pre-connect check or failed handshake), log the user out and send
  // them to the login page instead of retrying with the stale token.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      dispatch(clearUser());
      toast.error('Your session has expired. Please log in again.');
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href = '/login';
      }
    });

    return () => setSessionExpiredHandler(null);
  }, [dispatch]);

  const { data, isSuccess } = useMeQuery(undefined, {
    skip: !token,
  });


  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  return { isAppLoading };
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAppLoading } = useInitiateAuthState();

  if (isAppLoading) return null;

  return <>{children}</>;
}
