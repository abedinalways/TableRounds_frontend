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
import { useState } from 'react';

type UserItem = {
  id: string;
  name: string;
  username: string;
  avatar: string;
};

interface FollowersFollowingModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  type: 'followers' | 'following';
  data: UserItem[];
}

export default function FollowersFollowingModal({
  open,
  onClose,
  type,
  data,
}: FollowersFollowingModalProps) {
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

    const handleFollowToggle = (userId: string) => {
      setFollowedUsers(prev => {
        const newFollowedUsers = new Set(prev);
        if (newFollowedUsers.has(userId)) {
          newFollowedUsers.delete(userId); // Unfollow
        } else {
          newFollowedUsers.add(userId); // Follow
        }
        return newFollowedUsers;
      });
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
            {data.length === 0 ? (
              <p className="text-center text-[#6b7280] text-sm">
                No {type} found.
              </p>
            ) : (
              data.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4"
                >
                  <Link href="/dashboard/profile">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={44}
                        height={44}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#0f172b]">
                          {user.name}
                        </p>

                        <p className="text-sm text-[#6b7280] cursor-pointer">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => handleFollowToggle(user.id)}
                    className="rounded-sm cursor-pointer"
                  >
                    {followedUsers.has(user.id) ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
