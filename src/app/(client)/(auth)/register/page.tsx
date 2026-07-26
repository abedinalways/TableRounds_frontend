'use client';

import { RegisterPayload, useRegisterNewUserMutation } from '@/app/redux/api/registerApi';
import SignUpForm from '@/components/auth_components/SignUpForm';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const [registerUser, { isLoading }] = useRegisterNewUserMutation();

  const handleRegister = async (data: RegisterPayload) => {
    try {
      const res = await registerUser(data).unwrap();

      toast.success(
        res?.message || 'Registration successful! Check your email.',
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.data?.message || 'Something went wrong during registration.';
      toast.error('Registration failed', { description: message });
    }
  };

  return (
    <div className="bg-card mt-25 ">
      <div className="relative">
        <Image
          src="/images/auth/logo.png"
          alt=""
          width={486}
          height={486}
          className="hidden md:block absolute -top-14 left-5"
        />
      </div>

      <div className="text-center px-4 py-6 text-black font-[manrope]">
        <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold">
          Create your TableRounds profile
        </h3>
        <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto">
          Join a verified network of surgeons and trainees. We manually review
          every account to keep the community authentic and professional.
        </p>
      </div>

      <SignUpForm onSubmit={handleRegister} isLoading={isLoading} />

      {/* Login Link */}
      <div className="text-center pb-10">
        <p className="text-[#4B5563] text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#B79E6B] font-semibold hover:text-[#a08c5f] transition-colors underline underline-offset-2"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
