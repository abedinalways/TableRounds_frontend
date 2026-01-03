'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useState } from 'react';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountSettings() {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      email: 'jordan@gmail.com',
      currentPassword: 'bfedf1368724',
    },
  });

  const [emailNotify, setEmailNotify] = useState(false);
  const [webNotify, setWebNotify] = useState(true);

  const onSubmit = (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Password updated successfully');
    reset({
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleDelete = () => {
    toast.error('Account deleted');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#4444441A] ">
      <h2 className="font-bold text-[16px] md:text-[24px] text-[#0f172b] mb-4">
        Account Settings
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="flex flex-col gap-[8px]">
          <Label>Email</Label>
          <Input
            disabled
            {...register('email')}
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />
        </div>

        {/* Current Password */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between items-center">
            <Label>Current Password</Label>
            <button
              type="button"
              onClick={() => toast.info('Redirect to change password')}
              className="text-sm text-[#01503b] hover:underline"
            >
              Change Password?
            </button>
          </div>
          <Input
            type="password"
            {...register('currentPassword')}
            placeholder="Set your password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-[8px]">
          <Label>New Password</Label>
          <Input
            type="password"
            {...register('newPassword')}
            placeholder="Set your new password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[8px]">
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            {...register('confirmPassword')}
            placeholder="Re-type your new password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch
            checked={emailNotify}
            className="cursor-pointer"
            onCheckedChange={v => {
              setEmailNotify(v);
              toast.success(`Email notification ${v ? 'enabled' : 'disabled'}`);
            }}
          />
        </div>

        <div className="flex items-center justify-between ">
          <Label>Website Notifications</Label>
          <Switch
            className="cursor-pointer"
            checked={webNotify}
            onCheckedChange={v => {
              setWebNotify(v);
              toast.success(
                `Website notification ${v ? 'enabled' : 'disabled'}`
              );
            }}
          />
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between ">
          <Label className="">Delete Account</Label>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="px-[24px] py-[12px] rounded-[8px] bg-[#01503B]"
          >
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
