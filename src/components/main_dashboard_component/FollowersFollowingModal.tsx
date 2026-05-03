

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
import { useState, useEffect, useRef } from 'react';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';

type UserItem = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  is_following?: boolean;
};

interface FollowersFollowingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  type: 'follower' | 'following';
  data: UserItem[];
  loading?: boolean;
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>;
}

export default function FollowersFollowingModal({
  open,
  onClose,
  type,
  data,
  loading,
  onFollowToggle,
}: FollowersFollowingModalProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const { data: connectionsData, isLoading } = useGetConnectionsQuery({
    type: 'following',
  });

 

  // const [prevConnections, setPrevConnections] = useState(connectionsData);
  // if (connectionsData !== prevConnections) {
  //   setPrevConnections(connectionsData);
  //   if (connectionsData?.data) {
  //     setFollowedUsers(new Set(connectionsData.data.map(user => user.id)));
  //   }
  // }

  // if (isLoading) return <p>Loading...</p>;

  // const handleFollowToggle = async (userId: string) => {
  //   const isCurrentlyFollowing = followedUsers.has(userId);
  //   setFollowedUsers(prev => {
  //     const newSet = new Set(prev);

  //     if (newSet.has(userId)) {
  //       newSet.delete(userId);
  //     } else {
  //       newSet.add(userId);
  //     }

  //     return newSet;
  //   });

  //   try {
  //     await onFollowToggle(userId, isCurrentlyFollowing);
  //   } catch (error) {
  //     console.error('Follow toggle failed', error);
  //   }
  // };

  useEffect(() => {
    if (connectionsData?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFollowedUsers(
        new Set(connectionsData.data.map((user: UserItem) => user.id)),
      );
    }
  }, [connectionsData]);

  const handleFollowToggle = async (userId: string) => {
    const isCurrentlyFollowing = followedUsers.has(userId);

    
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });

    try {
      await onFollowToggle(userId, isCurrentlyFollowing);
    } catch (error) {
      
      setFollowedUsers(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyFollowing) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
      console.error('Follow toggle failed', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] font-[manrope] rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-[20px] font-bold text-[#0f172b]">
            {type === 'follower' ? 'Followers' : 'Following'}
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
                          className="rounded-full object-cover aspect-square"
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