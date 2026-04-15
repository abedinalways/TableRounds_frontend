// 'use client';

// import Image from 'next/image';
// // import { Input } from '../ui/input';
// // import { Search } from 'lucide-react';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useRouter } from 'next/navigation';
// import { useMeQuery } from '@/app/redux/api/authApi';

// export default function MessageListSection() {
//   const { conversations, selectConversation, activeConversationId } = useChat();
//   const router = useRouter();
//   const me = useMeQuery();
//   // console.log(conversations[0].messages[0].message,'llllllllldscdsasdaaaaaa============')
//   return (
//     <>
//       <h4 className=" mb-3 text-green-900 font-semibold">All Messages</h4>

//       {/* <div className="relative mb-4">
//         <Search
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           size={16}
//         />
//         <Input placeholder="Search messages..." className="pl-9" />
//       </div> */}

//       <div className="space-y-3">
//         {conversations.map(conv => (
//           <div
//             key={conv.id}
//             onClick={() => {
//               selectConversation(conv.id);
//               router.push(`/dashboard/user/messages/${conv.id}`);
//             }}
//             className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
//               activeConversationId === conv.id
//                 ? 'bg-gray-100'
//                 : 'hover:bg-gray-50'
//             }`}
//           >
//             <Image
//               src="/images/dashboard/message/doctor.png"
//               alt="user"
//               width={40}
//               height={40}
//               className="rounded-full"
//             />

//             <div className="flex-1 truncate">
//               <p className="text-sm font-medium">
//                 {me.data?.id === conv.participant.id
//                   ? conv.creator.name
//                   : conv.participant.name}
//                 {/* -{conv.id} */}
//               </p>
//               <p className="text-xs text-gray-500 truncate overflow-x-hidden">

//                 {conv.messages && conv.messages.length > 0
//                   ? conv.messages[conv.messages.length - 1].message
//                   : 'No messages yet'}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hook';
import { useMeQuery } from '@/app/redux/api/authApi';

export default function MessageListSection() {
  const { conversations, selectConversation, activeConversationId } = useChat();
  const activeConversation = conversations.find(
    conv => conv.id === activeConversationId,
  );
  console.log(
    activeConversation,
    'activeConversation=====================++++++++++++++++',
  );
  const { data: me } = useMeQuery();
 
  const router = useRouter();
  console.log(conversations, 'poiw wqwfo     4333333      qadfqw    qqqqqf================')
  const currentUser = useAppSelector(state => state.auth.user);
  console.log(currentUser?.id, '+=============09348ty095yn 5yn 5yn 5yn 5yn 5yn 5yn 8===========')

  return (
    <>
      <h4 className="mb-3 text-green-900 font-semibold">All Messages</h4>

      <div className="space-y-3">
        {conversations.map(conv => {
          const otherUser =
            currentUser?.id === conv.id
              ? conv.creator
              : conv.participant;
          console.log(otherUser, '??????????????????????')
          const lastMessage =
            conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1].message
              : 'No messages yet';

          return (
            <div
              key={conv.id}
              onClick={() => {
                selectConversation(conv.id);
                router.push(`/dashboard/user/messages/${conv.id}`);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                activeConversationId === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Image
                src={
                  otherUser?.avatar_url || '/images/img008.png'
                }
                alt="user"
                width={20}
                height={20}
                className="rounded-full aspect-square object-cover"
                unoptimized
              />

              <div className="flex-1 truncate">
                <p className="text-md font-bold">
                  {otherUser?.name || 'User'}
                </p>

                <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}