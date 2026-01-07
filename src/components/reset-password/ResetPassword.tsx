'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@/components/auth_components/ResetPasswordForm';


const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);

    try {
     

      toast.success('Password Reset Successful!', {
        description: 'You can now login with your new password.',
      });

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err) {
      toast.error('Failed to reset password', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      {/* Watermark Logo */}
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none opacity-10"
      />

      {/* Header */}
      <div className="text-center mb-8 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E] leading-[110%]">
          Reset Password
        </h3>
        <p className="text-sm md:text-[18px] text-[#4B5563] mt-2 leading-[160%]">
          Set a new password for{' '}
          <span className="font-semibold text-[#01281E]">{email}</span>
        </p>
      </div>

      {/* Reset Password Form */}
      <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
    </div>
  );
};

export default ResetPassword;
