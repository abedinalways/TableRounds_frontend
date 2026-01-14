import { ChatProvider } from '@/app/(Dashboard)/context/ChatContext';
import MessageListSection from '@/components/message/MessageListSection';
import React from 'react';


export default function ChatLayout({ children }: React.PropsWithChildren) {
  return (
    <ChatProvider>
      <h2 className="text-[#01281e] text-[36px] md:text-[48px] font-bold font-[manrope] mt-6">
        Admin Messenger
      </h2>
      <section className="grid md:h-[calc(100dvh-140px)] grid-cols-12 md:gap-6 font-[manrope] ">
        <div className="md:h-[calc(100dvh-140px)]  md:col-span-8 col-span-12 bg-white md:p-8 p-2 md:grid md:grid-rows-[130px_1fr_86px] rounded-2xl shadow-lg">
          {children}
        </div>

        <aside className="md:col-span-4 col-span-12 mt-4 md:mt-0">
          <div className="rounded-2xl bg-white md:p-6 p-4 md:max-h-[calc(100dvh-140px)] overflow-y-auto">
            <MessageListSection />
          </div>
        </aside>
      </section>
    </ChatProvider>
  );
}
