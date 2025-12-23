'use client';

import { Button } from '@/components/ui/button';

import { useEffect, useRef, useState } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import AttachmentIcon from '../reusable/icons/AttachmentIcon';
import { VoiceIcon } from '../reusable/icons/VoiceIcon';
import { ArrowUp } from '../reusable/icons/ArrowUpperButton';
type Message = {
  id: string;
  sender: 'me' | 'doctor';
  text?: string;
  attachments?: File[];
};
export default function MessageInput() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      text: 'Hi! Did you see the latest research on TMJ disorders?',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Yes! The findings were fascinating. I can send you the full paper if you would like.',
    },
    {
      id: '3',
      sender: 'doctor',
      text: 'That would be great! I am particularly interested in the surgical approaches.',
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    setInput(value);
    setIsTyping(true);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() && attachments.length === 0) return;

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: 'me',
        text: input,
        attachments: attachments,
      },
    ]);

    setInput('');
    setAttachments([]);
  };
  return (
    <div className="">
      {attachments.length > 0 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>

              <button
                className="text-red-500 text-xs"
                onClick={() =>
                  setAttachments(prev => prev.filter((_, i) => i !== index))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <InputGroup className="h-full py-6 px-4 input-bg rounded-[10px] text-[#35664f] ">
        <InputGroupAddon>
          <button className="w-10 h-10 flex items-center justify-center">
            <AttachmentIcon
              className="cursor-pointer "
              onClick={openFilePicker}
            />
          </button>
        </InputGroupAddon>
        <InputGroupInput
          className="placeholder:text-[#35664] placeholder:text-[18px]"
          type="text"
          value={input}
          placeholder={isTyping ? 'Someone is typing...' : 'Enter Message...'}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
              setIsTyping(false);
            }
          }}
        />

        <InputGroupAddon align="inline-end">
          {/* voice input */}
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <VoiceIcon />
          </Button>
          <Button
            size="icon"
            onClick={sendMessage}
            className="rounded-full cursor-pointer"
          >
            <ArrowUp />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
