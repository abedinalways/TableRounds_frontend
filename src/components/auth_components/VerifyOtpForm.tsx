'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (otp: string) => void;
  isLoading: boolean;
}

export default function VerifyOtpForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ otp: string }>({ mode: 'onTouched' });

  return (
    <form
      onSubmit={handleSubmit(data => onSubmit(data.otp))}
      className="md:w-[1132px] w-full rounded-xl md:px-16 md:py-16 py-10 shadow-xl background relative overflow-hidden z-10 mx-2 md:mx-0"
    >
      <div className="mb-6 flex justify-center">
        <div className="w-full md:w-[644px]">
          <label className="block text-white text-sm font-medium mb-2">
            OTP Code <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            maxLength={6}
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

      <div className="flex items-center justify-center mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#B79E6B] text-white text-[16px] hover:bg-[#a08c5f] rounded-[8px] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed w-[220px] h-[54px] font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>
    </form>
  );
}
