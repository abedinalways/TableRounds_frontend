'use client';

import React, { createContext, useContext, useState } from 'react';

export type Sender = 'me' | 'doctor';

export type CustomAttachment = {
  id: string;
  name: string;
  attachmentsType?: 'test-result' | 'file' | 'unknown';
  testId?: string;
};
export function createCustomAttachment(
  id: string,
  name: string,
  attachmentsType?: 'test-result' | 'file' | 'unknown',
  testId?: string
): CustomAttachment {
  return {
    id,
    attachmentsType,
    name,
    testId,
  };
}

export function isCustomAttachment(obj: unknown): obj is CustomAttachment {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    ((obj as Record<string, unknown>).attachmentsType === undefined ||
      ['test-result', 'file', 'unknown'].includes(
        (obj as Record<string, unknown>).attachmentsType as string
      )) &&
    ((obj as Record<string, unknown>).testId === undefined ||
      typeof (obj as Record<string, unknown>).testId === 'string')
  );
}
export type Message = {
  id: string;
  sender: 'me' | 'doctor';
  text?: string;
  attachments?: File[] | CustomAttachment[];
  createdAt: number;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
};

type ChatContextType = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  selectConversation: (id: string) => void;
  sendMessage: (text: string, attachments?: File[]) => void;
  isTyping: boolean;
  setTyping: (v: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Sheikh Abedin',
      avatar: '/images/dashboard/message/doctor.png',
      messages: [
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Hi! Did you see the latest research on TMJ disorders?',
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
        {
          id: 'm2',
          sender: 'me',
          text: 'Yes! The findings were fascinating. I can send you the full paper if you would like.',
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
        // {
        //   id: 'm1',
        //   sender: 'doctor',
        //   text: 'Hi! hav you any idea about it?',
        //   // eslint-disable-next-line react-hooks/purity
        //   createdAt: Date.now(),
        // },
        {
          id: 'm3',
          sender: 'doctor',
          text: 'Just wrapped up this Trauma block —60% correct. Curious how you would do.',
          attachments: [
            createCustomAttachment(
              'foo',
              'habijabi',
              'test-result',
              'test-id-1324'
            ),
          ],
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: '2',
      name: 'Sheikh A Dinar',
      avatar: '/images/dashboard/message/doctor.png',
      messages: [
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Hi! Did you see the latest research on TMJ disorders?',
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
        {
          id: 'm2',
          sender: 'me',
          text: 'Yes! The findings were fascinating. I can send you the full paper if you would like.',
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
        {
          id: 'm1',
          sender: 'doctor',
          text: 'Hi! hav you any idea about it?',
          // eslint-disable-next-line react-hooks/purity
          createdAt: Date.now(),
        },
        
      ],
    },
  ]);

  const [activeId, setActiveId] = useState('1');
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeId) ?? null;

  const selectConversation = (id: string) => setActiveId(id);

  const sendMessage = (text: string, attachments: File[] = []) => {
    if (!text.trim() && attachments.length === 0) return;

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: crypto.randomUUID(),
                  sender: 'me',
                  text: text || undefined,
                  attachments: attachments.length ? attachments : undefined,
                  createdAt: Date.now(),
                },
              ],
            }
          : conv
      )
    );

    setIsTyping(false);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        selectConversation,
        sendMessage,
        isTyping,
        setTyping: setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
