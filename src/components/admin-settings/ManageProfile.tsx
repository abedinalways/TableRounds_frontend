'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AttachImageIcon from '../reusable/icons/AttachImageIcon';

import { useMeQuery, useUpdateUserMutation } from '@/app/redux/api/authApi';

type ProfileFormData = {
  name: string;
  join_date: string;
  instagram: string;
  linkedin: string;
  twitter_x: string;
  facebook: string;
  bio: string;
};

export default function ManageProfile() {
  const { data: profile } = useMeQuery();
  const [updateUser] = useUpdateUserMutation();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<ProfileFormData>();

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name || '',
      instagram: profile.instagram || '',
      linkedin: profile.linkedin || '',
      twitter_x: profile.twitter_x || '',
      facebook: profile.facebook || '',
      bio: profile.bio || '',
      join_date: profile.join_date?.slice(0, 10),
    });
  }, [profile, reset]);

  const preview =
    localPreview ||
    (profile?.avatar
      ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}${profile.avatar}`
      : '/images/dashboard/Admin/admin.png');

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('instagram', data.instagram || '');
      formData.append('linkedin', data.linkedin || '');
      formData.append('twitter_x', data.twitter_x || '');
      formData.append('facebook', data.facebook || '');
      formData.append('bio', data.bio || '');

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await updateUser(formData).unwrap();

      toast.success('Profile updated successfully');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Update failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm font-[manrope]">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div className="relative w-[213px]">
            <Image
              src='/images/dashboard/Admin/admin.png'
              alt="Profile image"
              width={213}
              height={255}
              className="rounded-md object-cover"
            />

            <label className="absolute -bottom-5 -right-3 border-4 border-white bg-[#01503b] p-2 rounded-full md:w-[66px] md:h-[66px] w-[50px] h-[50px]">
              <AttachImageIcon className="max-w-full md:ml-2 md:mt-2 cursor-pointer" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-[#01503B] cursor-pointer md:px-[24px] px-3 py-2 md:py-[14px] rounded-[8px] text-white md:text-[16px] text-xs"
          >
            Save & Change
          </button>
        </div>

        <h3 className="mb-4 text-[#0f172b] md:text-[24px] font-bold">
          Contact Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-[#4b5563]">
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Name</Label>
            <Input {...register('name')} className="bg-[#f9f9f5]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Instagram</Label>
            <Input {...register('instagram')} className="bg-[#f9f9f5]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">LinkedIn</Label>
            <Input {...register('linkedin')} className="bg-[#f9f9f5]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Twitter/X</Label>
            <Input {...register('twitter_x')} className="bg-[#f9f9f5]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Facebook</Label>
            <Input {...register('facebook')} className="bg-[#f9f9f5]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Joining Date</Label>
            <Input
              type="date"
              {...register('join_date')}
              disabled
              className="bg-[#f1f1f1]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm font-[manrope] mb-6">
        <Label className="font-bold mb-4 text-[#0f172b] md:text-[24px]">
          Description
        </Label>
        <Textarea rows={4} {...register('bio')} className="mt-4 bg-[#f9f9f5]" />
      </div>
    </>
  );
}
