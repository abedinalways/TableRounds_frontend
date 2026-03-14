// 'use client';

// import { useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useDispatch } from 'react-redux';
// import { store, type AppDispatch } from '../../store';
// import { chatApi } from './chatApi';
// import type { ChatAttachment, Message } from './chatApi';
// import Cookies from 'js-cookie';
// import { authApi } from '../authApi';

// export type SocketMessage = {
//   from: string;
//   data: {
//     message: {
//       id: string;
//       message_id: string;
//       body_text: string;
//       from: string;
//       conversation_id: string;
//       created_at: string;
//       attachments: ChatAttachment[];
//     };
//   };
// };

// export function useChatSocket() {
//   const socketRef = useRef<Socket | null>(null);
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     // const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//     //   transports: ['websocket'],
//     //   auth: {
//     //     token: localStorage.getItem('token'),
//     //   },
//     // });

//     const token = Cookies.get('token');
//     console.log('==================  Connecting to socket with token:', token);

//     const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       extraHeaders: {
//         authorization: `Bearer ${token}`,
//       },
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log(' Socket Connected:', socket.id);
//     });
//     console.log('Initial messages:');

//     // socket.on('message', ({ data, from }: SocketMessage) => {
//     //   console.log(data, 'my message ================');
//     //   // alert('New message received: ' + data.message.body_text);
//     //   // dispatch(
//     //   //   chatApi.util.updateQueryData(
//     //   //     'getMessages',
//     //   //     { conversationId: message.conversationId, limit: 20 },
//     //   //     draft => {
//     //   //       if (!draft?.data) draft.data = [];

//     //   //       // avoid duplicates
//     //   //       const exists = draft.data.some(m => m.id === message.id);
//     //   //       if (!exists) {
//     //   //         draft.data.push(message);
//     //   //       }
//     //   //     },
//     //   //   ),
//     //   // );
//     //   const foo = {
//     //     id: '1',
//     //     message: 'rrrrrrrrr',
//     //     created_at: '',
//     //     status: '',

//     //     // sender: ChatUser;
//     //     // receiver: ChatUser;
//     //     attachments: [],
//     //     sender: {
//     //       id: '',
//     //       name: '',
//     //       avatar_url: '',
//     //     },
//     //     receiver: {
//     //       id: '',
//     //       name: '',
//     //       avatar_url: '',
//     //     },
//     //   };
//     //   dispatch(
//     //     chatApi.util.updateQueryData(
//     //       'getMessages',
//     //       { conversationId: data.message.conversation_id, limit: 50 },
//     //       draft => {
//     //         if (!draft?.data) return;

//     //         const idx = draft.data.findIndex(
//     //           m => m.id === data.message.conversation_id,
//     //         );
//     //         if (idx !== -1) {
//     //           draft.data[idx] = foo;
//     //         } else {
//     //           draft.data.push(foo);
//     //         }
//     //       },
//     //     ),
//     //   );
//     // });
//     socket.on('message', ({ data }: SocketMessage) => {
//       const msg = data.message;
//       const state = store.getState();

//       const me = authApi.endpoints.me.select()(state)?.data;
//       console.log('============== me', me);

//       const newMessage: Message = {
//         id: msg.message_id,
//         message: msg.body_text,
//         created_at: msg.created_at,
//         status: 'SENT',
//         attachments: msg.attachments,
//         sender: {
//           id: msg.from,
//           name: me?.name ?? '',
//           avatar_url: me?.avatar ?? '',
//         },
//         receiver: {
//           id: msg.from === me?.id ? '' : (me?.id ?? ''),
//           name: '',
//           avatar_url: '',
//         },
//       };
//       console.log(newMessage, 'newMessage');
//       dispatch(
//         chatApi.util.updateQueryData(
//           'getMessages',
//           { conversationId: msg.conversation_id, limit: 20 },
//           draft => {
//             if (!draft?.data) draft.data = [];

//             const exists = draft.data.some(m => m.id === newMessage.id);

//             if (!exists) {
//               draft.data.push(newMessage);
//             }
//           },
//         ),
//       );
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, [dispatch]);

