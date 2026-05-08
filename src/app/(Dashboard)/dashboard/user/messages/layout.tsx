// 'use client';

// import { useSelector } from 'react-redux';
// import type { RootState } from '@/app/redux/store';
// import MessageListSection from '@/components/message/MessageListSection';
// // import { ChatProvider } from '@/app/(Dashboard)/context/ChatContext';

// export default function ChatLayout({ children }: React.PropsWithChildren) {
//   const activeConversationId = useSelector(
//     (state: RootState) => state.chat.activeConversationId,
//   );

//   return (
//     // <ChatProvider>
//     <section className="grid md:h-[calc(100dvh-190px)] grid-cols-12 md:gap-4 font-[manrope]">
//       <div className="md:h-[calc(100dvh-100px)] md:col-span-9 col-span-12 bg-white md:p-6 p-2 md:grid md:grid-rows-[100px_1fr_86px] rounded-2xl shadow-lg">
//         {!activeConversationId ? (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             <div className="text-center space-y-2">
//               <p className="text-2xl font-bold text-green-900  p-6 w-full h-full">
//                 Select a chat to start messaging
//               </p>
//             </div>
//           </div>
//         ) : (
//           children
//         )}
//       </div>

//       <aside className="md:col-span-3  col-span-12 mt-4 md:mt-0">
//         <div className="rounded-2xl bg-white md:p-6 p-4 md:max-h-[calc(100dvh-140px)] overflow-y-auto ">
//           <MessageListSection />
//         </div>
//       </aside>
//     </section>
//     // </ChatProvider>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import type { RootState } from '@/app/redux/store';
import MessageListSection from '@/components/message/MessageListSection';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';

function getRouteConversationId(params: Record<string, string | string[]>) {
  const possibleValue =
    params.conversationId || params.id || params.chatId || params.roomId;

  if (Array.isArray(possibleValue)) {
    return possibleValue[0];
  }

  return possibleValue;
}

export default function ChatLayout({ children }: React.PropsWithChildren) {
  const params = useParams<Record<string, string | string[]>>();
  const { selectConversation } = useChat();

  const activeConversationId = useSelector(
    (state: RootState) => state.chat.activeConversationId,
  );

  const routeConversationId = getRouteConversationId(params);

  useEffect(() => {
    if (!routeConversationId) return;
    if (activeConversationId === routeConversationId) return;

    selectConversation(routeConversationId);
  }, [routeConversationId, activeConversationId, selectConversation]);

  return (
    <section className="grid md:h-[calc(100dvh-190px)] grid-cols-12 md:gap-4 font-[manrope]">
      <div className="md:h-[calc(100dvh-100px)] md:col-span-9 col-span-12 bg-white md:p-6 p-2 md:grid md:grid-rows-[100px_1fr_86px] rounded-2xl shadow-lg">
        {!activeConversationId && !routeConversationId ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-green-900  p-6 w-full h-full">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      <aside className="md:col-span-3  col-span-12 mt-4 md:mt-0">
        <div className="rounded-2xl bg-white md:p-6 p-4 md:max-h-[calc(100dvh-140px)] overflow-y-auto ">
          <MessageListSection />
        </div>
      </aside>
    </section>
  );
}