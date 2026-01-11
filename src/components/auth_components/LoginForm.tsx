'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin?: (data: LoginFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export default function LoginForm({
  onLogin,
  isLoading = false,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    await onLogin?.(formData);
  };

  const isDisabled = isLoading || !formData.email || !formData.password;
  const router = useRouter();
  return (
    <form
      onSubmit={handleSubmit}
      className="md:w-[1132px] px-40 rounded-xl md:px-16 md:py-16 py-4 shadow-xl 
      background relative overflow-hidden z-10 mx-2 md:mx-0 font-[manrope]"
    >
      {/* Input Field */}
      <div className="mb-6 flex justify-center">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            disabled={isLoading}
            className=" input-bg md:w-[644px] md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-[8px]  outline-none w-fit"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-8 flex justify-center">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            disabled={isLoading}
            className="w-full input-bg md:w-[644px] md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-[8px]  outline-none "
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="md:flex items-center justify-center gap-4 space-y-2 md:space-y-0">
        {/* Login */}
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-[#B79E6B] text-white text-[16px] hover:bg-[#a08c5f] rounded-[8px] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed md:w-[126px] w-full h-[54px] font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Login...
            </>
          ) : (
            'Login'
          )}
        </button>

        {/* Forgot Password */}
        <button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="md:w-[225px] w-full h-[54px] bg-white text-[16px] text-[#b79e6b] font-medium  rounded-md hover:bg-white/90 transition cursor-pointer"
        >
          Forgot Your Password?
        </button>
      </div>
    </form>
  );
}
