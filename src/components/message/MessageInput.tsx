'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';

import AttachmentIcon from '../reusable/icons/AttachmentIcon';
import { VoiceIcon } from '../reusable/icons/VoiceIcon';
import { ArrowUp } from '../reusable/icons/ArrowUpperButton';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';



export interface MessageInputProps {
  testCardData: {
    questions: number;
    correctPercentage: number;
    time: string;
    percentile: number;
    difficulty: string;
    category: string;
  };
  showTestCard: boolean;
}
export default function MessageInput() {
 
  const { sendMessage, setTyping } = useChat();
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });

      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

      setAttachments(prev => [...prev, audioFile]);

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  //
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setAttachments(prev => [...prev, ...Array.from(files)]);
    setFileInputKey(prev => prev + 1);
  };

  const handleSend = () => {
    sendMessage(input, attachments);
    setInput('');
    setAttachments([]);
  };

  return (
    <div className="relative">
    
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="pb-2 flex gap-2 flex-wrap absolute top-0 -translate-y-full left-0">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                onClick={() =>
                  setAttachments(prev => prev.filter((_, idx) => idx !== i))
                }
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <InputGroup className="h-full py-6 px-4 input-bg rounded-[10px]">
        <InputGroupAddon>
          <div
            className="w-[30px] h-[30px] flex items-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <AttachmentIcon />
          </div>

          <input
            key={fileInputKey}
            ref={fileRef}
            type="file"
            hidden
            multiple
            onChange={handleFileSelect}
          />
        </InputGroupAddon>

        <InputGroupInput
          className="placeholder:text-[18px] placeholder:text-[#35664f]"
          value={input}
          placeholder="Enter Message..."
          onChange={e => {
            setInput(e.target.value);
            setTyping(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <InputGroupAddon align="inline-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleRecording}
            className={isRecording ? 'text-red-500' : ''}
          >
            {/* voice recording function */}
            <VoiceIcon />
          </Button>
          <Button size="icon" className="rounded-full" onClick={handleSend}>
            <ArrowUp />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
