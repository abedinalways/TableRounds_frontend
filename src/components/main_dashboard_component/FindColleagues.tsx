'use client';

import React, { useState, memo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
import { useCreateConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';

// Define prop types for the colleague card to avoid using `any`
interface Colleague {
  id: string;
  name: string;
  avatar?: string;
  training_practice?: string;
  is_following: boolean;
}

interface ColleagueCardProps {
  colleague: Colleague;
  showAll: boolean;
  onMessage: (id: string) => void;
  onFollow: (id: string) => Promise<void> | void;
}

// 1. Extracted Child Component
const ColleagueCard = memo(
  ({ colleague, showAll, onMessage, onFollow }: ColleagueCardProps) => {
    // Use local state for immediate UI feedback without hitting the parent
    const [isFollowing, setIsFollowing] = useState(colleague.is_following);

    const handleFollowClick = async () => {
      const newState = !isFollowing;
      setIsFollowing(newState); // Optimistic UI update
      await onFollow(colleague.id);
    };

    const getInitials = (name: string) => {
      const parts = name.split(' ');
      return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`
        : name.slice(0, 2).toUpperCase();
    };

    return (
      <Card className="p-4 hover:shadow-md transition">
        <Link href={`/dashboard/user/profile/${colleague.id}`}>
          <div className="flex gap-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={colleague.avatar} />
              <AvatarFallback>{getInitials(colleague.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-semibold truncate">{colleague.name}</h4>
              <p className="text-sm text-gray-600 truncate">
                {colleague.training_practice || '—'}
              </p>
            </div>
          </div>
        </Link>

        {showAll && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onMessage(colleague.id)}
              className="flex-1 bg-[#01503b] text-white py-2 rounded-md cursor-pointer hover:opacity-90"
            >
              Message
            </button>
            <button
              onClick={handleFollowClick}
              className={`flex-1 py-2 rounded-md border transition ${
                isFollowing
                  ? 'bg-[#01503b] text-white border-[#01503b]'
                  : 'bg-white text-[#01503b] border-green-950 cursor-pointer'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )}
      </Card>
    );
  },
);

ColleagueCard.displayName = 'ColleagueCard';

const FindColleagues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const [createConversation] = useCreateConversationMutation();
  const [toggleFollow] = useToggleFollowMutation();

  const { data, isLoading, isFetching } = useDiscoverProfilesQuery({
    page: 1,
    limit: showAll ? 20 : 6,
    search: searchQuery,
  });

  const colleagues = data?.data ?? [];

  const handleMessageClick = async (participantId: string) => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await createConversation({
        participant_id: participantId,
      }).unwrap();
      router.push(`/dashboard/user/messages/${res.data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      await toggleFollow({
        userId,
        queryArgs: {
          page: 1,
          limit: showAll ? 20 : 6,
          search: searchQuery,
        },
      }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border rounded-xl shadow-sm p-4 font-[manrope]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Find Colleagues
        </h2>
        <Button
          onClick={() => setShowAll(prev => !prev)}
          className="bg-[#01503b] text-white"
        >
          {showAll ? 'Show Less' : 'View All Surgeons'}
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {(isLoading || isFetching) && (
        <p className="text-center text-gray-500 py-6">Loading...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleagues.map(colleague => (
          <ColleagueCard
            key={colleague.id}
            colleague={colleague}
            showAll={showAll}
            onMessage={handleMessageClick}
            onFollow={handleFollowToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default FindColleagues;
