'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useDeleteConversationMutation } from '@/app/redux/api/chat/chatApi';
import { Trash2 } from 'lucide-react';

export default function MessageListSection() {
  const { conversations, selectConversation, activeConversationId } = useChat();
  const router = useRouter();

  // Fetching the current admin user data
  const { data: adminData } = useMeQuery();
  const [deleteConversation] = useDeleteConversationMutation();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();

    if (deleteConfirmId === conversationId) {
      // Second click — confirm delete
      try {
        await deleteConversation(conversationId).unwrap();
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
      setDeleteConfirmId(null);
    } else {
      // First click — show confirmation
      setDeleteConfirmId(conversationId);
    }
  };

  return (
    <>
      <h4 className="mb-3 text-green-900 font-semibold">All Messages</h4>

      <div className="space-y-3">
        {conversations.map(conv => {
          // 1. Identify the 'other user' (the person the admin is talking to)
          const otherUser =
            adminData?.id === conv.id
              ? conv.creator
              : conv.participant;

          // 2. Get the actual last message text
          const lastMessage =
            conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1].message
              : 'No messages yet';

          const isConfirming = deleteConfirmId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => {
                selectConversation(conv.id);
                // Ensure the path matches your Admin routing structure
                router.push(`/dashboard/admin/support-message/${conv.id}`);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer group ${
                activeConversationId === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Image
                // Use the user's actual avatar or a fallback
                src={
                  otherUser?.avatar_url ||
                  '/images/dashboard/message/doctor.png'
                }
                alt={otherUser?.name || 'User'}
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover"
                unoptimized
              />

              <div className="flex-1 truncate">
                <p className="text-sm font-medium">
                  {otherUser?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => handleDelete(e, conv.id)}
                className={`shrink-0 w-8 h-8  cursor-pointer rounded-full flex items-center justify-center transition-all ${
                  isConfirming
                    ? 'bg-red-500 text-white scale-110 '
                    : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'
                }`}
                title={isConfirming ? 'Click again to confirm delete' : 'Delete conversation'}
              >
                {isConfirming ? (
                  <span className="text-xs font-bold">✓</span>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}