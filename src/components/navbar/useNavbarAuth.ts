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
      dispatch(clearUser());
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch {
      toast.error('Failed to logout');
    }
  };

  return { token, currentUser, isLoggingOut, handleLogout };
}

export type NavbarAuthToken = ReturnType<typeof useNavbarAuth>['token'];
