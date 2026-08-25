'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { AudioBubble } from './AudioBubble';
import { useMeQuery } from '@/app/redux/api/authApi';
import { FileIcon, X } from 'lucide-react';
import TestResultCard from '../test-complete/TestResultCard';

export default function MessageSection() {
  const { messages } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const me = useMeQuery();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerOpen(false);
        setSelectedImage(null);
      }
    };

    if (viewerOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [viewerOpen]);

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

  const openViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className="flex flex-col p-4 overflow-y-auto space-y-3">
        {[...messages]
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          )
          .map(msg => {
            const isMe = msg?.sender?.id === me.data?.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMe && (
                  <Image
                    width="24"
                    height="24"
                    // Checks if the sender has an avatar, otherwise falls back to a clean placeholder img
                    src={
                      msg?.sender?.avatar_url || msg?.sender?.avatar ||
                      'https://img.icons8.com/color/24/google-contacts.png'
                    }
                    alt={msg?.sender?.name || 'User avatar'}
                    className="rounded-full aspect-square object-cover w-6 h-6"
                    unoptimized
                  />
                )}

                <div
                  className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm ${
                    isMe
                      ? 'bg-[#095f48] text-white rounded-br-sm'
                      : 'bg-gray-100 text-[#003329] rounded-bl-sm'
                  }`}
                >
                  {msg.message ? renderMessage(msg) : null}

                  {msg.attachments?.length > 0 && (
                    <div className={`space-y-2 ${msg.message ? 'mt-2' : ''}`}>
                      {msg.attachments.map((file: any) => {
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
                            <button
                              key={file.id}
                              type="button"
                              onClick={() => openViewer(fileUrl)}
                              className="group relative block overflow-hidden rounded-2xl focus:outline-none"
                            >
                              <Image
                                src={fileUrl}
                                alt={file.name || 'chat image'}
                                width={280}
                                height={200}
                                unoptimized
                                className="rounded-xl object-cover max-h-[260px] cursor-pointer hover:opacity-90 transition"
                              />

                              <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition duration-200" />
                            </button>
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
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs underline hover:text-blue-500"
                          >
                            <FileIcon className="w-4 h-4 text-gray-400" />
                            {file.name}
                          </a>
                        );
                      })}
                    </div>
                  )}

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

                {isMe && (
                  <Image
                    width="24"
                    height="24"
                    src={
                      me?.data?.avatar ||
                      'https://img.icons8.com/color/24/google-contacts.png'
                    }
                    alt=""
                    className="rounded-full aspect-square object-cover"
                    unoptimized
                  />
                )}
              </div>
            );
          })}

        <div ref={endRef} />
      </div>

      {viewerOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeViewer}
        >
          <button
            type="button"
            onClick={closeViewer}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={22} />
          </button>

          <div
            className="relative max-w-[95vw] max-h-[92vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[95vw] max-h-[92vh] object-contain rounded-xl shadow-2xl"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}