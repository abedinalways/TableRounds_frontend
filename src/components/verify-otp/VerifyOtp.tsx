//

'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useResetPasswordMutation,
  useResendVerificationEmailMutation,
} from '@/app/redux/api/authApi';

type FormValues = {
  otp: string;
  password: string;
  confirmPassword: string;
};

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [resetPassword] = useResetPasswordMutation();
  const [resendEmail] = useResendVerificationEmailMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      await resetPassword({
        email,
        token: data.otp,
        password: data.password,
      }).unwrap();

      toast.success('Password Reset Successful');

      router.push('/login');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      await resendEmail({ email }).unwrap();

      toast.success('Verification email sent');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 font-[manrope]">
      {/* Watermark */}
      <Image
        src="/images/TR.png"
        alt="Logo watermark"
        width={500}
        height={500}
        className="absolute top-30 left-20 pointer-events-none opacity-10"
      />

      {/* Header */}
      <div className="text-center mb-8 z-10">
        <h3 className="text-3xl md:text-[48px] font-bold text-[#01281E]">
          Reset Password
        </h3>

        <p className="text-sm md:text-[18px] text-[#4B5563] mt-2">
          Enter OTP and create new password for
          <span className="font-semibold text-[#01281E] ml-1">{email}</span>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-[1132px] w-full rounded-xl md:px-16 md:py-16 py-10 shadow-xl background relative overflow-hidden z-10 mx-2 md:mx-0"
      >
        {/* OTP */}
        <div className="mb-6 flex justify-center">
          <div className="w-full md:w-[644px]">
            <label className="block text-white text-sm font-medium mb-2">
              OTP Code <span className="text-red-600">*</span>
            </label>

            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6 digit OTP"
              disabled={isLoading}
              {...register('otp', {
                required: 'OTP is required',
                minLength: { value: 6, message: 'OTP must be 6 digits' },
              })}
              className="w-full input-bg md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-[8px] outline-none text-center tracking-[0.4em]"
            />

            {errors.otp && (
              <p className="text-red-400 text-sm mt-2">{errors.otp.message}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="mb-6 flex justify-center">
          <div className="w-full md:w-[644px]">
            <label className="block text-white text-sm font-medium mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              className="w-full input-bg md:h-[61px] text-white px-4 py-3 rounded-[8px] outline-none"
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 flex justify-center">
          <div className="w-full md:w-[644px]">
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              disabled={isLoading}
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: value =>
                  value === password || 'Passwords do not match',
              })}
              className="w-full input-bg md:h-[61px] text-white px-4 py-3 rounded-[8px] outline-none"
            />

            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#B79E6B] text-white text-[16px] hover:bg-[#a08c5f] rounded-[8px] transition disabled:opacity-50 w-[220px] h-[54px] font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>

        {/* Resend Email */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="text-sm text-[#B79E6B] hover:underline disabled:opacity-50 cursor-pointer"
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;