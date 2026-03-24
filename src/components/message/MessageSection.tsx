// 'use client';

// import Image from 'next/image';
// import { useEffect, useRef } from 'react';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { useSelector } from 'react-redux';
// import { AudioBubble } from './AudioBubble';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { FileIcon } from 'lucide-react';

// interface AuthState {
//   user?: { id: string };
//   auth?: { user?: { id: string } };
// }

// interface RootState {
//   auth?: AuthState;
// }

// export default function MessageSection() {
//   const { messages } = useChat();
//   console.log(messages,'fgfgfgfgfgfgfgfgd')
//   const endRef = useRef<HTMLDivElement>(null);

//   const me = useMeQuery();

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages.length]);

//   return (
//     <div className="flex flex-col p-4 overflow-y-auto space-y-3">
//       {[...messages]
//         .sort(
//           (a, b) =>
//             new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
//         )
//         .map(msg => {
//           const isMe = msg?.sender?.id === me.data?.id;

//           return (
//             <div
//               key={msg.id}
//               className={`flex items-end gap-2 ${
//                 isMe ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               {/* Avatar */}
//               {!isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}

//               {/* Message Bubble */}
//               <div
//                 className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm
//                 ${
//                   isMe
//                     ? 'bg-[#095f48] text-white rounded-br-sm'
//                     : 'bg-gray-100 text-[#003329] rounded-bl-sm'
//                 }`}
//               >
//                 {/* Text Message */}
//                 {msg.message && (
//                   <p className="whitespace-pre-wrap break-words leading-relaxed">
//                     {msg.message}
//                   </p>
//                 )}

//                 {/* Attachments */}
//                 {msg.attachments?.length > 0 && (
//                   <div className="mt-2 space-y-2">
//                     {msg.attachments.map(file => {
//                       const isImage =
//                         file.type?.includes('image') ||
//                         file.file_url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

//                       const isAudio =
//                         file.type?.includes('audio') ||
//                         file.file_url?.match(/\.(mp3|wav|webm|ogg)$/i);

//                       if (isImage) {
//                         return (
//                           <Image
//                             key={file.id}
//                             src={file.file_url}
//                             alt={file.name}
//                             width={280}
//                             height={200}
//                             unoptimized
//                             className="rounded-xl object-cover max-h-[260px] cursor-pointer hover:opacity-90 transition"
//                           />
//                         );
//                       }

//                       if (isAudio) {
//                         return (
//                           <AudioBubble key={file.id} src={file.file_url} />
//                         );
//                       }

//                       return (
//                         <a
//                           key={file.id}
//                           href={file.file_url}
//                           target="_blank"
//                           className="flex items-center gap-2 text-xs underline hover:text-blue-500"
//                         >
//                           <FileIcon className="w-4 h-4 text-gray-400" />
//                           {file.name}
//                         </a>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Time + Status */}
//                 <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
//                   <span>
//                     {new Date(msg.created_at).toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </span>

//                   {/* Message Status */}
//                   {isMe && (
//                     <span>
//                       {msg.status === 'SENDING' && '⏳'}
//                       {msg.status === 'SENT' && '✓'}
//                       {msg.status === 'DELIVERED' && '✓✓'}
//                       {msg.status === 'SEEN' && (
//                         <span className="text-blue-400">✓✓</span>
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* My avatar (optional) */}
//               {isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}
//             </div>
//           );
//         })}

//       <div ref={endRef} />
//     </div>
//   );
// }

// 'use client';

// import Image from 'next/image';
// import { useEffect, useRef } from 'react';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { AudioBubble } from './AudioBubble';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { FileIcon } from 'lucide-react';
// import TestResultCard from '../test-complete/TestResultCard';

// interface AuthState {
//   user?: { id: string };
//   auth?: { user?: { id: string } };
// }

// interface RootState {
//   auth?: AuthState;
// }

// export default function MessageSection() {
//   const { messages } = useChat();
//   const endRef = useRef<HTMLDivElement>(null);

//   const me = useMeQuery();

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages.length]);

//   // const renderMessage = (msg: any) => {
//   //   if (!msg.message) return null;

//   //   try {
//   //     const parsed = JSON.parse(msg.message);

//   //     if (parsed?.type === 'test_result') {
//   //       return <TestResultCard {...parsed.data} />;
//   //     }
//   //   } catch (e) {
//   //     // normal message
//   //   }

//   //   return (
//   //     <p className="whitespace-pre-wrap break-words leading-relaxed">
//   //       {msg.message}
//   //     </p>
//   //   );
//   // };
//   const renderMessage = (msg: any) => {
//     if (!msg.message) return null;

//     try {
//       const parsed = JSON.parse(msg.message);

//       if (parsed?.type === 'test_result') {
//         return (
//           <div className="p-0 bg-transparent">
//             <TestResultCard {...parsed.data} />
//           </div>
//         );
//       }
//     } catch {}

