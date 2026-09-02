// 'use client';

// import Image from 'next/image';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useRouter } from 'next/navigation';
// import { useAppSelector } from '@/app/redux/hook';
// import { useMeQuery } from '@/app/redux/api/authApi';

// // Helper to generate a readable preview from any message string
// function getMessagePreview(message: string): { text: string; icon?: string } {
//   if (!message) return { text: 'No messages yet' };

//   try {
//     const parsed = JSON.parse(message);

//     if (parsed?.type === 'test_result' && parsed?.data) {
//       const { questions, difficulty, topics, score, percentile } = parsed.data;

//       const topicList = Array.isArray(topics)
//         ? topics.join(', ')
//         : (topics ?? '');
//       const difficultyList = Array.isArray(difficulty)
//         ? difficulty.join(', ')
//         : (difficulty ?? '');

//       const parts: string[] = [];
//       if (questions) parts.push(`${questions}Q`);
//       if (difficultyList) parts.push(difficultyList);
//       if (topicList) parts.push(topicList);
//       if (score !== undefined) parts.push(`Score: ${score}`);
//       if (percentile !== undefined) parts.push(`${percentile}%`);

//       return { text: parts.join(' · '), icon: '📋' };
//     }

//     // Fallback for other JSON types — show type nicely
//     if (parsed?.type) {
//       return { text: `Shared a ${parsed.type.replace(/_/g, ' ')}`, icon: '📎' };
//     }
//   } catch {
//     // Not JSON — plain text message, return as-is
//   }

//   return { text: message };
// }

// export default function MessageListSection() {
//   const { conversations, selectConversation, activeConversationId } = useChat();
//   const { data: me } = useMeQuery();
//   const activeConversation = conversations.find(
//     conv => conv.id === activeConversationId,
//   );

//   const participantId = activeConversation?.participant?.id;
//   const participant =
//     activeConversation?.creator?.id == me?.id
//       ? activeConversation?.participant?.name
//       : activeConversation?.creator?.name;

//   const participantAvatar =
//     activeConversation?.creator?.id == me?.id
//       ? activeConversation?.participant?.avatar_url
//       : activeConversation?.creator?.avatar_url;
//   const router = useRouter();
//   const currentUser = useAppSelector(state => state.auth.user);

//   return (
//     <>
//       <h4 className="mb-3 text-green-900 font-semibold">All Messages</h4>

//       <div className="space-y-3">
//         {conversations.map(conv => {
//           const otherUser =
//             currentUser?.id === conv.id ? conv.creator : conv.participant;

//           const rawMessage =
//             conv.messages && conv.messages.length > 0
//               ? conv.messages[conv.messages.length - 1].message
//               : '';

//           const preview = rawMessage
//             ? getMessagePreview(rawMessage)
//             : { text: 'No messages yet' };

//           return (
//             <div
//               key={conv.id}
//               onClick={() => {
//                 selectConversation(conv.id);
//                 router.push(`/dashboard/user/messages/${conv.id}`);
//               }}
//               className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
//                 activeConversationId === conv.id
//                   ? 'bg-gray-100'
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               <Image
//                 src={participantAvatar || '/images/img008.png'}
//                 alt="user"
//                 width={40}
//                 height={40}
//                 className="rounded-full aspect-square object-cover shrink-0"
//                 unoptimized
//               />

//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold truncate">
//                   {participant || 'User'}
//                 </p>

//                 <p className="text-xs text-gray-500 truncate">
//                   {preview.icon && <span className="mr-1">{preview.icon}</span>}
//                   {preview.text}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useDeleteConversationMutation } from '@/app/redux/api/chat/chatApi';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteNotificationModal from '@/components/notifications/DeleteNotificationModal';

function getMessagePreview(message: string): { text: string; icon?: string } {
  if (!message) return { text: 'No messages yet' };

  try {
    const parsed = JSON.parse(message);

    if (parsed?.type === 'test_result' && parsed?.data) {
      const { questions, difficulty, topics, score, percentile } = parsed.data;

      const topicList = Array.isArray(topics)
        ? topics.join(', ')
        : (topics ?? '');
      const difficultyList = Array.isArray(difficulty)
        ? difficulty.join(', ')
        : (difficulty ?? '');

      const parts: string[] = [];
      if (questions) parts.push(`${questions}Q`);
      if (difficultyList) parts.push(difficultyList);
      if (topicList) parts.push(topicList);
      if (score !== undefined) parts.push(`Score: ${score}`);
      if (percentile !== undefined) parts.push(`${percentile}%`);

      return { text: parts.join(' · '), icon: '📋' };
    }

    if (parsed?.type) {
      return { text: `Shared a ${parsed.type.replace(/_/g, ' ')}`, icon: '📎' };
    }
  } catch {
    
  }

  return { text: message };
}

export default function MessageListSection() {
  const { conversations, selectConversation, activeConversationId } = useChat();
  const { data: me } = useMeQuery();
  const router = useRouter();
  const [deleteConversation, { isLoading: isDeleting }] =
    useDeleteConversationMutation();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteConversation(deleteTarget.id).unwrap();
      toast.success('Conversation deleted');

      // If the deleted conversation was open, go back to the message list
      if (activeConversationId === deleteTarget.id) {
        router.push('/dashboard/user/messages');
      }
    } catch {
      toast.error('Failed to delete conversation. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <h4 className="mb-3 text-green-900 font-semibold">All Messages</h4>

      <div className="space-y-3">
        {conversations.map(conv => {
          
          const isCreator = conv.creator?.id === me?.id;
          const otherUser = isCreator ? conv.participant : conv.creator;
          const participantName = otherUser?.name || 'User';
          const participantAvatar =
            otherUser?.avatar_url || '/images/img008.png';

          const rawMessage =
            conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1].message
              : '';

          const preview = rawMessage
            ? getMessagePreview(rawMessage)
            : { text: 'No messages yet' };

          return (
            <div
              key={conv.id}
              onClick={() => {
                selectConversation(conv.id);
                router.push(`/dashboard/user/messages/${conv.id}`);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${
                activeConversationId === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Image
                src={participantAvatar}
                alt="user"
                width={40}
                height={40}
                className="rounded-full aspect-square object-cover shrink-0"
                unoptimized
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{participantName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {preview.icon && <span className="mr-1">{preview.icon}</span>}
                  {preview.text}
                </p>
              </div>

              {/* Delete button — opens the confirmation modal */}
              <button
                type="button"
                aria-label="Delete conversation"
                onClick={e => {
                  e.stopPropagation();
                  setDeleteTarget({
                    id: conv.id,
                    name: participantName,
                  });
                }}
                className="shrink-0 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-all bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <DeleteNotificationModal
        open={!!deleteTarget}
        mode="single"
        title="Delete Conversation"
        description={`Are you sure you want to delete the conversation with ${deleteTarget?.name ?? 'this user'}? All messages will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Conversation"
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}