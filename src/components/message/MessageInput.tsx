'use client';

import { useEffect, useRef, useState } from 'react';
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
import { LiveWaveform } from '../ui/live-waveform';
import Image from 'next/image';
import { Trash2, Square } from 'lucide-react';

export default function MessageInput() {
  const { sendMessage, setTyping } = useChat();

  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Microphone access denied or failed:', error);
    }
  };

  const stopRecording = (): Promise<File | null> => {
    return new Promise(resolve => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder) {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: 'audio/webm',
        });

        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        resolve(audioFile);
      };

      mediaRecorder.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    });
  };

  const handleRecordButton = async () => {
    if (isRecording) {
      return;
    }
    await startRecording();
  };

  const handleSendRecording = async () => {
    const file = await stopRecording();
    if (!file) return;

    setAttachments(prev => [...prev, file]);
    setRecordingTime(0);
  };

  const handleCancelRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
    }

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    audioChunksRef.current = [];

    setIsRecording(false);
    setRecordingTime(0);

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setAttachments(prev => [...prev, ...Array.from(files)]);
    setFileInputKey(prev => prev + 1);
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    await sendMessage(input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleCancelAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleViewAttachment = (file: File) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  return (
    <div className="relative">
      {attachments.length > 0 && (
        <div className="pb-2 flex gap-2 flex-wrap absolute top-0 -translate-y-full left-0">
          {attachments.map((file, i) => {
            const isImage =
              file.type.includes('image') ||
              file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            const isPdf = file.type === 'application/pdf';

            return (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-white shadow"
              >
                <span className="truncate max-w-[120px]">{file.name}</span>

                <button
                  onClick={() => handleCancelAttachment(i)}
                  className="text-red-500"
                >
                  ✕
                </button>

                {isImage && (
                  <button
                    onClick={() => handleViewAttachment(file)}
                    className="text-blue-500"
                  >
                    View
                  </button>
                )}

                {isPdf && (
                  <button
                    onClick={() =>
                      window.open(URL.createObjectURL(file), '_blank')
                    }
                    className="text-blue-500"
                  >
                    Open PDF
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-6 max-w-[90vw] max-h-[90vh]">
            {selectedFile.type.includes('image') ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt={selectedFile.name}
                width={800}
                height={600}
                className="object-contain rounded-lg"
                unoptimized
              />
            ) : selectedFile.type === 'application/pdf' ? (
              <iframe
                src={URL.createObjectURL(selectedFile)}
                className="w-[80vw] h-[80vh]"
                title="PDF Preview"
              />
            ) : (
              <p>File type not supported for preview</p>
            )}

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isRecording ? (
        <div className="h-full py-4 px-4 input-bg rounded-[14px] flex items-center gap-3 shadow-sm">
          <button
            type="button"
            onClick={handleCancelRecording}
            className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
          >
            <Trash2 size={18} />
          </button>

          <div className="flex items-center gap-2 min-w-[72px] text-[#35664f] font-semibold tabular-nums">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            {formatTime(recordingTime)}
          </div>

          <div className="flex-1 h-[44px] rounded-full bg-white px-4 flex items-center overflow-hidden">
            <LiveWaveform
              active={isRecording}
              height={28}
              barWidth={3}
              barGap={2}
              mode="static"
              fadeEdges
              barColor="#35664f"
            />
          </div>

          <button
            type="button"
            onClick={handleSendRecording}
            className="w-11 h-11 rounded-full bg-[#01503b] text-white flex items-center justify-center hover:scale-[1.03] transition"
          >
            <Square size={16} fill="currentColor" />
          </button>
        </div>
      ) : (
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
            <button
              type="button"
              onClick={handleRecordButton}
              className="px-3 text-[#35664f]"
            >
              <VoiceIcon className="cursor-pointer" />
            </button>

            <Button size="icon" className="rounded-full" onClick={handleSend}>
              <ArrowUp />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      )}
    </div>
  );
}
