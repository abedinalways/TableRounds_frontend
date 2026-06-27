// 'use client';

// import Image from 'next/image';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useRouter } from 'next/navigation';
// import { useGetUserStatusQuery } from '@/app/redux/api/userStatusApi';
// import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';

// export default function UserListSection() {
//   const { data: usersResponse, isLoading } = useGetUserStatusQuery({
//     status: 'approved',
//     page: 1,
//     limit: 20,
//   });

//   const { selectConversation } = useChat();
//   const [createConversation] = useCreateAdminConversationMutation();
//   const router = useRouter();

//   if (isLoading) {
//     return (
//       <div className="p-4 text-xs text-gray-400">Loading approved users...</div>
//     );
//   }

//   const handleMessageClick = async (userId: string) => {
//     try {

//       const response = await createConversation({
//         participant_id: userId,
//       }).unwrap();

//       console.log('Conversation created successfully:', response);

//       const conversationId = response.data.id;

//       if (conversationId) {
//         selectConversation(conversationId);

//         router.push(`/dashboard/admin/support-message/${conversationId}`);
//       }
//     } catch (error) {
//       console.error('Conversation creation failed:', error);
//     }
//   };

//   const users = usersResponse?.data || [];

//   return (
//     <div className="space-y-2">
//       <h4 className="text-green-900 font-semibold text-sm mb-3">
//         Approved Users
//       </h4>

//       {users.length === 0 ? (
//         <p className="text-xs text-gray-500 p-2">No approved users found.</p>
//       ) : (
//         users.map(user => (
//           <div
//             key={user.id}

//             onClick={() => handleMessageClick(user.id)}
//             className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-green-50 border border-transparent hover:border-green-100 transition-all group"
//           >
//             <div className="relative w-10 h-10 flex-shrink-0">
//               <Image
//                 src={user.avatar_url || '/images/img008.png'}
//                 alt={user.name}
//                 fill
//                 className="rounded-full object-cover border border-gray-100"
//                 unoptimized
//               />
//             </div>

//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate text-gray-800 group-hover:text-green-700 transition-colors">
//                 {user.name}
//               </p>
//               <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
//             </div>

//             <div className="w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState } from 'react'; // Added useState
// import Image from 'next/image';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useRouter } from 'next/navigation';
// import { useGetUserStatusQuery } from '@/app/redux/api/userStatusApi';
// import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
// import { Search } from 'lucide-react'; // Added for search icon

// export default function UserListSection() {
//   const [searchTerm, setSearchTerm] = useState(''); // Search query state

//   const { data: usersResponse, isLoading } = useGetUserStatusQuery({
//     status: 'approved',
//     page: 1,
//     limit: 20,
//   });

//   const { selectConversation } = useChat();
//   const [createConversation] = useCreateAdminConversationMutation();
//   const router = useRouter();

//   if (isLoading) {
//     return (
//       <div className="p-4 text-xs text-gray-400">Loading approved users...</div>
//     );
//   }

//   const handleMessageClick = async (userId: string) => {
//     try {
//       const response = await createConversation({
//         participant_id: userId,
//       }).unwrap();

//       console.log('Conversation created successfully:', response);

//       const conversationId = response.data.id;

//       if (conversationId) {
//         selectConversation(conversationId);
//         router.push(`/dashboard/admin/support-message/${conversationId}`);
//       }
//     } catch (error) {
//       console.error('Conversation creation failed:', error);
//     }
//   };

//   const users = usersResponse?.data || [];

//   // Filter the array on the client side based on name matches
//   const filteredUsers = users.filter((user: any) =>
//     user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="space-y-3">
//       {/* Search Input Box */}
//       <div className="relative mb-2">
//         <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//           <Search size={14} />
//         </span>
//         <input
//           type="text"
//           placeholder="Search user..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-green-600 focus:bg-white transition-all text-gray-800"
//         />
//       </div>

//       <h4 className="text-green-900 font-semibold text-sm mb-1">
//         Approved Users
//       </h4>

//       {filteredUsers.length === 0 ? (
//         <p className="text-xs text-gray-500 p-2">No matching users found.</p>
//       ) : (
//         filteredUsers.map((user: any) => (
//           <div
//             key={user.id}
//             onClick={() => handleMessageClick(user.id)}
//             className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-green-50 border border-transparent hover:border-green-100 transition-all group"
//           >
//             <div className="relative w-10 h-10 flex-shrink-0">
//               <Image
//                 src={user.avatar_url || '/images/img008.png'}
//                 alt={user.name}
//                 fill
//                 className="rounded-full object-cover border border-gray-100"
//                 unoptimized
//               />
//             </div>

