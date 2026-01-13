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
      <div className="flex  items-start justify-between relative z-10">
        <div className="flex flex-col justify-between gap-18 md:p-8">
          <div>
            <p className="text-[16px] font-medium">{formattedDate}</p>
          </div>
          <div className="md:flex items-center gap-2">
            <div>
              <Image
                src="/images/dashboard/main_dashboard/doctor.png"
                width={90}
                height={90}
                alt="doctor"
                className="md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
              />
            </div>
            <div className="space-y-2">
              <h2 ref={textRef} className="md:text-2xl text-lg font-bold">
                Welcome, Dr. {userName}!
              </h2>

              <p className="md:text-sm text-xs">
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
        </div>

        {/* Images */}
        <div className="flex items-center relative">
          <Image
            src="/images/dashboard/main_dashboard/tr.png"
            width={138}
            height={138}
            alt="doctor"
            className="absolute md:top-14 top-8 md:left-30 right-10 opacity-80 "
          />
          <Image
            src="/images/dashboard/main_dashboard/img01.png"
            width={257}
            height={213}
            alt=""
            className="absolute md:top-10 top-30 md:right-20 right-3 "
          />
          <Image
            src="/images/dashboard/main_dashboard/doc.png"
            width={176}
            height={245}
            alt="doctor"
            className="md:mr-22 mr-32 relative top-9 md:mt-0 z-30 md:w-full"
          />
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
