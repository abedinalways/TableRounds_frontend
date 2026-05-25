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

'use client';

import { useState } from 'react'; // Added useState
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useGetUserStatusQuery } from '@/app/redux/api/userStatusApi';
import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
import { Search } from 'lucide-react'; // Added for search icon

export default function UserListSection() {
  const [searchTerm, setSearchTerm] = useState(''); // Search query state

  const { data: usersResponse, isLoading } = useGetUserStatusQuery({
    status: 'approved',
    page: 1,
    limit: 20,
  });

  const { selectConversation } = useChat();
  const [createConversation] = useCreateAdminConversationMutation();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="p-4 text-xs text-gray-400">Loading approved users...</div>
    );
  }

  const handleMessageClick = async (userId: string) => {
    try {
      const response = await createConversation({
        participant_id: userId,
      }).unwrap();

      console.log('Conversation created successfully:', response);

      const conversationId = response.data.id;

      if (conversationId) {
        selectConversation(conversationId);
        router.push(`/dashboard/admin/support-message/${conversationId}`);
      }
    } catch (error) {
      console.error('Conversation creation failed:', error);
    }
  };

  const users = usersResponse?.data || [];

  // Filter the array on the client side based on name matches
  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      {/* Search Input Box */}
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
      </div>

      <h4 className="text-green-900 font-semibold text-sm mb-1">
        Approved Users
      </h4>

      {filteredUsers.length === 0 ? (
        <p className="text-xs text-gray-500 p-2">No matching users found.</p>
      ) : (
        filteredUsers.map((user: any) => (
          <div
            key={user.id}
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
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))
      )}
    </div>
  );
}