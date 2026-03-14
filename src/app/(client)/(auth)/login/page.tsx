'use client';

import LoginForm from '@/components/auth_components/LoginForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLoginMutation } from '@/app/redux/api/authApi';
import { useAppDispatch } from '@/app/redux/hook';
import { setAuth } from '@/app/redux/authSlice';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('');

    try {
      const result = await login(data).unwrap();

      toast.success('Login successful');

     
      dispatch(
        setAuth({
          token: result.authorization.access_token,
          role: result.type, 
        }),
      );

      
      if (result.type === 'admin') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/user');
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      const message =
        error?.data?.message || 'Invalid email or password. Please try again.';

      setError(message);
      toast.error('Login failed', { description: message });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none"
      />

      <div className="text-center mb-8 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E]">
          Login
        </h3>
        <p className="text-[#4B5563] mt-2">
          Sign in to your TableRounds account
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500 font-medium z-10">{error}</p>
      )}

      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
    </div>
  );
}
