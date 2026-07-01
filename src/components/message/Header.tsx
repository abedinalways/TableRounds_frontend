// 'use client';

// import Image from 'next/image';
// import React, { useMemo, useRef, useState } from 'react';
// import { toast } from 'sonner';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useReportUserMutation } from '@/app/redux/api/reportApi';
// import { useToggleFollowMutation } from '@/app/redux/api/followApi';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { useGetMessagesQuery } from '@/app/redux/api/chat/chatApi';
// import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
// import Link from 'next/link';

// export default function Header() {
//   const { conversations, activeConversationId } = useChat();
//   const textRef = useRef<HTMLHeadingElement | null>(null);
//   const { data: me } = useMeQuery();

//   const [reportUser, { isLoading: isReporting }] = useReportUserMutation();
//   const [toggleFollow, { isLoading: isFollowLoading }] =
//     useToggleFollowMutation();

//   const activeConversation = conversations.find(
//     conv => conv.id === activeConversationId,
//   );
//   // console.log(activeConversation, 'activeConversation=====================++++++++++++++++',);

//   const { data: chatData } = useGetMessagesQuery({
//     conversationId: activeConversationId as string,
//     limit: 20,
//   });
//     // console.log(chatData, 'chatData========efweo9wego=============++++++++++++++++',);

//   // local follow state by participant id
//   const [followState, setFollowState] = useState<Record<string, boolean>>({});

//   const participantId = activeConversation?.participant?.id;
//   const participant = activeConversation?.creator?.id == me?.id ? activeConversation?.participant?.name : activeConversation?.creator?.name;

//   const participantAvatar = activeConversation?.creator?.id == me?.id ? activeConversation?.participant?.avatar_url : activeConversation?.creator?.avatar_url;
//   const isFollowing = useMemo(() => {
//     if (!participantId) return false;
//     return followState[participantId] ?? false;
//   }, [followState, participantId]);

//   if (!activeConversation) return null;

//   const handleReportUser = async () => {
//     try {
//       const userId = activeConversation.participant?.id;

//       if (!userId) {
//         toast.error('User id not found');
//         return;
//       }

//       const res = await reportUser({
//         userId,
//         data: {
//           reason: 'Spam',
//           message: 'Reported from chat header',
//         },
//       }).unwrap();

//       toast.success(res?.message || 'User reported successfully');
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Failed to report user');
//       console.error(error);
//     }
//   };

//   const handleToggleFollow = async () => {
//     try {
//       const userId = activeConversation.participant?.id;

//       if (!userId) {
//         toast.error('User id not found');
//         return;
//       }

//       const nextState = !isFollowing;

//       // optimistic local update
//       setFollowState(prev => ({
//         ...prev,
//         [userId]: nextState,
//       }));

//       const res = await toggleFollow({ userId, isFollowing: isFollowing }).unwrap();

//       toast.success(
//         res?.message ||
//           (nextState ? 'Followed successfully' : 'Unfollowed successfully'),
//       );
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       // rollback on failure
//       if (participantId) {
//         setFollowState(prev => ({
//           ...prev,
//           [participantId]: !isFollowing,
//         }));
//       }

//       toast.error(error?.data?.message || 'Failed to update follow status');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="md:px-4 px-2 pt-2 md:pt-0 background md:h-[100px] text-white rounded-lg shadow-lg overflow-hidden font-[manrope] flex md:items-center max-w-full">
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center gap-4">
//           <Image
//             src={participantAvatar || '/images/doc.png'}
//             width={90}
//             height={90}
//             alt="doctor"
//             className="md:w-[90px] md:h-[90px] w-[35px] h-[35px] rounded-full aspect-square object-cover"
//             unoptimized
//           />

//           <div className="space-y-1">
//             <h2 ref={textRef} className="md:text-2xl text-sm font-bold">
//               {participant || 'Unknown User'}
//             </h2>

//             <p className="md:text-sm text-xs opacity-90">
//               Chat with your colleague
//             </p>
//           </div>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-xl rotate-90 cursor-pointer focus:outline-none">
//               ...
//             </button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             align="end"
//             className="w-44 bg-background text-foreground"
//           >
//             <Link href={`/dashboard/user/profile/${participantId}`}>
//               <DropdownMenuItem className="cursor-pointer font-[manrope]">
//                 Profile
//               </DropdownMenuItem>
//             </Link>

//             <DropdownMenuItem
//               className="cursor-pointer font-[manrope]"
//               onClick={handleReportUser}
//               disabled={isReporting}
//             >
//               {isReporting ? 'Reporting...' : 'Reported User'}
//             </DropdownMenuItem>

