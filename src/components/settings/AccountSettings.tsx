'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import { useMeQuery, useUpdateUserMutation } from '@/app/redux/api/authApi';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountSettings() {
  const { data: profile } = useMeQuery();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [emailNotify, setEmailNotify] = useState(false);
  const [webNotify, setWebNotify] = useState(true);

  const newPassword = watch('newPassword');

  // ✅ Populate email when profile loads
  useEffect(() => {
    if (profile?.email) {
      reset({
        email: profile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('password', data.currentPassword);
      formData.append('new_password', data.newPassword);

      await updateUser(formData).unwrap();

      toast.success('Password updated successfully');

      reset({
        email: profile?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Update failed');
    }
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
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
            placeholder="Set your password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />

          {errors.currentPassword && (
            <p className="text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-[8px]">
          <Label>New Password</Label>

          <Input
            type="password"
            {...register('newPassword', {
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            placeholder="Set your new password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />

          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[8px]">
          <Label>Confirm New Password</Label>

          <Input
            type="password"
            {...register('confirmPassword', {
              validate: value =>
                value === newPassword || 'Passwords do not match',
            })}
            placeholder="Re-type your new password"
            className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
          />

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Email Notifications */}
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

        {/* Website Notifications */}
        <div className="flex items-center justify-between ">
          <Label>Website Notifications</Label>
          <Switch
            className="cursor-pointer"
            checked={webNotify}
            onCheckedChange={v => {
              setWebNotify(v);
              toast.success(
                `Website notification ${v ? 'enabled' : 'disabled'}`,
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

        {/* Submit */}
        <Button type="submit" className="bg-[#01503B] w-fit cursor-pointer">
          Update Password
        </Button>
      </form>
    </div>
  );
}
