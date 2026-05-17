// 'use client';

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import Image from 'next/image';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { useState } from 'react';

// type UserItem = {
//   id: string;
//   name: string;
//   username: string;
//   avatar: string;
// };

// interface FollowersFollowingModalProps {
//   open: boolean;
//   onClose: (open: boolean) => void;
//   type: 'followers' | 'following';
//   data: UserItem[];
//   loading?: boolean;
// }

// export default function FollowersFollowingModal({
//   open,
//   onClose,
//   type,
//   data,
//   loading,
// }: FollowersFollowingModalProps) {
//     const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

//     const handleFollowToggle = (userId: string) => {
//       setFollowedUsers(prev => {
//         const newFollowedUsers = new Set(prev);
//         if (newFollowedUsers.has(userId)) {
//           newFollowedUsers.delete(userId); // Unfollow
//         } else {
//           newFollowedUsers.add(userId); // Follow
//         }
//         return newFollowedUsers;
//       });
//     };
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-[480px] font-[manrope] rounded-2xl p-0 overflow-hidden">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b">
//           <DialogTitle className="text-[20px] font-bold text-[#0f172b]">
//             {type === 'followers' ? 'Followers' : 'Following'}
//           </DialogTitle>
//         </DialogHeader>

//         <ScrollArea className="h-[400px] px-6 py-4">
//           <div className="space-y-4">
//             {loading ? (
//               <p className="text-center text-sm">Loading...</p>
//             ) : data.length === 0 ? (
//               <p className="text-center text-[#6b7280] text-sm">
//                 No {type} found.
//               </p>
//             ) : (
//               data.map(user => (
//                 <div
//                   key={user.id}
//                   className="flex items-center justify-between gap-4"
//                 >
//                   <Link href="/dashboard/profile">
//                     <div className="flex items-center gap-3">
//                       <Image
//                         src={user.avatar}
//                         alt={user.name}
//                         width={44}
//                         height={44}
//                         className="rounded-md object-cover"
//                       />
//                       <div>
//                         <p className="font-semibold text-[#0f172b]">
//                           {user.name}
//                         </p>

//                         <p className="text-sm text-[#6b7280] cursor-pointer">
//                           @{user.username}
//                         </p>
//                       </div>
//                     </div>
//                   </Link>

//                   <Button
//                     variant="outline"
//                     onClick={() => handleFollowToggle(user.id)}
//                     className="rounded-sm cursor-pointer"
//                   >
//                     {followedUsers.has(user.id) ? 'Unfollow' : 'Follow'}
//                   </Button>
//                 </div>
//               ))
//             )}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';

type UserItem = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  is_following?: boolean;
};

interface FollowersFollowingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  type: 'followers' | 'following';
  data: UserItem[];
  loading?: boolean;
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>; // ✅ added
}

export default function FollowersFollowingModal({
  open,
  onClose,
  type,
  data,
  loading,
  onFollowToggle, // ✅ added
}: FollowersFollowingModalProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // ✅ Always fetch the current user's following list to know real follow state
  const { data: connectionsData } = useGetConnectionsQuery({
    type: 'following',
  });

  useEffect(() => {
    if (connectionsData?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFollowedUsers(
        new Set(connectionsData.data.map((u: { id: string }) => u.id)),
      );
    }
  }, [connectionsData]);

  //Optimistic toggle + rollback on error (same pattern as dashboard)
  const handleFollowToggle = async (userId: string) => {
    const isCurrentlyFollowing = followedUsers.has(userId);

    setFollowedUsers(prev => {
      const next = new Set(prev);
      isCurrentlyFollowing ? next.delete(userId) : next.add(userId);
      return next;
    });

    try {
      await onFollowToggle(userId, isCurrentlyFollowing);
    } catch (error) {
      // rollback
      setFollowedUsers(prev => {
        const next = new Set(prev);
        isCurrentlyFollowing ? next.add(userId) : next.delete(userId);
        return next;
      });
      console.error('Follow toggle failed', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] font-[manrope] rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-[20px] font-bold text-[#0f172b]">
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] px-6 py-4">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-sm">Loading...</p>
            ) : data.length === 0 ? (
              <p className="text-center text-[#6b7280] text-sm">
                No {type} found.
              </p>
            ) : (
              data.map(user => {
                const avatar =
                  user.avatar && user.avatar.startsWith('http')
                    ? user.avatar
                    : '/images/dashboard/message/doctor.png';

                // Same hybrid check as dashboard modal
                const isFollowing =
                  followedUsers.has(user.id) || user.is_following;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <Link href={`/dashboard/user/profile/${user.id}`}>
                      <div className="flex items-center gap-3">
                        <Image
                          src={avatar}
                          alt={user.name}
                          width={44}
                          height={44}
                          className="rounded-full aspect-square object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#0f172b]">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => handleFollowToggle(user.id)}
                      className={`rounded-sm cursor-pointer ${isFollowing ? 'bg-green-900 text-white' : ''}`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}