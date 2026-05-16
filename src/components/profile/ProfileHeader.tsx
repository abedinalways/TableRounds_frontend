// 'use client';

// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { UserProfile } from '@/types/profile';
// import LocationIcon from '../ui/LocationIcon';
// import BagIcon from '../reusable/icons/BagIcon';
// import { FaXTwitter } from 'react-icons/fa6';
// import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
// import { Facebook, Instagram, Linkedin } from 'lucide-react';
// import { useCreateConversationMutation } from '@/app/redux/api/chat/chatApi';
// import { useToggleFollowMutation } from '@/app/redux/api/followApi';
// import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
// import ProfileFollowersFollowingModal from './FollowersFollowingModal';
// import Link from 'next/link';

// interface ProfileHeaderProps {
//   user: UserProfile;
//   id: string;
// }

// export default function ProfileHeader({ user }: ProfileHeaderProps) {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<'followers' | 'following'>(
//     'followers',
//   );

//   const [createConversation] = useCreateConversationMutation();
//   const [toggleFollow] = useToggleFollowMutation();

//   // ✅ Fetch logged-in user's following list to check real follow state
//   const { data: myFollowingData } = useGetConnectionsQuery({
//     type: 'following',
//   });

//   const isFollowingFromServer =
//     myFollowingData?.data?.some(u => u.id === user.id) ?? false;

//   // ✅ Initialized from server, synced when server data arrives
//   const [isFollowing, setIsFollowing] = useState(false);

//   useEffect(() => {
//     setIsFollowing(isFollowingFromServer);
//   }, [isFollowingFromServer]);

//   const normalizeUrl = (url?: string) => {
//     if (!url) return '#';
//     if (url.startsWith('http://') || url.startsWith('https://')) return url;
//     return `https://${url}`;
//   };

//   // For follow/unfollow inside the modal list
//   const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
//     try {
//       await toggleFollow({ userId, isFollowing }).unwrap();
//     } catch (error) {
//       console.error('Follow toggle failed', error);
//     }
//   };

//   // For the main Follow button on the profile card
//   const handleProfileFollowToggle = async () => {
//     const prev = isFollowing;
//     setIsFollowing(!prev); // optimistic
//     try {
//       await toggleFollow({ userId: user.id, isFollowing: prev }).unwrap();
//     } catch (error) {
//       setIsFollowing(prev); // rollback
//       console.error('Follow toggle failed', error);
//     }
//   };

//   const handleMessageClick = async () => {
//     try {
//       const res = await createConversation({
//         participant_id: user.id,
//       }).unwrap();
//       window.location.href = `/dashboard/user/messages/${res.data.id}`;
//     } catch (err: any) {
//       console.error('Conversation creation failed', err);
//     }
//   };

//   //normalize date
//   const rawDate = user.created_at;
//   // console.log(rawDate);
//   const date = new Date(rawDate);
//   // console.log(date);
//   const normalizeDate = date.toISOString().split("T")[0];
//   // console.log(normalizeDate);

//   return (
//     <>
//       <div className="bg-white w-full rounded-2xl p-6 font-[manrope]">
//         <div className="flex flex-col md:flex-row gap-6 font-[manrope]">
//           <div>
//             <Image
//               src={user.avatar ?? '/images/settings/img01.png'}
//               alt="Profile image"
//               width={213}
//               height={255}
//               className="rounded-sm object-cover aspect-square"
//               unoptimized
//             />
//           </div>

//           <div className="flex-1 space-y-3">
//             <h2 className="text-[28px] text-[#0f172b] font-semibold">
//               {user.name}{' '}
//               <span className="text-green-900 font-semibold uppercase">
//                 {user.credentials}
//               </span>
//             </h2>

//             <p className="text-[18px] text-[#047857]">{user.title}</p>

//             <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280]">
//               <h4 className="flex items-center gap-2">
//                 <LocationIcon />
//                 {user.address} {user.state}, {user.country}
//               </h4>
//               <h4 className="flex items-center gap-2">
//                 <BagIcon />
//                 {user.jobArea}
//               </h4>
//               <h4 className="flex items-center gap-2">
//                 <CalendarIconForProfile />
//                 <span className='font-semibold'>Joined</span> {normalizeDate}
//               </h4>
//             </div>

//             <p className="text-sm md:text-[18px] leading-[160%]">{user.bio}</p>

