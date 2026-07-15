'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';
import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import { FaUserDoctor, FaXTwitter } from 'react-icons/fa6';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import {
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  StethoscopeIcon,
  MessageCircle,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { useCreateConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
import ProfileFollowersFollowingModal from './FollowersFollowingModal';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: UserProfile;
  id: string;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [createConversation] = useCreateConversationMutation();
  const [toggleFollow] = useToggleFollowMutation();

  const { data: myFollowingData } = useGetConnectionsQuery({
    type: 'following',
  });

  const isFollowingFromServer =
    myFollowingData?.data?.some(u => u.id === user.id) ?? false;

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(isFollowingFromServer);
  }, [isFollowingFromServer]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const hasSocialLink = (url?: string | null) => {
    return Boolean(url && url.trim() !== '');
  };

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      await toggleFollow({ userId, isFollowing }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  const handleProfileFollowToggle = async () => {
    const prev = isFollowing;
    setIsFollowing(!prev);
    try {
      await toggleFollow({ userId: user.id, isFollowing: prev }).unwrap();
    } catch (error) {
      setIsFollowing(prev);
      console.error('Follow toggle failed', error);
    }
  };

  const handleMessageClick = async () => {
    setIsMessageLoading(true);
    try {
      const res = await createConversation({
        participant_id: user.id,
      }).unwrap();
      window.location.href = `/dashboard/user/messages/${res.data.id}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Conversation creation failed', err);
      setIsMessageLoading(false);
    }
  };

  const socialLinks = [
    { url: user.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { url: user.instagram, Icon: Instagram, label: 'Instagram' },
    { url: user.facebook, Icon: Facebook, label: 'Facebook' },
    { url: user.twitter, Icon: FaXTwitter, label: 'Twitter' },
  ];

  return (
    <>
      <div
        className={`bg-white w-full rounded-2xl p-6 font-[manrope] shadow-sm hover:shadow-md transition-shadow duration-500 relative overflow-hidden transform transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6 font-[manrope]">
          {/* Avatar */}
          <div className="group relative w-fit mx-auto md:mx-0">
            <div className="overflow-hidden rounded-sm relative">
              <Image
                src={user.avatar ?? '/images/settings/img01.png'}
                alt="Profile image"
                width={213}
                height={255}
                className="rounded-sm object-cover aspect-square transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-sm" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <h2 className="text-[28px] text-[#0f172b] font-semibold animate-[fadeInUp_0.5s_ease-out]">
              {user.name}{' '}
              <span className="text-green-900 font-semibold uppercase">
                {user.credentials}
              </span>
            </h2>

            <div className="flex items-center justify-start gap-6 flex-wrap">
              <h4 className="flex items-center text-sm md:text-[16px]  text-[#01503b] gap-1 transition-colors duration-300 hover:text-[#01503b]">
                <Image src="/images/icon03.png" width={20} height={20} alt="" />
                {user.specialty}
              </h4>
              <p className="text-sm md:text-[16px] leading-[160%] text-[#01503b] flex items-center gap-1">
                <Image src="/images/icon01.png" width={20} height={20} alt="" />
                {user.title}
              </p>
            </div>

            <div className="md:flex md:gap-6 block py-2 md:py-0 items-center text-xs md:text-[16px] font-light text-[#6b7280]">
              <h4 className="flex items-center gap-1 transition-transform duration-300 hover:translate-x-0.5">
                <BagIcon />
                {user.jobArea}
              </h4>
              <h4 className="flex items-center gap-1 transition-colors duration-300 hover:text-[#01503b]">
                <LocationIcon />
                {user.state}, {user.country}
              </h4>

              <h4 className="flex items-center gap-1 transition-colors duration-300 hover:text-[#01503b]">
                <CalendarIconForProfile />
                <span className="font-semibold">Joined</span>{' '}
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h4>
            </div>

            <p className="text-sm md:text-[18px] leading-[160%]">{user.bio}</p>

            {/* Stats */}
            <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
              <button
                type="button"
                onClick={() => {
                  setModalType('followers');
                  setModalOpen(true);
                }}
                className="flex flex-col cursor-pointer group transition-transform duration-300 hover:-translate-y-0.5"
              >
                <strong className="transition-colors duration-300 group-hover:text-[#01503b]">
                  {user.following}
                </strong>
                <span className="font-normal text-[18px] text-[#62748e] relative">
                  Followers
                  <span className="absolute left-1/2 -bottom-0.5 h-[2px] w-0 bg-[#01503b] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalType('following');
                  setModalOpen(true);
                }}
                className="flex flex-col cursor-pointer group transition-transform duration-300 hover:-translate-y-0.5"
              >
                <strong className="transition-colors duration-300 group-hover:text-[#01503b]">
                  {user.followers}
                </strong>
                <span className="font-normal text-[18px] text-[#62748e] relative">
                  Following
                  <span className="absolute left-1/2 -bottom-0.5 h-[2px] w-0 bg-[#01503b] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-[24px] mt-2">
              <button
                onClick={handleMessageClick}
                disabled={isMessageLoading}
                className="flex items-center justify-center gap-2 bg-[#01503b] px-[24px] py-[14px] text-center text-white rounded-[8px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 min-w-[120px] hover:shadow-lg hover:shadow-[#01503b]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                {isMessageLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>redirecting...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </>
                )}
              </button>

              <button
                onClick={handleProfileFollowToggle}
                className={`flex items-center justify-center gap-2 px-[24px] py-[14px] text-center rounded-[8px] cursor-pointer border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                  isFollowing
                    ? 'bg-[#01503b] text-white border-[#01503b] hover:shadow-lg hover:shadow-[#01503b]/25'
                    : 'bg-white text-[#01503b] border-[#01503b] hover:bg-[#01503b]/5'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={18} />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <hr className="opacity-60" />

        <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
          <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>

          {socialLinks.map(
            ({ url, Icon, label }) =>
              hasSocialLink(url) && (
                <Link
                  key={label}
                  href={normalizeUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer transition-all duration-300 hover:bg-[#01503b] hover:text-white hover:scale-110 hover:-translate-y-0.5 active:scale-95">
                    <Icon size={24} />
                  </button>
                </Link>
              ),
          )}
        </div>
      </div>

      <ProfileFollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        profileUserId={user.id}
        onFollowToggle={handleFollowToggle}
      />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
