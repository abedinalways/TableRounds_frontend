'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface Props {
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  isLoading: boolean;
}

export default function ResetPasswordForm({ onSubmit, isLoading }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    mode: 'onTouched',
  });

  const passwordValue = watch('password');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:w-[1132px] w-full rounded-xl md:px-16 md:py-16 py-10 shadow-xl
      background relative overflow-hidden z-10 mx-2 md:mx-0"
    >
      {/* New Password */}
      <div className="mb-6 flex justify-center">
        <div className="w-full md:w-[644px]">
          <label className="block text-white text-sm font-medium mb-2">
            New Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                validate: value =>
                  /[A-Z]/.test(value) ||
                  'Password must include at least one uppercase letter',
              })}
              className="w-full input-bg md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-[8px] outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-8 flex justify-center">
        <div className="w-full md:w-[644px]">
          <label className="block text-white text-sm font-medium mb-2">
            Confirm Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              disabled={isLoading}
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: value =>
                  value === passwordValue || 'Passwords do not match',
              })}
              className="w-full input-bg md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-[8px] outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-2">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#B79E6B] text-white text-[16px] hover:bg-[#a08c5f] rounded-[8px] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed w-[220px] h-[54px] font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </div>
    </form>
  );
}
