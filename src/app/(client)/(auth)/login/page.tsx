'use client'
import LoginForm from '@/components/auth_components/LoginForm'
import { login } from '@/lib/auth';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'

export default function LoginPage() {

    const router = useRouter();
    const [error, setError] = useState('');

    const handleLogin =  (data: { email: string; password: string }) => {
      setError('');
      try {
        const user =login(data.email, data.password);
        // redirect based on role
        router.push('/dashboard');
      } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'string') {
      setError(err);
    } else {
      setError('An unexpected error occurred. Please try again.');
    }

    console.error('Login error:', err);
  };
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
