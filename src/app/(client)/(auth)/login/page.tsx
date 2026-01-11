'use client';

import LoginForm from '@/components/auth_components/LoginForm';
import { login } from '@/lib/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('');
    setIsLoading(true);

    try {
      const user = await login(data.email, data.password);

      toast.success('Welcome back! Redirecting to dashboard...', {
        description: `Login as ${user.name}`,
      });

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Invalid email or password. Please try again.';

      setError(message);
      toast.error('Login failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen  flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      {/* Watermark Logo */}
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none"
      />

      {/* Header */}
      <div className="text-center mb-8 mt-20 md:mt-0 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E] leading-[110%]">
          Login
        </h3>
        <p className="text-sm md:text-[18px] text-[#4B5563] mt-2 leading-[160%]">
          Sign in to your TableRounds account
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="mb-4 text-sm text-red-500 font-medium z-10">{error}</p>
      )}

      {/* Form */}
      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
    </div>
  );
}
