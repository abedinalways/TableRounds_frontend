'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UserProfile } from '@/types/profile';
import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import { FaXTwitter } from 'react-icons/fa6';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import ProfileFollowersFollowingModal from './FollowersFollowingModal';
import { getFullCountryName } from '@/lib/country';



interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );

  const [createConversation] = useCreateAdminConversationMutation();
  const [toggleFollow] = useToggleFollowMutation();
  
  const hasSocialLink = (url?: string | null) => {
    return Boolean(url && url.trim() !== '');
  };

  const normalizeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  // Needed by ProfileFollowersFollowingModal for follow toggles inside the list
  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      await toggleFollow({ userId, isFollowing }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  const handleMessageClick = async () => {
    try {
      const res = await createConversation({
        participant_id: user.id,
      }).unwrap();
      router.push(`/dashboard/admin/support-message/${res.data.id}`);
    } catch (err: any) {
      console.error('Conversation creation failed', err);
    }
  };

  // Normalize join date
  const normalizeDate = user.created_at
    ? new Date(user.created_at).toISOString().split('T')[0]
    : '—';

  return (
    <>
      <div className="bg-white w-full rounded-2xl p-6 font-[manrope]">
        <div className="flex flex-col md:flex-row gap-6 font-[manrope]">
          <div>
            <Image
              src={user.avatar ?? '/images/settings/img01.png'}
              alt="Profile image"
              width={213}
              height={255}
              className="rounded-sm aspect-square object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 space-y-3">
            <h2 className="text-[28px] text-[#0f172b] font-semibold">
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

            {/* Followers / Following — opens real modal */}
            <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
              <button
                type="button"
                onClick={() => {
                  setModalType('followers');
                  setModalOpen(true);
                }}
                className="flex flex-col cursor-pointer hover:opacity-80 transition"
              >
                <strong>{user.following}</strong>
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
                <strong>{user.followers}</strong>
                <span className="font-normal text-[18px] text-[#62748e]">
                  Following
                </span>
              </button>
            </div>

            {/* ✅ Message only — no Follow/Unfollow button for admin */}
            <div className="flex gap-3 mb-[24px]">
              <button
                onClick={handleMessageClick}
                className="bg-[#01503b] px-[24px] py-[14px] text-center text-[#fff] rounded-[8px] cursor-pointer"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        <hr />

        {/* Social links — wired to real URLs */}
        <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
          <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>

          {hasSocialLink(user.linkedin) && (
            <Link
              href={normalizeUrl(user.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Linkedin size={24} />
              </button>
            </Link>
          )}

          {hasSocialLink(user.instagram) && (
            <Link
              href={normalizeUrl(user.instagram)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Instagram size={24} />
              </button>
            </Link>
          )}

          {hasSocialLink(user.facebook) && (
            <Link
              href={normalizeUrl(user.facebook)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Facebook size={24} />
              </button>
            </Link>
          )}

          {hasSocialLink(user.twitter) && (
            <Link
              href={normalizeUrl(user.twitter)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <FaXTwitter size={24} />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Same modal as user dashboard — fetches real followers/following via profileUserId */}
      <ProfileFollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        profileUserId={user.id}
        onFollowToggle={handleFollowToggle}
      />
    </>
  );
}
