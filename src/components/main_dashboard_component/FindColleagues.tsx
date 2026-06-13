// 'use client';

// import React, { useState, memo, useEffect } from 'react';
// import { Search } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';

// import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
// import { useCreateConversationMutation } from '@/app/redux/api/chat/chatApi';
// import { useToggleFollowMutation } from '@/app/redux/api/followApi';
// import { ColleaguesGridSkeleton } from './ColleaguesGridSkeleton';


// interface Colleague {
//   id: string;
//   name: string;
//   avatar?: string;
//   training_practice?: string;
//   is_following: boolean;
// }

// interface ColleagueCardProps {
//   colleague: Colleague;
//   showAll: boolean;
//   onMessage: (id: string) => void;
//   onFollow: (id: string, isFollowing: boolean) => Promise<void> | void;
// }

// // 1. Extracted Child Component
// const ColleagueCard = memo(
//   ({ colleague, showAll, onMessage, onFollow }: ColleagueCardProps) => {

//     const [isFollowing, setIsFollowing] = useState(colleague.is_following);

//     useEffect(() => {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setIsFollowing(colleague.is_following);
//     }, [colleague.is_following]);

//     const handleFollowClick = async () => {
//       const prevState = isFollowing;
//       setIsFollowing(!prevState);

//       try {
//         await onFollow(colleague.id, prevState);
//       } catch {
//         setIsFollowing(prevState);
//       }
//     };

//     const getInitials = (name: string) => {
//       const parts = name.split(' ');
//       return parts.length >= 2
//         ? `${parts[0][0]}${parts[1][0]}`
//         : name.slice(0, 2).toUpperCase();
//     };

//     return (
//       <Card className="p-4 hover:shadow-md transition">
//         <Link href={`/dashboard/user/profile/${colleague.id}`}>
//           <div className="flex gap-3">
//             <Avatar className="h-14 w-14">
//               <AvatarImage src={colleague.avatar} />
//               <AvatarFallback>{getInitials(colleague.name)}</AvatarFallback>
//             </Avatar>
//             <div className="min-w-0">
//               <h4 className="font-semibold truncate">{colleague.name}</h4>
//               <p className="text-sm text-gray-600 truncate">
//                 {colleague.training_practice || '—'}
//               </p>
//             </div>
//           </div>
//         </Link>

//         {showAll && (
//           <div className="mt-4 flex gap-2">
//             <button
//               onClick={() => onMessage(colleague.id)}
//               className="flex-1 bg-[#01503b] text-white py-2 rounded-md cursor-pointer hover:opacity-90"
//             >
//               Message
//             </button>
//             <button
//               onClick={handleFollowClick}
//               className={`flex-1 py-2 rounded-md border transition ${
//                 isFollowing
//                   ? 'bg-[#01503b] text-white border-[#01503b]'
//                   : 'bg-white text-[#01503b] border-green-950 cursor-pointer'
//               }`}
//             >
//               {isFollowing ? 'Unfollow' : 'Follow'}
//             </button>
//           </div>
//         )}
//       </Card>
//     );
//   },
// );

// ColleagueCard.displayName = 'ColleagueCard';

// const FindColleagues = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAll, setShowAll] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);

//   const router = useRouter();
//   const [createConversation] = useCreateConversationMutation();
//   const [toggleFollow] = useToggleFollowMutation();

//   const { data, isLoading, isFetching } = useDiscoverProfilesQuery({
//     page: 1,
//     limit: showAll ? 200 : 6,
//     search: searchQuery,
//   });

//   const colleagues = data?.data ?? [];
//   console.log('Colleagues data:', colleagues);
//   const handleMessageClick = async (participantId: string) => {
//     if (isCreating) return;
//     setIsCreating(true);
//     try {
//       const res = await createConversation({
//         participant_id: participantId,
//       }).unwrap();
//       window.location.href = `/dashboard/user/messages/${res.data.id}`;
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
//     try {
//       await toggleFollow({
//         userId,
//         isFollowing,
//         queryArgs: {
//           page: 1,
//           limit: showAll ? 1000 : 6,
//           search: searchQuery,
//         },
//       }).unwrap();
//     } catch (error) {
//       console.error('Follow toggle failed', error);
//     }
//   };


