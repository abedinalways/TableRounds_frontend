'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/redux/store';


import MessageListSection from '@/components/admin-message/MessageListSection';
import UserListSection from '@/components/admin-message/UserListSection'; 
import { MessageSquare, Users } from 'lucide-react';

export default function ChatLayout({ children }: React.PropsWithChildren) {
 
  const [sidebarView, setSidebarView] = useState<'chats' | 'users'>('chats');

  const activeConversationId = useSelector(
    (state: RootState) => state.chat.activeConversationId,
  );

  return (
      <section className="grid md:h-[calc(100dvh-190px)] grid-cols-12 md:gap-4 font-[manrope]">
        {/* Main Chat Area */}
        <div className="md:h-[calc(100dvh-100px)] md:col-span-9 col-span-12 bg-white md:p-6 p-2 md:grid md:grid-rows-[100px_1fr_86px] rounded-2xl shadow-lg border border-gray-100">
          {!activeConversationId ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center space-y-2">
                <p className="text-5xl font-bold text-green-900 p-6 w-full h-full opacity-20">
                  Support Message
                </p>
                <p className="text-gray-500">
                  Select a conversation or a user to start messaging
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Sidebar Area */}
        <aside className="md:col-span-3 col-span-12 mt-4 md:mt-0">
          <div className="rounded-2xl bg-white md:p-5 p-4 md:h-[calc(100dvh-100px)] flex flex-col shadow-lg border border-gray-100">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
              <button
                onClick={() => setSidebarView('chats')}
                className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  sidebarView === 'chats'
                    ? 'bg-white text-green-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare size={16} />
                Recent
              </button>
              <button
                onClick={() => setSidebarView('users')}
                className={`flex-1 flex items-center justify-center gap-2 cursor-pointer py-2 text-xs font-semibold rounded-lg transition-all ${
                  sidebarView === 'users'
                    ? 'bg-white text-green-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={16} />
                Users
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {sidebarView === 'chats' ? (
                <MessageListSection />
              ) : (
                <UserListSection />
              )}
            </div>
          </div>
        </aside>
      </section>
  );
}
