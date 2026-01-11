'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import Btn from '../reusable/button/Btn';
import AttachImageIcon from '../reusable/icons/AttachImageIcon';

type ProfileFormData = {
  name: string;
  credentials: string;
  location: string;
  year: string;
  joiningDate: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  description: string;
};

export default function ManageProfile() {
  const [preview, setPreview] = useState('/images/dashboard/Admin/admin.png');

  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      credentials: '',
      year: '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    toast.success('Profile updated successfully');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm font-[manrope]">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 gap-4">
          <div className="relative w-[213px]">
            <Image
              src={preview}
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

        {/* Contact Details */}
        <h3 className=" mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%] font-bold">
          Contact Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-[#4b5563]">
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Name</Label>
            <Input
              {...register('name')}
              placeholder="Enter Your Name"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Instagram</Label>
            <Input
              placeholder="Personal Link"
              {...register('instagram')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          {/* <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Credentials</Label>
            <Input
              {...register('credentials')}
              placeholder="i.e. DDS, DMD, MD, Student"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div> */}

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">LinkedIn</Label>
            <Input
              placeholder="Personal Link"
              {...register('linkedin')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          {/* <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Location</Label>
            <Input
              placeholder="Enter your city, state, and country"
              {...register('location')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div> */}

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Twitter/X</Label>
            <Input
              placeholder="Personal Link"
              {...register('twitter')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          {/* <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Year in Training/Practice</Label>
            <Input
              {...register('year')}
              placeholder="PGY vs. Attending Surgeon"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div> */}

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Facebook</Label>
            <Input
              placeholder="Personal Link"
              {...register('facebook')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Joining Date</Label>
            <Input
              type="date"
              {...register('joiningDate')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm font-[manrope] mb-6">
        <Label className="font-bold mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%]">
          Description
        </Label>
        <Textarea
          rows={4}
          {...register('description')}
          placeholder="Write something about yourself..."
          className="mt-4 bg-[#f9f9f5]"
        />
      </div>
    </>
  );
}
