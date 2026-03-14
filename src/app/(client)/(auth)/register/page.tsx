'use client';

import { useRegisterNewUserMutation } from '@/app/redux/api/registerApi';
import SignUpForm from '@/components/auth_components/SignUpForm';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';


export default function RegisterPage() {
  const [registerUser, { isLoading }] = useRegisterNewUserMutation();

  const handleRegister = async (data: any) => {
    try {
      const res = await registerUser(data).unwrap();

      toast.success(
        res?.message || 'Registration successful! Check your email.',
      );
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
          className="absolute -top-14 left-5"
        />
      </div>

      <div className="text-center py-6 text-black font-[manrope]">
        <h3 className="text-xl md:text-3xl lg:text-5xl font-bold">
          Create your TableRounds profile
        </h3>
        <p className="text-sm md:text-md text-gray-600 mt-4">
          Join a verified network of surgeons and trainees. We manually review
          every <br />
          account to keep the community authentic and professional.
        </p>
      </div>

      <SignUpForm onSubmit={handleRegister} isLoading={isLoading} />
    </div>
  );
}
