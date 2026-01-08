'use client';

import Image from 'next/image';
import { useState } from 'react';

import { UserProfile } from '@/types/profile';
import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import { FaXTwitter } from 'react-icons/fa6';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import FollowersFollowingModal from '../my-profile/FollowersFollowingModal';
import Link from 'next/link';



interface ProfileHeaderProps {
  user: UserProfile;
}

const followersData = [
  {
    id: '1',
    name: 'John Doe',
    username: 'john_doe',
    avatar: '/images/settings/img01.png',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    username: 'sarah_smith',
    avatar: '/images/settings/img01.png',
  },
];

const followingData = [
  {
    id: '1',
    name: 'Alex Carter',
    username: 'alex_carter',
    avatar: '/images/settings/img01.png',
  },
];

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers'
  );

  return (
    <>
      <div className="bg-white w-full rounded-2xl p-6 font-[manrope]">
        <div className=" flex flex-col md:flex-row gap-6 font-[manrope]">
          <div>
            <Image
              src={user.avatar}
              alt="Profile image"
              width={213}
              height={255}
              className="rounded-sm"
            />
          </div>

          <div className="flex-1 space-y-3">
            <h2 className="text-[28px] text-[#0f172b] font-semibold">
              {user.name}
            </h2>
            <p className="text-[18px] text-[#047857]  ">{user.title}</p>

            <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280] ">
              <h4 className="flex items-center gap-2">
                <LocationIcon />
                {user.location}{' '}
              </h4>
              <h4 className="flex items-center gap-2">
                <BagIcon />
                {user.jobArea}{' '}
              </h4>
              <h4 className="flex items-center gap-2">
                <CalendarIconForProfile />
                Joined {user.joiningDate}{' '}
              </h4>
            </div>

            <p className="text-sm md:text-[18px] leading-[160%]">
              {user.details}
            </p>

            {/* ✅ Clickable Followers / Following (no design change) */}
            <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
              <button
                type="button"
                onClick={() => {
                  setModalType('followers');
                  setModalOpen(true);
                }}
                className="flex flex-col cursor-pointer"
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
                className="flex flex-col cursor-pointer"
              >
                <strong>{user.following}</strong>
                <span className="font-normal text-[18px] text-[#62748e]">
                  Following
                </span>
              </button>
            </div>

            <div className="flex gap-3 mb-[24px]">
              <Link href="/dashboard/messages">
                <button className="bg-[#01503b] px-[24px] py-[14px] text-center text-[#fff] rounded-[8px] cursor-pointer">
                  Message
                </button>
              </Link>
              <button
                onClick={() => setIsFollowing(prev => !prev)}
                className={`px-[24px] py-[14px] text-center rounded-[8px] cursor-pointer border
    ${
      isFollowing
        ? 'bg-[#01503b] text-white border-[#01503b]'
        : 'bg-white text-[#01503b] border-[#01503b]'
    }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        <hr />

        {/* social media */}
        <div className="flex flex-wrap items-center gap-4 md:gap-[24px]  text-[#01281e] mt-[24px]">
          <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>
          <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center  cursor-pointer">
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
      </div>

      {/* ✅ MODAL RENDER */}
      <FollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        data={modalType === 'followers' ? followersData : followingData}
      />
    </>
  );
}