//             <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setModalType('followers');
//                   setModalOpen(true);
//                 }}
//                 className="flex flex-col cursor-pointer hover:opacity-80 transition"
//               >
//                 <strong>{user.followers}</strong>
//                 <span className="font-normal text-[18px] text-[#62748e]">
//                   Followers
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setModalType('following');
//                   setModalOpen(true);
//                 }}
//                 className="flex flex-col cursor-pointer hover:opacity-80 transition"
//               >
//                 <strong>{user.following}</strong>
//                 <span className="font-normal text-[18px] text-[#62748e]">
//                   Following
//                 </span>
//               </button>
//             </div>

//             <div className="flex gap-3 mb-[24px]">
//               <button
//                 onClick={handleMessageClick}
//                 className="bg-[#01503b] px-[24px] py-[14px] text-center text-[#fff] rounded-[8px] cursor-pointer"
//               >
//                 Message
//               </button>

//               <button
//                 onClick={handleProfileFollowToggle}
//                 className={`px-[24px] py-[14px] text-center rounded-[8px] cursor-pointer border ${
//                   isFollowing
//                     ? 'bg-[#01503b] text-white border-[#01503b]'
//                     : 'bg-white text-[#01503b] border-[#01503b]'
//                 }`}
//               >
//                 {isFollowing ? 'Unfollow' : 'Follow'}
//               </button>
//             </div>
//           </div>
//         </div>

//         <hr />

//         <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
//           <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>
//           <Link
//             href={normalizeUrl(user.linkedin)}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
//               <Linkedin size={24} />
//             </button>
//           </Link>
//           <Link
//             href={normalizeUrl(user.instagram)}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
//               <Instagram size={24} />
//             </button>
//           </Link>
//           <Link
//             href={normalizeUrl(user.facebook)}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
//               <Facebook size={24} />
//             </button>
//           </Link>
//           <Link
//             href={normalizeUrl(user.twitter)}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
//               <FaXTwitter size={24} />
//             </button>
//           </Link>
//         </div>
//       </div>

//       <ProfileFollowersFollowingModal
//         open={modalOpen}
//         onClose={setModalOpen}
//         type={modalType}
//         profileUserId={user.id}
//         onFollowToggle={handleFollowToggle}
//       />
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';
import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import { FaXTwitter } from 'react-icons/fa6';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import { Facebook, Instagram, Linkedin, Loader2 } from 'lucide-react';
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
  const [isMessageLoading, setIsMessageLoading] = useState(false); // ✅ new

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
    setIsMessageLoading(true); // ✅ start loading
    try {
      const res = await createConversation({
        participant_id: user.id,
      }).unwrap();
      window.location.href = `/dashboard/user/messages/${res.data.id}`;
    } catch (err: any) {
      console.error('Conversation creation failed', err);
      setIsMessageLoading(false); // ✅ stop loading only on error (on success we redirect)
    }
  };

  const rawDate = user.created_at;
  const date = new Date(rawDate);
  const normalizeDate = date.toISOString().split('T')[0];

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
              className="rounded-sm object-cover aspect-square"
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

            <p className="text-[18px] text-[#047857]">{user.title}</p>

            <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280]">
              <h4 className="flex items-center gap-2">
                <LocationIcon />
                {user.address} {user.state}, {user.country}
              </h4>
              <h4 className="flex items-center gap-2">
                <BagIcon />
                {user.jobArea}
              </h4>
              <h4 className="flex items-center gap-2">
                <CalendarIconForProfile />
                <span className="font-semibold">Joined</span> {normalizeDate}
              </h4>
            </div>

            <p className="text-sm md:text-[18px] leading-[160%]">{user.bio}</p>

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

            <div className="flex gap-3 mb-[24px]">
              {/* ✅ Message button with loading state */}
              <button
                onClick={handleMessageClick}
                disabled={isMessageLoading}
                className="flex items-center justify-center gap-2 bg-[#01503b] px-[24px] py-[14px] text-center text-white rounded-[8px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-opacity min-w-[120px]"
              >
                {isMessageLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>redirecting...</span>
                  </>
                ) : (
                  <span>Message</span>
                )}
              </button>

              <button
                onClick={handleProfileFollowToggle}
                className={`px-[24px] py-[14px] text-center rounded-[8px] cursor-pointer border ${
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