//     return (
//       <p className="whitespace-pre-wrap break-words leading-relaxed">
//         {msg.message}
//       </p>
//     );
//   };
//   return (
//     <div className="flex flex-col p-4 overflow-y-auto space-y-3">
//       {[...messages]
//         .sort(
//           (a, b) =>
//             new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
//         )
//         .map(msg => {
//           const isMe = msg?.sender?.id === me.data?.id;

//           return (
//             <div
//               key={msg.id}
//               className={`flex items-end gap-2 ${
//                 isMe ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               {/* Avatar */}
//               {!isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}

//               {/* Message Bubble */}
//               <div
//                 className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm
//                 ${
//                   isMe
//                     ? 'bg-[#095f48] text-white rounded-br-sm'
//                     : 'bg-gray-100 text-[#003329] rounded-bl-sm'
//                 }`}
//               >
//                 {/* Message Content */}
//                 {msg.message && renderMessage(msg)}

//                 {/* Attachments */}
//                 {msg.attachments?.length > 0 && (
//                   <div className="mt-2 space-y-2">
//                     {msg.attachments.map(file => {
//                       const isImage =
//                         file.type?.includes('image') ||
//                         file.file_url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

//                       const isAudio =
//                         file.type?.includes('audio') ||
//                         file.file_url?.match(/\.(mp3|wav|webm|ogg)$/i);

//                       if (isImage) {
//                         return (
//                           <Image
//                             key={file.id}
//                             src={file.file_url}
//                             alt={file.name}
//                             width={280}
//                             height={200}
//                             unoptimized
//                             className="rounded-xl object-cover max-h-[260px] cursor-pointer hover:opacity-90 transition"
//                           />
//                         );
//                       }

//                       if (isAudio) {
//                         return (
//                           <AudioBubble key={file.id} src={file.file_url} />
//                         );
//                       }

//                       return (
//                         <a
//                           key={file.id}
//                           href={file.file_url}
//                           target="_blank"
//                           className="flex items-center gap-2 text-xs underline hover:text-blue-500"
//                         >
//                           <FileIcon className="w-4 h-4 text-gray-400" />
//                           {file.name}
//                         </a>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Time + Status */}
//                 <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
//                   <span>
//                     {new Date(msg.created_at).toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </span>

//                   {isMe && (
//                     <span>
//                       {msg.status === 'SENDING' && '⏳'}
//                       {msg.status === 'SENT' && '✓'}
//                       {msg.status === 'DELIVERED' && '✓✓'}
//                       {msg.status === 'SEEN' && (
//                         <span className="text-blue-400">✓✓</span>
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* My avatar */}
//               {isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}
//             </div>
//           );
//         })}

//       <div ref={endRef} />
//     </div>
//   );
// }

// 'use client';

// import Image from 'next/image';
// import { useEffect, useRef } from 'react';
// import { useChat } from '@/app/(Dashboard)/context/ChatContext';
// import { AudioBubble } from './AudioBubble';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { FileIcon } from 'lucide-react';
// import TestResultCard from '../test-complete/TestResultCard';

// export default function MessageSection() {
//   const { messages } = useChat();
//   const endRef = useRef<HTMLDivElement>(null);

//   const me = useMeQuery();

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages.length]);

//   // ✅ SAFE message renderer (no breaking attachments)
//   const renderMessage = (msg: any) => {
//     if (!msg.message) return null;

//     try {
//       const parsed = JSON.parse(msg.message);

//       if (parsed?.type === 'test_result') {
//         return <TestResultCard {...parsed.data} />;
//       }
//     } catch {}

//     return (
//       <p className="whitespace-pre-wrap break-words leading-relaxed">
//         {msg.message}
//       </p>
//     );
//   };

//   return (
//     <div className="flex flex-col p-4 overflow-y-auto space-y-3">
//       {[...messages]
//         .sort(
//           (a, b) =>
//             new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
//         )
//         .map(msg => {
//           const isMe = msg?.sender?.id === me.data?.id;

//           return (
//             <div
//               key={msg.id}
//               className={`flex items-end gap-2 ${
//                 isMe ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               {/* Avatar */}
//               {!isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}

//               {/* Message Bubble */}
//               <div
//                 className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm
//                 ${
//                   isMe
//                     ? 'bg-[#095f48] text-white rounded-br-sm'
//                     : 'bg-gray-100 text-[#003329] rounded-bl-sm'
//                 }`}
//               >
//                 {/* ✅ Message Content (only if exists) */}
//                 {msg.message ? renderMessage(msg) : null}

//                 {/* ✅ Attachments (always render independently) */}
//                 {msg.attachments && msg.attachments.length > 0 && (
//                   <div className={`space-y-2 ${msg.message ? 'mt-2' : ''}`}>
//                     {msg.attachments.map(file => {
//                       const isImage =
//                         file.type?.includes('image') ||
//                         file.file_url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

