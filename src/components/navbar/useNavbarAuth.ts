// useNavbarAuth.ts
'use client';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { useMeQuery, useLogoutMutation } from '@/app/redux/api/authApi';
import { clearUser } from '@/app/redux/authSlice';
import { toast } from 'sonner';

export function useNavbarAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.auth.token);
  const { data: currentUser } = useMeQuery(undefined, { skip: !token });
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
    } catch {
      // Backend logout request failed (e.g. expired session or offline)
    } finally {
      dispatch(clearUser());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return { token, currentUser, isLoggingOut, handleLogout };
}

export type NavbarAuthToken = ReturnType<typeof useNavbarAuth>['token'];
