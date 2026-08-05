'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import FollowersFollowingModal from './FollowersFollowingModal';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { WelcomeBannerSkeleton } from './WelcomeBannerSkeleton';
import { useGetProfileQuery } from '@/app/redux/api/profileApi';
import LocationIcon from '../ui/LocationIcon';
import { Disc, DiscIcon, DotIcon } from 'lucide-react';
import { FaLocationDot } from 'react-icons/fa6';
import { getFullCountryName } from '@/lib/country';

export const WelcomeBanner = () => {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'follower' | 'following'>(
    'follower',
  );
  const { data: value } = useMeQuery();
  // console.log(value, "----------------------wefwfwfwfwefffffffff")
  const [toggleFollow] = useToggleFollowMutation();
  const { data: connectionsData, isLoading } = useGetConnectionsQuery(
    { type: modalType },
    { skip: !modalOpen },
  );

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      await toggleFollow({ userId, isFollowing }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  const { data: user, isLoading: userLoading } = useMeQuery();

  useEffect(() => {
    const els = wordRefs.current.filter(Boolean);
    if (!els.length) return;

    gsap.fromTo(
      els,
      { opacity: 0, y: 24, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.12,
      },
    );
  }, [user?.name]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (userLoading) return <WelcomeBannerSkeleton />;

  const avatar =
    user?.avatar && user.avatar.startsWith('http')
      ? new URL(user.avatar).href
      : '/images/navbar-logo.png';

  const words = ['Welcome,', ...(user?.name ?? '').split(' ')];

  return (
    <>
      <div className="px-4 pt-2 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope]">
        <div className="md:flex items-center justify-evenly py-4 relative z-10">
          {/* Avatar */}
          <div className="flex  md:items-center items-start gap-4">
            <div className="rounded-full border-4 border-[#B79E6B] w-fit shrink-0">
              <Image
                src={avatar}
                width={160}
                height={160}
                alt=""
                className="rounded-full object-cover aspect-square shrink-0"
                unoptimized
              />
            </div>
            {/* Date */}
            <div className="md:hidden md:items-center">
              <p className="text-[16px] font-medium">{formattedDate}</p>
              <Image
                src="/images/dashboard/main_dashboard/tr.png"
                width={138}
                height={138}
                alt="doctor"
                className="shrink-0"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <div></div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-2">
              {/* ── Animated welcome text ── */}
              <h2 className="md:text-4xl text-lg font-bold flex flex-wrap gap-x-[0.3em]">
                {words.map((word, i) => (
                  <span
                    key={i}
                    ref={el => {
                      wordRefs.current[i] = el;
                    }}
                    style={{ opacity: 0, display: 'inline-block' }}
                  >
                    {word}
                  </span>
                ))}
              </h2>

              <p className="md:text-[18px] text-xs">
                Stay up to date on your current progress
              </p>
              {/* ── Specialty & Training ── */}
              {(user?.specialty || user?.training_practice) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm md:text-base opacity-90">
                  {user?.specialty && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs md:text-sm border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      {user.specialty}
                    </span>
                  )}
                  {user?.training_practice && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs md:text-sm border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {user.training_practice}
                    </span>
                  )}
                </div>
              )}

              {/* ── Meta Info (Location & Joined Date) ── */}
              <div className="flex  gap-5 mt-2 text-xs md:text-sm text-gray-300 ">
                {/* Location */}
                {(user?.country || user?.state) && (
                  <div className="flex items-center gap-2 group">
                    <FaLocationDot className="text-yellow-500 text-sm shrink-0 transition-transform group-hover:scale-110 duration-200" />
                    <span className="font-medium tracking-wide">
                      {[user?.state, getFullCountryName(user?.country)]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}

                {/* Joined Date */}
                {user?.created_at && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="orange"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[11px] md:text-xs">
                      Joined:{' '}
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
                <button
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <span className="md:text-lg text-sm font-semibold">
                    {user?.followers} Following
                  </span>
                </button>
                <span className="opacity-60">|</span>
                <button
                  onClick={() => {
                    setModalType('follower');
                    setModalOpen(true);
                  }}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <span className="md:text-lg text-sm font-semibold">
                    {user?.followings} Followers
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="md:flex  flex-col hidden md:items-center">
            <p className="text-[16px] font-medium">{formattedDate}</p>
            <Image
              src="/images/dashboard/main_dashboard/tr.png"
              width={138}
              height={138}
              alt="doctor"
              className="shrink-0"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      <FollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        data={connectionsData?.data || []}
        loading={isLoading}
        onFollowToggle={handleFollowToggle}
      />
    </>
  );
};
