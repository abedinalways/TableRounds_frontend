import MessageListSection from '@/components/message/MessageListSection';
import React from 'react';

export default function ChatLayout({ children }: React.PropsWithChildren) {
  return (
    <section className="grid h-[calc(100dvh-108px)] grid-cols-12 gap-6 font-[manrope]">
      <div className="h-[calc(100dvh-108px)] col-span-8 bg-white p-8 grid grid-rows-[190px_1fr_86px] rounded-2xl shadow-lg">
        {children}
      </div>

      <aside className="col-span-4">
        <div className="rounded-2xl bg-white p-6 max-h-[calc(100dvh-108px)] overflow-y-auto">
          <MessageListSection />
        </div>
      </aside>
    </section>
  );
}