//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate text-gray-800 group-hover:text-green-700 transition-colors">
//                 {user.name}
//               </p>
//               <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
//             </div>

//             <div className="w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useGetUserStatusQuery } from '@/app/redux/api/userStatusApi';
import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

const LIMIT = 20;

export default function UserListSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

 
  const debouncedSearch = useDebounce(searchTerm, 400);

  const observerRef = useRef<IntersectionObserver | null>(null);


  const isSearchActive = debouncedSearch.length >= 2;

  const {
    data: usersResponse,
    isLoading,
    isFetching,
  } = useGetUserStatusQuery(
    {
      status: 'approved',
      page,
      limit: LIMIT,
      ...(isSearchActive ? { search: debouncedSearch } : {}),
    },
    {
     
      skip: debouncedSearch.length > 0 && debouncedSearch.length < 2,
    },
  );

  const { selectConversation } = useChat();
  const [createConversation] = useCreateAdminConversationMutation();
  const router = useRouter();

 
  useEffect(() => {
    setPage(1);
    setAllUsers([]);
    setHasMore(true);
  }, [debouncedSearch]);


  useEffect(() => {
    if (!usersResponse?.data) return;

    const newUsers = usersResponse.data;

    if (page === 1) {
      
      setAllUsers(newUsers);
    } else {
    
      setAllUsers(prev => {
        const existingIds = new Set(prev.map(u => u.id));
        const uniqueNew = newUsers.filter(
          (u: UserItem) => !existingIds.has(u.id),
        );
        return [...prev, ...uniqueNew];
      });
    }

  
    const total = usersResponse.meta_data?.total ?? 0;
    const loaded = page * LIMIT;
    setHasMore(loaded < total);
  }, [usersResponse, page]);

 
  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore],
  );

  // ✅ Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleMessageClick = async (userId: string) => {
    try {
      const response = await createConversation({
        participant_id: userId,
      }).unwrap();

      const conversationId = response.data.id;

      if (conversationId) {
        selectConversation(conversationId);
        router.push(`/dashboard/admin/support-message/${conversationId}`);
      }
    } catch (error) {
      console.error('Conversation creation failed:', error);
    }
  };

  
  const showMinCharsHint = searchTerm.length > 0 && searchTerm.length < 2;

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative mb-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-green-600 focus:bg-white transition-all text-gray-800"
        />
        {isFetching && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 size={14} className="animate-spin text-gray-400" />
          </span>
        )}
      </div>

  
      {showMinCharsHint && (
        <p className="text-[10px] text-gray-400 px-1">
          Type at least 2 characters to search...
        </p>
      )}

      <h4 className="text-green-900 font-semibold text-sm mb-1">
        {isSearchActive ? 'Search Results' : 'Approved Users'}
        {usersResponse?.meta_data?.total != null && (
          <span className="text-gray-400 font-normal ml-1">
            ({usersResponse.meta_data.total})
          </span>
        )}
      </h4>

      {/* User List */}
      {isLoading && page === 1 ? (
        <div className="p-4 text-xs text-gray-400">Loading users...</div>
      ) : allUsers.length === 0 && !showMinCharsHint ? (
        <p className="text-xs text-gray-500 p-2">No matching users found.</p>
      ) : (
        <>
          {allUsers.map((user, index) => {
            const isLast = index === allUsers.length - 1;

            return (
              <div
                key={user.id}
                ref={isLast ? lastUserRef : null}
                onClick={() => handleMessageClick(user.id)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-green-50 border border-transparent hover:border-green-100 transition-all group"
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={user.avatar_url || '/images/img008.png'}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover border border-gray-100"
                    unoptimized
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-800 group-hover:text-green-700 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}

          
          {isFetching && page > 1 && (
            <div className="flex justify-center py-3">
              <Loader2 size={18} className="animate-spin text-gray-400" />
            </div>
          )}

          
          {!hasMore && allUsers.length > 0 && (
            <p className="text-[10px] text-gray-400 text-center py-2">
              All users loaded
            </p>
          )}
        </>
      )}
    </div>
  );
}