'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaXTwitter } from 'react-icons/fa6';

import { Facebook, Instagram, Linkedin } from 'lucide-react';

import AttachImageIcon from '../reusable/icons/AttachImageIcon';

import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import { Card } from '../ui/card';
import FollowersFollowingModal from '../my-profile/FollowersFollowingModal';
import { Switch } from '../ui/CustomSwitch';



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
  practiceName: string;
};

interface ProfileHeaderProps {
  user: UserProfile;
}

const followersData = [
  {
    id: '1',
    name: 'John Doe',
    username: 'john_doe',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '3',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '4',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '5',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '6',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
];

const followingData = [
  {
    id: '1',
    name: 'Alex Carter',
    username: 'alex_carter',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '3',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '4',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '5',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
  {
    id: '6',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/dashboard/message/doctor.png',
  },
];

export default function ManageProfile({ user }: ProfileHeaderProps) {
  const [preview, setPreview] = useState('/images/settings/img01.png');
  const [isPublic, setIsPublic] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers'
  );

  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      credentials: '',
      year: '',
      practiceName: '',
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
        <Card className="bg-white w-full rounded-2xl md:p-6 p-2 mb-10">
          <div className="md:flex justify-between items-start mb-8 gap-4">
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

            <div className="flex-1 space-y-3">
              <h2 className="text-[28px] text-[#0f172b] font-semibold">
                {user.name}
              </h2>
              <p className="text-[18px] text-[#047857]">{user.title}</p>

              <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280] ">
                <h4 className="flex items-center gap-2">
                  <LocationIcon />
                  {user.location}
                </h4>
                <h4 className="md:flex items-center gap-2">
                  <BagIcon />
                  {user.jobArea}
                </h4>
                <h4 className="flex items-center gap-2">
                  <CalendarIconForProfile />
                  Joined {user.joiningDate}
                </h4>
              </div>

              <p className="text-sm md:text-[18px] leading-[160%]">
                {user.details}
              </p>

              {/* Followers / Following (Clickable) */}
              <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setModalType('followers');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.followers}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Followers
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.following}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Following
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={handleSubmit(onSubmit)}
                className="bg-[#01503B] cursor-pointer w-[142px] h-[54px] rounded-[8px] text-white md:text-[16px] text-xs"
              >
                Save & Change
              </button>

              <div className="flex md:items-center gap-2 bg-white px-6 py-4 rounded-2xl">
                <span
                  className={`${
                    isPublic ? '' : ''
                  } md:text-lg text-md`}
                >
                  Public
                </span>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="cursor-pointer"
                />
                <span
                  className={`${
                    !isPublic ? '' : ''
                  } md:text-lg text-md`}
                >
                  Private
                </span>
              </div>
            </div>
          </div>

          <hr />

          {/* social media */}
          <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
            <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>
            <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
              <Linkedin size="24" />
            </button>
            <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
              <Instagram size="24" />
            </button>
            <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
              <Facebook size="24" />
            </button>
            <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
              <FaXTwitter size="24" />
            </button>
          </div>
        </Card>

        {/* Contact Details */}
        <h3 className="mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%] font-bold">
          Contact Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-[#4b5563]">
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Name <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('name')}
              placeholder="Jordan Nguyen"
              readOnly
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

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Credentials <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('credentials')}
              placeholder="i.e. DDS, DMD, MD, Student"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">LinkedIn</Label>
            <Input
              placeholder="Personal Link"
              {...register('linkedin')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Location <span className="text-red-600">*</span>
            </Label>
            <Input
              placeholder="Enter your city, state, and country"
              {...register('location')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Twitter/X</Label>
            <Input
              placeholder="Personal Link"
              {...register('twitter')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Year in Training/Practice <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('year')}
              placeholder="Student, PGY, or Attending"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Facebook</Label>
            <Input
              placeholder="Personal Link"
              {...register('facebook')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Current Practice <span className="text-red-600">*</span>
            </Label>
            <Input
              placeholder="Name of your residency, hospital, or private practice"
              {...register('practiceName')}
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
          Descriptions
        </Label>
        <Textarea
          rows={4}
          {...register('description')}
          placeholder="Write something about yourself..."
          className="mt-4 bg-[#f9f9f5]"
        />
      </div>

      {/* ✅ MODAL RENDER (THIS IS WHAT YOU MISSED) */}
      <FollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        data={modalType === 'followers' ? followersData : followingData}
      />
    </>
  );
}
