// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import gsap from 'gsap';
// import FollowersFollowingModal from './FollowersFollowingModal';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';

// export const WelcomeBanner = () => {
//   const { data: user } = useMeQuery();

//   const textRef = useRef<HTMLHeadingElement | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<'follower' | 'following'>(
//     'follower',
//   );

//   // ✅ Fetch connections dynamically
//   const { data: connectionsData, isLoading } = useGetConnectionsQuery(
//     { type: modalType },
//     { skip: !modalOpen },
//   );

//   useEffect(() => {
//     if (textRef.current) {
//       gsap.fromTo(
//         textRef.current,
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.8 },
//       );
//     }
//   }, []);

//   const formattedDate = new Date().toLocaleDateString('en-US', {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric',
//   });

//   const avatar =
//     user?.avatar && user.avatar.startsWith('http')
//       ? new URL(user.avatar).href
//       : '/images/dashboard/doctor.png';

//   return (
//     <>
//       <div className="px-4 pt-2 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope]">
//         <div className="md:flex items-center justify-evenly py-4 relative z-10">
//           {/* Avatar */}
//           <div className="flex flex-col items-center gap-4">
//             <div className="rounded-full border-4 border-[#B79E6B] w-fit">
//               <Image
//                 src={avatar}
//                 width={160}
//                 height={160}
//                 alt=""
//                 className="rounded-full object-cover aspect-square "
//                 unoptimized
//               />
//             </div>
//           </div>

//           {/* Info */}
//           <div className="flex items-center justify-center">
//             <div className="flex flex-col gap-2">
//               <h2 ref={textRef} className="md:text-4xl text-lg font-bold">
//                 Welcome, {user?.name}!
//               </h2>

//               <p className="md:text-[18px] text-xs">
//                 Stay up to date on your current progress
//               </p>

//               <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
//                 {/* Followers */}
//                 <button
//                   onClick={() => {
//                     setModalType('following');
//                     setModalOpen(true);
//                   }}
//                   className="hover:opacity-80"
//                 >
//                   <span className="md:text-lg text-xs font-semibold">
//                     {user?.followers} Following
//                   </span>
//                 </button>

//                 <span className="opacity-60">|</span>

//                 {/* Following */}
//                 <button
//                   onClick={() => {
//                     setModalType('follower');
//                     setModalOpen(true);
//                   }}
//                   className="hover:opacity-80"
//                 >
//                   <span className="md:text-lg text-xs font-semibold">
//                     {user?.followings} Followers
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Date */}
//           <div className="flex flex-col items-center">
//             <p className="text-[16px] font-medium">{formattedDate}</p>
//             <Image
//               src="/images/dashboard/main_dashboard/tr.png"
//               width={138}
//               height={138}
//               alt="doctor"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ✅ Modal */}
//       <FollowersFollowingModal
//         open={modalOpen}
//         onClose={setModalOpen}
//         type={modalType}
//         data={connectionsData?.data || []}
//         loading={isLoading}
//       />
//     </>
//   );
// };

'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import FollowersFollowingModal from './FollowersFollowingModal';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi'; // ✅ added

export const WelcomeBanner = () => {
  const { data: user } = useMeQuery();

  const textRef = useRef<HTMLHeadingElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'follower' | 'following'>(
    'follower',
  );

  // ✅ follow mutation
  const [toggleFollow] = useToggleFollowMutation();

  // ✅ Fetch connections dynamically
  const { data: connectionsData, isLoading } = useGetConnectionsQuery(
    { type: modalType },
    { skip: !modalOpen },
  );

  // ✅ follow/unfollow handler
  const handleFollowToggle = async (userId: string) => {
    try {
      await toggleFollow({ userId }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
      );
    }
  }, []);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const avatar =
    user?.avatar && user.avatar.startsWith('http')
      ? new URL(user.avatar).href
      : '/images/dashboard/doctor.png';

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
                className="rounded-full object-cover aspect-square "
                unoptimized
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-2">
              <h2 ref={textRef} className="md:text-4xl text-lg font-bold">
                Welcome, {user?.name}!
              </h2>

              <p className="md:text-[18px] text-xs">
                Stay up to date on your current progress
              </p>

              <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
                {/* Followers */}
                <button
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="hover:opacity-80"
                >
                  <span className="md:text-lg text-xs font-semibold">
                    {user?.followers} Following
                  </span>
                </button>

                <span className="opacity-60">|</span>

                {/* Following */}
                <button
                  onClick={() => {
                    setModalType('follower');
                    setModalOpen(true);
                  }}
                  className="hover:opacity-80"
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

      {/* ✅ Modal */}
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