//   return (
//     <>
//       <div className="w-full  mx-auto bg-white border rounded-xl shadow-sm p-4 font-[manrope]">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <h2 className="text-2xl font-semibold text-gray-900">
//             Find Colleagues
//           </h2>
//           <Button
//             onClick={() => setShowAll(prev => !prev)}
//             className="bg-[#01503b] text-white cursor-pointer"
//           >
//             {showAll ? 'Show Less' : 'View All Surgeons'}
//           </Button>
//         </div>

//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <Input
//             placeholder="Search by name, location..."
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {isLoading ? (
//           <ColleaguesGridSkeleton showAll={showAll} />
//         ) : (
//           <div
//             className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition ${
//               isFetching ? 'opacity-50 pointer-events-none' : ''
//             }`}
//           >
//             {colleagues.map(colleague => (
//               <ColleagueCard
//                 key={colleague.id}
//                 colleague={colleague}
//                 showAll={showAll}
//                 onMessage={handleMessageClick}
//                 onFollow={handleFollowToggle}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default FindColleagues;


'use client';

import React, { useState, memo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
import { useCreateConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { ColleaguesGridSkeleton } from './ColleaguesGridSkeleton';

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
  onFollow: (id: string, isFollowing: boolean) => Promise<void> | void;
}

const ColleagueCard = memo(
  ({ colleague, showAll, onMessage, onFollow }: ColleagueCardProps) => {
    const [isFollowing, setIsFollowing] = useState(colleague.is_following);

    useEffect(() => {
      setIsFollowing(colleague.is_following);
    }, [colleague.is_following]);

    const handleFollowClick = async () => {
      const prevState = isFollowing;
      setIsFollowing(!prevState);

      try {
        await onFollow(colleague.id, prevState);
      } catch {
        setIsFollowing(prevState);
      }
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
              className="flex-1 bg-[#01503b] text-white py-2 rounded-md cursor-pointer hover:opacity-90 text-sm"
            >
              Message
            </button>
            <button
              onClick={handleFollowClick}
              className={`flex-1 py-2 rounded-md border transition text-sm ${isFollowing
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const urlPage = Number(searchParams.get('page')) || 1;
  const urlSearch = searchParams.get('search') || '';
  const urlShowAll = searchParams.get('showAll') === 'true';

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [showAll, setShowAll] = useState(urlShowAll);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [isCreating, setIsCreating] = useState(false);

  const [createConversation] = useCreateConversationMutation();
  const [toggleFollow] = useToggleFollowMutation();


  const itemsPerPage = showAll ? 12 : 6;

  // API Call
  const { data, isLoading, isFetching } = useDiscoverProfilesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const colleagues = data?.data ?? [];
  const metaData = data?.meta_data ?? { page: 1, limit: 6, total: 0 };
  const totalPages = Math.ceil(metaData.total / itemsPerPage);


  const updateUrl = (updatedPage: number, updatedSearch: string, updatedShowAll: boolean) => {
    const params = new URLSearchParams();
    if (updatedPage > 1) params.set('page', updatedPage.toString());
    if (updatedSearch) params.set('search', updatedSearch);
    if (updatedShowAll) params.set('showAll', 'true');

    router.push(`${pathname}?${params.toString()}`);
  };


  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateUrl(1, value, showAll);
  };


  const handleToggleShowAll = () => {
    const nextShowAll = !showAll;
    setShowAll(nextShowAll);
    setCurrentPage(1);
    updateUrl(1, searchQuery, nextShowAll);
  };


  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    updateUrl(newPage, searchQuery, showAll);
  };

  const handleMessageClick = async (participantId: string) => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await createConversation({
        participant_id: participantId,
      }).unwrap();
      window.location.href = `/dashboard/user/messages/${res.data.id}`;
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      await toggleFollow({
        userId,
        isFollowing,
        queryArgs: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
        },
      }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };

  return (
    <div className="w-full mx-auto bg-white border rounded-xl shadow-sm p-4 font-[manrope]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Find Colleagues</h2>
        <Button
          onClick={handleToggleShowAll}
          className="bg-[#01503b] text-white cursor-pointer"
        >
          {showAll ? 'Show Less' : 'View All Surgeons'}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name, location..."
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <ColleaguesGridSkeleton showAll={showAll} />
      ) : (
        <>
          {colleagues.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No colleagues found.</div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition ${isFetching ? 'opacity-50 pointer-events-none' : ''
                }`}
            >
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
          )}


          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 border-t pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600 px-2">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (Total: {metaData.total})
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindColleagues;