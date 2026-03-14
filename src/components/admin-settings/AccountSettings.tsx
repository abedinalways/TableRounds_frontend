'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      email: profile?.email || '',
    },
  });

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
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#4444441A]">
      <h2 className="font-bold text-[16px] md:text-[24px] text-[#0f172b] mb-4">
        Account Settings
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            disabled
            defaultValue={profile?.email}
            {...register('email')}
            className=" text-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Current Password</Label>
          <Input
            type="password"
            {...register('currentPassword', { required: true })}
            className="bg-[#f9f9f5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>New Password</Label>
          <Input
            type="password"
            {...register('newPassword', { required: true })}
            className="bg-[#f9f9f5]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            {...register('confirmPassword', { required: true })}
            className="bg-[#f9f9f5]"
          />
        </div>

        <Button type="submit" className="bg-[#01503B] w-fit cursor-pointer">
          Update Password
        </Button>
      </form>
    </div>
  );
}