//   const joinConversation = (conversationId: string) => {
//     socketRef.current?.emit('joinRoom', { room_id: conversationId });
//   };

//   return { joinConversation };
// }

'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { store, type AppDispatch } from '../../store';
import { chatApi } from './chatApi';
import type { ChatAttachment, Message } from './chatApi';
import { authApi } from '../authApi';
import { addNotification } from '@/store/NotificationSlice';

export type SocketMessage = {
  from: string;
  data: {
    message: {
      id: string;
      message_id: string;
      body_text: string;
      from: string;
      conversation_id: string;
      created_at: string;
      attachments: ChatAttachment[];
    };
  };
};

function createNotification(
  type: 'conversation' | 'approved' | 'rejected' | 'follow' | 'user-registered',
  text: string,
  userName = 'User',
  avatar = '/images/dashboard/message/doctor.png',
) {
  return {
    id: crypto.randomUUID(),
    type,
    message: text,
    timestamp: new Date().toISOString(),
    isRead: false,
    user: {
      name: userName,
      avatar,
      initials: userName[0],
    },
  };
}

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = Cookies.get('token');

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(' Socket Connected:', socket.id);
    });

    socket.onAny((event, data) => {
      console.log(' SOCKET EVENT:', event, data);
    });

    // =========================
    // MESSAGE EVENT
    // =========================

    socket.on('message', ({ data }: SocketMessage) => {
      const msg = data.message;
      const state = store.getState();

      const me = authApi.endpoints.me.select()(state)?.data;
      const conversations =
        chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

      const conv = conversations.find(c => c.id === msg.conversation_id);

      let senderName = 'User';
      let senderAvatar = '/images/dashboard/message/doctor.png';

      if (conv) {
        const sender =
          conv.creator_id === msg.from ? conv.creator : conv.participant;

        senderName = sender?.name || 'User';
        senderAvatar = sender?.avatar || '/images/dashboard/message/doctor.png';
      }

      const newMessage: Message = {
        id: msg.message_id,
        message: msg.body_text,
        created_at: msg.created_at,
        status: 'SENT',
        attachments: msg.attachments,
        sender: {
          id: msg.from,
          name: senderName,
          avatar_url: senderAvatar,
        },
        receiver: {
          id: msg.from === me?.id ? '' : (me?.id ?? ''),
          name: '',
          avatar_url: '',
        },
      };

      dispatch(
        chatApi.util.updateQueryData(
          'getMessages',
          { conversationId: msg.conversation_id, limit: 20 },
          draft => {
            if (!draft?.data) draft.data = [];

            const exists = draft.data.some(m => m.id === newMessage.id);

            if (!exists) {
              draft.data.push(newMessage);
            }
          },
        ),
      );

      // notification
      if (me?.id !== msg.from) {
        dispatch(
          addNotification(
            createNotification(
              'conversation',
              msg.body_text,
              senderName,
              senderAvatar,
            ),
          ),
        );
      }
    });

    // =========================
    // APPROVED
    // =========================

    socket.on('approved', data => {
      dispatch(
        addNotification(
          createNotification('approved', 'Your account has been approved'),
        ),
      );
    });

    // =========================
    // REJECTED
    // =========================

    socket.on('rejected', data => {
      dispatch(
        addNotification(
          createNotification('rejected', 'Your account has been rejected'),
        ),
      );
    });

    // =========================
    // FOLLOW
    // =========================

    socket.on('follow', data => {
      dispatch(
        addNotification(createNotification('follow', 'Someone followed you')),
      );
    });

    // =========================
    // CONVERSATION
    // =========================

    socket.on('conversation', data => {
      dispatch(
        addNotification(
          createNotification('conversation', 'You have a new conversation'),
        ),
      );
    });

    // =========================
    // USER REGISTERED (ADMIN)
    // =========================

    socket.on('user-registered', data => {
      dispatch(
        addNotification(
          createNotification('user-registered', 'A new user registered'),
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const joinConversation = (conversationId: string) => {
    socketRef.current?.emit('joinRoom', { room_id: conversationId });
  };

  return { joinConversation };
}
