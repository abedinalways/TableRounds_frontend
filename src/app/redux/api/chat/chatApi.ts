import { baseApi } from '../baseApi';

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
  status: string;
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

// ✅ Payload for admin message — mirrors SendMessagePayload
export interface SendAdminMessagePayload {
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
          formData.append('files', file);
        });

        return {
          url: '/chat/message',
          method: 'POST',
          body: formData,
        };
      },
      // No invalidatesTags — optimistic update in ChatContext handles immediate UI
      // Socket 'message' event from the server will confirm and update the cache
    }),

    sendAdminMessage: builder.mutation<
      ApiResponse<Message>,
      SendAdminMessagePayload
    >({
      query: ({ conversationId, receiverId, message, attachments }) => {
        const formData = new FormData();

        formData.append('conversation_id', conversationId);
        formData.append('receiver_id', receiverId);

        if (message?.trim()) formData.append('message', message);

        // Backend expects the field name "files" (same as regular message)
        attachments?.forEach(file => {
          formData.append('files', file);
        });

        return {
          url: '/chat/message/admin',
          method: 'POST',
          body: formData,
        };
      },
      // No invalidatesTags — optimistic update in ChatContext handles immediate UI
      // Socket 'message' event from the server will confirm and update the cache
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
      invalidatesTags: ['Chat'],
    }),

    createAdminConversation: builder.mutation<
      ApiResponse<Conversation>,
      { participant_id: string | null }
    >({
      query: body => ({
        url: '/chat/conversation/admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),

    deleteConversation: builder.mutation<ApiResponse<null>, string>({
      query: conversationId => ({
        url: `/chat/conversation/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendAdminMessageMutation,
  useCreateAdminConversationMutation,
  useDeleteConversationMutation,
} = chatApi;
