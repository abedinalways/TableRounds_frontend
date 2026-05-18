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

interface ProfileFollowersFollowingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  type: 'followers' | 'following';
  profileUserId: string; // the OTHER user's id — used for their list
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>;
}

export default function ProfileFollowersFollowingModal({
  open,
  onClose,
  type,
  profileUserId,
  onFollowToggle,
}: ProfileFollowersFollowingModalProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // ✅ Fetch the OTHER user's followers/following using user_id (now properly typed)
  const { data: profileConnectionsData, isLoading } = useGetConnectionsQuery(
    {
      type: type === 'followers' ? 'follower' : 'following',
      user_id: profileUserId,
    },
    { skip: !open },
  );

  // ✅ Fetch the LOGGED-IN user's following — only to determine button state
  const { data: myConnectionsData } = useGetConnectionsQuery(
    { type: 'following' },
    { skip: !open },
  );

  useEffect(() => {
    if (myConnectionsData?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFollowedUsers(
        new Set(myConnectionsData.data.map((u: { id: string }) => u.id)),
      );
    }
  }, [myConnectionsData]);

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
      setFollowedUsers(prev => {
        const next = new Set(prev);
        isCurrentlyFollowing ? next.add(userId) : next.delete(userId);
        return next;
      });
      console.error('Follow toggle failed', error);
    }
  };

  const data = profileConnectionsData?.data ?? [];

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
            {isLoading ? (
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

                // ✅ Check against logged-in user's following list
                const isFollowing = followedUsers.has(user.id);

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
                          className="rounded-md object-cover"
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
