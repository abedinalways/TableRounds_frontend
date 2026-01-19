'use client';
import { useEffect, useRef, useState } from 'react';
import { getUser } from '@/lib/auth';
import Image from 'next/image';
import gsap from 'gsap';
import FollowersFollowingModal from './FollowersFollowingModal';
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
export const WelcomeBanner = () => {
  const [userName] = useState(() => getUser()?.name ?? '');
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers'
  );

  
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, [userName]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="px-4 pt-2 d:pt-0 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope]">
        <div className="md:flex  items-center justify-evenly py-4 relative z-10">
          <div className="flex flex-col justify-between items-center  gap-4">
            <div className="rounded-full border-4 border-[#B79E6B] bg-red-400 w-fit">
              <Image
                src="/images/dashboard/doctor.png"
                width={182}
                height={182}
                alt="doctor"
                className=""
              />
            </div>
          </div>
          {/* introduce */}

          <div className=" flex items-center justify-center">
            <div className="flex flex-col  gap-2 justify-center">
              <h2 ref={textRef} className="md:text-4xl text-lg font-bold">
                Welcome, Dr. {userName}!
              </h2>

              <p className="md:text-[18px] text-xs">
                Stay up to date on your current progress
              </p>

              <div className="flex md:space-x-4 space-x-2  text-[#b79e6b]">
                <button
                  type="button"
                  onClick={() => {
                    setModalType('followers');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <span className="md:text-lg text-xs font-semibold cursor-pointer">
                    333 Followers
                  </span>
                </button>
                <span className="flex items-center opacity-60">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <span className="md:text-lg text-xs font-semibold cursor-pointer">
                    666 Following
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Images */}
          <div className="flex flex-col items-center relative">
            <p className="text-[16px] font-medium">{formattedDate}</p>
            <div className="">
              <Image
                src="/images/dashboard/main_dashboard/tr.png"
                width={138}
                height={138}
                alt="doctor"
                className=" "
              />
            </div>
          </div>
        </div>
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
};
