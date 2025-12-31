'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth_components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);

    try {
      // ✅ Call your backend API here
      // await forgotPassword(email)

      toast.success('OTP sent successfully!', {
        description: 'Check your email for the verification code.',
      });

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch (err) {
      toast.error('Failed to send OTP', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none opacity-10"
      />

      <div className="text-center mb-8 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E] leading-[110%]">
          Forgot Password
        </h3>
        <p className="text-sm md:text-[18px] text-[#4B5563] mt-2 leading-[160%]">
          Enter your email to receive a verification code
        </p>
      </div>

      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />
    </div>
  );
}
