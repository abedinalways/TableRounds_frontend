'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import FollowersFollowingModal from './FollowersFollowingModal';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { WelcomeBannerSkeleton } from './WelcomeBannerSkeleton';

export const WelcomeBanner = () => {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'follower' | 'following'>(
    'follower',
  );

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
        stagger: 0.12, // each word follows 120 ms after the previous
      },
    );
  }, [user?.name]); // re-run once the name arrives

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

  // Split "Welcome," and the name into separate animatable words
  const words = ['Welcome,', ...(user?.name ?? '').split(' ')];

  return (
    <>
      <div className="px-4 pt-2 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope]">
        <div className="md:flex items-center justify-evenly py-4 relative z-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full border-4 border-[#B79E6B] w-fit">
              <Image
                src={avatar}
                width={160}
                height={160}
                alt=""
                className="rounded-full object-cover aspect-square"
                unoptimized
              />
            </div>
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

              <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
                <button
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <span className="md:text-lg text-xs font-semibold">
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
                  <span className="md:text-lg text-xs font-semibold">
                    {user?.followings} Followers
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col items-center">
            <p className="text-[16px] font-medium">{formattedDate}</p>
            <Image
              src="/images/dashboard/main_dashboard/tr.png"
              width={138}
              height={138}
              alt="doctor"
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
