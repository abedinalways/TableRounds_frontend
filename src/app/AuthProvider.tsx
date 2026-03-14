'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hook';
import { setAuth, Role } from '@/app/redux/authSlice';
import Cookies from 'js-cookie';

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
