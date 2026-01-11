'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountSettings() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');

  const { register, handleSubmit, reset, getValues } = useForm<FormData>({
    defaultValues: {
      email: 'jordan@gmail.com',
    },
  });

  // STEP 1: Request OTP
  const onSubmit = async (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'PASSWORD_CHANGE',
          currentPassword: data.currentPassword,
        }),
      });

      if (!res.ok) throw new Error();

      setPendingPassword(data.newPassword);
      setShowOtpModal(true);
      toast.success('OTP sent to your email');
    } catch {
      toast.error('Failed to send OTP');
    }
  };

  // STEP 2: Verify OTP & Update Password
  const verifyOtp = async () => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          newPassword: pendingPassword,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success('Password updated securely');
      setShowOtpModal(false);
      setOtp('');
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      toast.error('Invalid or expired OTP');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-[#4444441A]">
        <h2 className="font-bold text-[16px] md:text-[24px] text-[#0f172b] mb-4">
          Account Settings
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input disabled {...register('email')} className="bg-[#f9f9f5]" />
          </div>

          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              {...register('currentPassword', { required: true })}
              placeholder="Enter current password"
              className="bg-[#f9f9f5]"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <Label>New Password</Label>
            <Input
              type="password"
              {...register('newPassword', { required: true })}
              placeholder="New password"
              className="bg-[#f9f9f5]"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              {...register('confirmPassword', { required: true })}
              placeholder="Confirm new password"
              className="bg-[#f9f9f5]"
            />
          </div>

          <Button type="submit" className="bg-[#01503B] w-fit cursor-pointer">
            Update Password (2FA)
          </Button>
        </form>
      </div>

      {/* OTP MODAL */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter the 6-digit code sent to your email
            </p>

            <Input
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              placeholder="123456"
            />

            <Button
              onClick={verifyOtp}
              disabled={otp.length !== 6}
              className="w-full bg-[#01503B]"
            >
              Verify & Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
