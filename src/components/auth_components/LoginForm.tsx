'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) return;

    await onLogin?.(formData);
  };

  const isDisabled = isLoading || !formData.email || !formData.password;

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
            className="input-bg md:w-[644px] md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 rounded-xl outline-none w-fit transition-all duration-300 focus:ring-2 focus:ring-[#B79E6B]/70 focus:shadow-[0_0_0_4px_rgba(183,158,107,0.18)] disabled:opacity-70"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-8 flex justify-center">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Password <span className="text-red-600">*</span>
          </label>

          <div className="relative md:w-[644px] w-full group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              disabled={isLoading}
              className="w-full input-bg md:h-[61px] text-white placeholder:text-white/60 px-4 py-3 pr-14 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-[#B79E6B]/70 focus:shadow-[0_0_0_4px_rgba(183,158,107,0.18)] disabled:opacity-70"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-110 active:scale-90"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span
                className={`relative flex items-center justify-center w-[24px] h-[24px] transition-all duration-300 ${
                  showPassword ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                }`}
              >
                <Eye
                  size={22}
                  className={`absolute transition-all duration-300 ${
                    showPassword
                      ? 'opacity-0 scale-50 rotate-90'
                      : 'opacity-100 scale-100 rotate-0'
                  }`}
                />

                <EyeOff
                  size={22}
                  className={`absolute transition-all duration-300 ${
                    showPassword
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-50 -rotate-90'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="md:flex items-center justify-center gap-4 space-y-2 md:space-y-0">
        {/* Login */}
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-[#B79E6B] text-white text-[16px] hover:bg-[#a08c5f] rounded-xl cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed md:w-[126px] w-full h-[54px] font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Forgot Password */}
        <button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="md:w-[225px] w-full h-[54px] bg-white text-[16px] text-[#b79e6b] font-medium rounded-md hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
        >
          Forgot Your Password?
        </button>
      </div>
    </form>
  );
}