//             <DropdownMenuItem
//               className="cursor-pointer"
//               onClick={handleToggleFollow}
//               disabled={isFollowLoading}
//             >
//               {isFollowLoading
//                 ? 'Updating...'
//                 : isFollowing
//                   ? 'follow User'
//                   : 'Unfollow User'}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// }

'use client';

import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useReportUserMutation } from '@/app/redux/api/reportApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetMessagesQuery } from '@/app/redux/api/chat/chatApi';
import Link from 'next/link';

export default function Header() {
  const { conversations, activeConversationId } = useChat();
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const { data: me } = useMeQuery();

  const [reportUser, { isLoading: isReporting }] = useReportUserMutation();
  const [toggleFollow, { isLoading: isFollowLoading }] =
    useToggleFollowMutation();

  const activeConversation = conversations.find(
    conv => conv.id === activeConversationId,
  );

  const { data: chatData } = useGetMessagesQuery({
    conversationId: activeConversationId as string,
    limit: 20,
  });

  // local follow state by participant id
  const [followState, setFollowState] = useState<Record<string, boolean>>({});

  
  const participantId =
    activeConversation?.creator?.id === me?.id
      ? activeConversation?.participant?.id
      : activeConversation?.creator?.id;

  const participant =
    activeConversation?.creator?.id === me?.id
      ? activeConversation?.participant?.name
      : activeConversation?.creator?.name;

  const participantAvatar =
    activeConversation?.creator?.id === me?.id
      ? activeConversation?.participant?.avatar_url
      : activeConversation?.creator?.avatar_url;

  // ✅ Dynamic profile URL based on current user role
  const isCurrentUserAdmin = me?.role === 'admin' || me?.type === 'admin';
  const profileUrl = isCurrentUserAdmin
    ? `/dashboard/admin/user-profile/${participantId}`
    : `/dashboard/user/profile/${participantId}`;

  const isFollowing = useMemo(() => {
    if (!participantId) return false;
    return followState[participantId] ?? false;
  }, [followState, participantId]);

  if (!activeConversation) return null;

  const handleReportUser = async () => {
    try {
     
      if (!participantId) {
        toast.error('User id not found');
        return;
      }

      const res = await reportUser({
        userId: participantId,
        data: {
          reason: 'Spam',
          message: 'Reported from chat header',
        },
      }).unwrap();

      toast.success(res?.message || 'User reported successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to report user');
      console.error(error);
    }
  };

  const handleToggleFollow = async () => {
    try {
     
      if (!participantId) {
        toast.error('User id not found');
        return;
      }

      const nextState = !isFollowing;

      // optimistic local update
      setFollowState(prev => ({
        ...prev,
        [participantId]: nextState,
      }));

      const res = await toggleFollow({
        userId: participantId,
        isFollowing: isFollowing,
      }).unwrap();

      toast.success(
        res?.message ||
          (nextState ? 'Followed successfully' : 'Unfollowed successfully'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // rollback on failure
      if (participantId) {
        setFollowState(prev => ({
          ...prev,
          [participantId]: !isFollowing,
        }));
      }

      toast.error(error?.data?.message || 'Failed to update follow status');
      console.error(error);
    }
  };

  return (
    <div className="md:px-4 px-2 pt-2 md:pt-0 background md:h-[100px] text-white rounded-lg shadow-lg overflow-hidden font-[manrope] flex md:items-center max-w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Image
            src={participantAvatar || '/images/doc.png'}
            width={90}
            height={90}
            alt="doctor"
            className="md:w-[90px] md:h-[90px] w-[35px] h-[35px] rounded-full aspect-square object-cover"
            unoptimized
          />

          <div className="space-y-1">
            <h2 ref={textRef} className="md:text-2xl text-sm font-bold">
              {participant || 'Unknown User'}
            </h2>

            <p className="md:text-sm text-xs opacity-90">
              Chat with your colleague
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-xl rotate-90 cursor-pointer focus:outline-none">
              ...
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 bg-background text-foreground"
          >
            
            <Link href={profileUrl}>
              <DropdownMenuItem className="cursor-pointer font-[manrope]">
                Profile
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className="cursor-pointer font-[manrope]"
              onClick={handleReportUser}
              disabled={isReporting}
            >
              {isReporting ? 'Reporting...' : 'Report User'}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleToggleFollow}
              disabled={isFollowLoading}
            >
              {isFollowLoading
                ? 'Updating...'
                : isFollowing
                  ? 'Unfollow User'
                  : 'Follow User'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}