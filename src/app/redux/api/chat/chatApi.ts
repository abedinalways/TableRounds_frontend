import { baseApi } from '../../api/baseApi';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  avatar_url?: string;
}

export interface ChatAttachment {
  id: string;
  file_url: string;
  type: string;
  name: string;
  size?: number;
}

export type Conversation = {
  id: string;
  creator_id: string;
  participant_id: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    avatar_url: string;
  };
  participant: {
    id: string;
    name: string;
    avatar: string;
    avatar_url: string;
  };
  messages: Array<{
    id: string;
    message: string;
    created_at: string;
  }>;
};

export interface Message {
  id: string;
  message: string | null;
  created_at: string;
  status: string; // "SENDING" | "SENT" etc
  sender: ChatUser;
  receiver: ChatUser;
  attachments: ChatAttachment[];
}

export interface SendMessagePayload {
  conversationId: string;
  receiverId: string;
  message?: string;
  attachments?: File[];
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getConversations: builder.query<ApiResponse<Conversation[]>, void>({
      query: () => ({
        url: '/chat/conversation',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),

    getMessages: builder.query<
      ApiResponse<Message[]>,
      { conversationId: string; limit: number }
    >({
      query: ({ conversationId, limit }) => ({
        url: '/chat/message',
        method: 'GET',
        params: {
          conversation_id: conversationId,
          limit,
        },
      }),

      // ✅ IMPORTANT: cache key = conversationId ONLY
      serializeQueryArgs: ({ queryArgs }) => queryArgs.conversationId,

      providesTags: (result, error, arg) => [
        { type: 'Chat', id: arg.conversationId },
      ],
    }),

    sendMessage: builder.mutation<ApiResponse<Message>, SendMessagePayload>({
      query: ({ conversationId, receiverId, message, attachments }) => {
        const formData = new FormData();

        formData.append('conversation_id', conversationId);
        formData.append('receiver_id', receiverId);

        if (message?.trim()) formData.append('message', message);

        attachments?.forEach(file => {
          // ✅ backend expects "files"
          formData.append('files', file);
        });

        return {
          url: '/chat/message',
          method: 'POST',
          body: formData,
        };
      },

      // async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
      //   const state: any = getState();
      //   const me = state.auth?.user || state.auth?.auth?.user;

      //   const tempId = `temp-${Date.now()}`;

      //   // ✅ Pass object with conversationId AND limit
      //   const patch = dispatch(
      //     chatApi.util.updateQueryData(
      //       'getMessages',
      //       { conversationId: arg.conversationId, limit: 50 },
      //       draft => {
      //         if (!draft?.data) draft.data = [];

      //         draft.data.push({
      //           id: tempId,
      //           message: arg.message ?? null,
      //           created_at: new Date().toISOString(),
      //           status: 'SENDING',
      //           sender: {
      //             id: me?.id ?? 'me',
      //             name: me?.name ?? 'Me',
      //             avatar_url: me?.avatar_url,
      //           },
      //           receiver: {
      //             id: arg.receiverId,
      //             name: '',
      //           },
      //           attachments: [],
      //         });
      //       },
      //     ),
      //   );

      //   try {
      //     const { data } = await queryFulfilled;

      //     dispatch(
      //       chatApi.util.updateQueryData(
      //         'getMessages',
      //         { conversationId: arg.conversationId, limit: 50 },
      //         draft => {
      //           if (!draft?.data) return;

      //           const idx = draft.data.findIndex(m => m.id === tempId);
      //           if (idx !== -1) {
      //             draft.data[idx] = data.data;
      //           } else {
      //             draft.data.push(data.data);
      //           }
      //         },
      //       ),
      //     );
      //   } catch (e) {
      //     patch.undo();
      //   }
      // },

      // invalidatesTags: (result, error, arg) => [
      //   { type: 'Chat', id: arg.conversationId },
      // ],
    }),

    createConversation: builder.mutation<
      ApiResponse<Conversation>,
      { participant_id: string }
    >({
      query: body => ({
        url: '/chat/conversation',
        method: 'POST',
        body,
      }),
    }),
    createAdminConversation: builder.mutation<
      ApiResponse<Conversation>,
      { user_id: string }
    >({
      query: body => ({
        url: '/chat/conversation/admin',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateAdminConversationMutation,
} = chatApi;
