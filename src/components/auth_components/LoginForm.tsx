'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin?: (data: LoginFormData) => void;
  onSignup?: () => void;
}

export default function LoginForm({ onLogin, onSignup }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onLogin?.(formData);
  };

  return (
    <div className="z-40 p-4 md:p-8 font-[manrope]">
      <div className="max-w-lg mx-auto bg-gradient-to-r from-[#0d5e43] to-[#12a87c] rounded-md p-8 shadow-lg">
        {/* EMAIL */}
        <div className="mb-6">
          <Label className="text-white text-sm font-medium">
            Email (Institutional Preferred){' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className="mt-2 bg-[#1C765E] border-none text-white placeholder:text-[#F9FAFB7D]"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <Label className="text-white text-sm font-medium">
            Create Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            className="mt-2 bg-[#1C765E] border-none text-white placeholder:text-[#F9FAFB7D]"
          />
        </div>

        {/* BUTTONS */}
        <div className="md:flex space-y-4 md:space-y-0 items-center justify-center gap-4 mt-4">
          <Button
            onClick={onSignup}
            className="bg-[#B79E6B] text-white hover:bg-[#a08c5f] rounded-[8px] px-[32px] py-[12px]"
          >
            Create Account
          </Button>

          <Button
            onClick={handleSubmit}
            variant="outline"
            className="bg-white text-green-700 hover:bg-white rounded-[8px] px-[32px] py-[12px]"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