//                       const isAudio =
//                         file.type?.includes('audio') ||
//                         file.file_url?.match(/\.(mp3|wav|webm|ogg)$/i);

//                       if (isImage) {
//                         return (
//                           <Image
//                             key={file.id}
//                             src={file.file_url}
//                             alt={file.name}
//                             width={280}
//                             height={200}
//                             unoptimized
//                             className="rounded-xl object-cover max-h-[260px] cursor-pointer hover:opacity-90 transition"
//                           />
//                         );
//                       }

//                       if (isAudio) {
//                         return (
//                           <AudioBubble key={file.id} src={file.file_url} />
//                         );
//                       }

//                       return (
//                         <a
//                           key={file.id}
//                           href={file.file_url}
//                           target="_blank"
//                           className="flex items-center gap-2 text-xs underline hover:text-blue-500"
//                         >
//                           <FileIcon className="w-4 h-4 text-gray-400" />
//                           {file.name}
//                         </a>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Time + Status */}
//                 <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
//                   <span>
//                     {new Date(msg.created_at).toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </span>

//                   {isMe && (
//                     <span>
//                       {msg.status === 'SENDING' && '⏳'}
//                       {msg.status === 'SENT' && '✓'}
//                       {msg.status === 'DELIVERED' && '✓✓'}
//                       {msg.status === 'SEEN' && (
//                         <span className="text-blue-400">✓✓</span>
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* My avatar */}
//               {isMe && (
//                 <img
//                   width="24"
//                   height="24"
//                   src="https://img.icons8.com/color/24/google-contacts.png"
//                   alt="google-contacts"
//                 />
//               )}
//             </div>
//           );
//         })}

//       <div ref={endRef} />
//     </div>
//   );
// }

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { AudioBubble } from './AudioBubble';
import { useMeQuery } from '@/app/redux/api/authApi';
import { FileIcon } from 'lucide-react';
import TestResultCard from '../test-complete/TestResultCard';

export default function MessageSection() {
  const { messages } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const me = useMeQuery();
  // console.log(me, 'kkkkkkkkkkkk')
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ✅ message renderer (safe)
  const renderMessage = (msg: any) => {
    if (!msg.message) return null;

    try {
      const parsed = JSON.parse(msg.message);

      if (parsed?.type === 'test_result') {
        return <TestResultCard {...parsed.data} />;
      }
    } catch {}

    return (
      <p className="whitespace-pre-wrap break-words leading-relaxed">
        {msg.message}
      </p>
    );
  };

  return (
    <div className="flex flex-col p-4 overflow-y-auto space-y-3">
      {[...messages]
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map(msg => {
          const isMe = msg?.sender?.id === me.data?.id;
          console.log(msg?.sender?.id, 'sender id');
          console.log(me.data?.id, 'me id===============');
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar */}
              {!isMe && (
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/color/24/google-contacts.png"
                  alt="google-contacts"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm
                ${
                  isMe
                    ? 'bg-[#095f48] text-white rounded-br-sm'
                    : 'bg-gray-100 text-[#003329] rounded-bl-sm'
                }`}
              >
                {/* ✅ Text or Card */}
                {msg.message ? renderMessage(msg) : null}

                {/* ✅ Attachments FIXED */}
                {msg.attachments?.length > 0 && (
                  <div className={`space-y-2 ${msg.message ? 'mt-2' : ''}`}>
                    {msg.attachments.map(file => {
                      const fileUrl = file.file_url?.startsWith('http')
                        ? file.file_url
                        : `${BASE_URL}/${file.file_url}`;

                      const isImage =
                        file.type?.includes('image') ||
                        fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i);

                      const isAudio =
                        file.type?.includes('audio') ||
                        fileUrl.match(/\.(mp3|wav|webm|ogg)$/i);

                      if (isImage) {
                        return (
                          <Image
                            key={file.id}
                            src={fileUrl}
                            alt={file.name}
                            width={280}
                            height={200}
                            unoptimized
                            className="rounded-xl object-cover max-h-[260px] cursor-pointer hover:opacity-90 transition"
                          />
                        );
                      }

                      if (isAudio) {
                        return <AudioBubble key={file.id} src={fileUrl} />;
                      }

                      return (
                        <a
                          key={file.id}
                          href={fileUrl}
                          target="_blank"
                          className="flex items-center gap-2 text-xs underline hover:text-blue-500"
                        >
                          <FileIcon className="w-4 h-4 text-gray-400" />
                          {file.name}
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Time + Status */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                  <span>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {isMe && (
                    <span>
                      {msg.status === 'SENDING' && '⏳'}
                      {msg.status === 'SENT' && '✓'}
                      {msg.status === 'DELIVERED' && '✓✓'}
                      {msg.status === 'SEEN' && (
                        <span className="text-blue-400">✓✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* My avatar */}
              {isMe && (
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/color/24/google-contacts.png"
                  alt="google-contacts"
                />
              )}
            </div>
          );
        })}

      <div ref={endRef} />
    </div>
  );
}