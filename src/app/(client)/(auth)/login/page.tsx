'use client'
import LoginForm from '@/components/auth_components/LoginForm'
import { login } from '@/lib/auth';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import { toast } from 'sonner';

export default function LoginPage() {

    const router = useRouter();
    const [error, setError] = useState('');
    // const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (data: { email: string; password: string }) => {
      setError('');
      // setIsLoading(true);
      try {
        const user = await login(data.email, data.password);
        toast.success('Welcome back! Redirecting to dashboard...', {
          description: `Login as ${user.name} || ${user.email}`,
        });
        // redirect based on role
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
        toast.error('Login failed', {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <div className="mt-20 overflow-hidden">
      <div className="relative">
        <Image
          src="/images/auth/logo.png"
          alt=""
          width={486}
          height={486}
          className="absolute -top-14 left-10"
        />
      </div>
      <div className="text-center py-6 text-black font-[roboto]">
        <h3 className="text-xl md:text-3xl lg:text-5xl font-bold">
          Login your TableRounds profile
        </h3>
        <p className="text-sm md:text-md text-gray-600 mt-4">
          Join a verified network of surgeons and trainees. We manually review
          every <br />
          account to keep the community authentic and professional.
        </p>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
