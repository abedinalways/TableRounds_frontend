'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { AudioBubble } from './AudioBubble';
import { useMeQuery } from '@/app/redux/api/authApi';
import { FileIcon, X } from 'lucide-react';
import TestResultCard from '../test-complete/TestResultCard';

// ─── Date/time formatting helpers ────────────────────────────────────────────

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `Today ${timeStr}`;
  if (isYesterday) return `Yesterday ${timeStr}`;

  return `${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} ${timeStr}`;
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

function shouldShowDateSeparator(
  currentMsg: string,
  previousMsg: string | undefined,
): boolean {
  if (!previousMsg) return true;

  const current = new Date(currentMsg);
  const previous = new Date(previousMsg);

  return (
    current.getDate() !== previous.getDate() ||
    current.getMonth() !== previous.getMonth() ||
    current.getFullYear() !== previous.getFullYear()
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MessageSectionProps {
  /** Message id from a notification deep-link (?messageId=) to scroll to & highlight. */
  highlightMessageId?: string | null;
}

export default function MessageSection({
  highlightMessageId,
}: MessageSectionProps) {
  const { messages, activeConversationId } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: me } = useMeQuery();
  const prevMessagesLengthRef = useRef(0);

  // Deep-link highlight state (notification → jump to message)
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const suppressAutoScrollRef = useRef(false);
  const highlightAppliedRef = useRef(false);

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_ENDPOINT ||
    'http://localhost:4001';

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ── Force scroll to bottom whenever messages change ──────────────────
  useEffect(() => {
    // While a deep-linked message highlight is active, it controls scrolling
    if (suppressAutoScrollRef.current) return;

    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto', block: 'end' });
    });
  }, [messages, activeConversationId]);

  // ── Deep-link: scroll to & highlight the message from ?messageId= ────
  useEffect(() => {
    if (!highlightMessageId || highlightAppliedRef.current) return;
    if (!messages.length) return;

    highlightAppliedRef.current = true;
    suppressAutoScrollRef.current = true;

    const scrollTimer = setTimeout(() => {
      setHighlightId(highlightMessageId);
      document
        .getElementById(`msg-${highlightMessageId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);

    const clearTimer = setTimeout(() => {
      setHighlightId(null);
      suppressAutoScrollRef.current = false;
    }, 3500);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [highlightMessageId, messages]);

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

  const renderMessage = (msg: { message: string | null }) => {
    if (!msg.message) return null;

    try {
      const parsed = JSON.parse(msg.message);

      if (parsed?.type === 'test_result') {
        return <TestResultCard {...parsed.data} />;
      }
    } catch {
      // Not JSON — render as plain text
    }

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

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col p-4 overflow-y-auto space-y-1 max-h-[calc(100vh-220px)]"
      >
        {sortedMessages.map((msg, index) => {
          const isMe = msg?.sender?.id === me?.id;
          const prevMsg = index > 0 ? sortedMessages[index - 1] : undefined;
          const showDateSeparator = shouldShowDateSeparator(
            msg.created_at,
            prevMsg?.created_at,
          );

          return (
            <div key={msg.id} id={`msg-${msg.id}`}>
              {/* ── Date separator ─────────────────────────────────────────── */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 text-gray-500 text-[11px] font-medium px-3 py-1 rounded-full">
                    {formatDateSeparator(msg.created_at)}
                  </div>
                </div>
              )}

              {/* ── Message bubble with slide animation ────────────────────── */}
              <div
                className={`flex items-end gap-2 animate-message-in ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMe && (
                  <Image
                    width="24"
                    height="24"
                    src={msg?.sender?.avatar_url || '/images/doc.png'}
                    alt="avatar"
                    className="rounded-full aspect-square object-cover flex-shrink-0"
                    unoptimized
                  />
                )}

                <div
                  className={`relative px-4 py-3 rounded-2xl max-w-[70%] shadow-sm text-sm transition-all duration-300 ${
                    isMe
                      ? 'bg-[#095f48] text-white rounded-br-sm'
                      : 'bg-gray-100 text-[#003329] rounded-bl-sm'
                  } ${
                    highlightId === msg.id
                      ? 'ring-2 ring-amber-400 ring-offset-2'
                      : ''
                  }`}
                >
                  {msg.message ? renderMessage(msg) : null}

                  {msg.attachments?.length > 0 && (
                    <div className={`space-y-2 ${msg.message ? 'mt-2' : ''}`}>
                      {msg.attachments.map(
                        (file: {
                          id: string;
                          file_url: string;
                          type: string;
                          name: string;
                        }) => {
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
                            return (
                              <AudioBubble key={file.id} src={fileUrl} />
                            );
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
                        },
                      )}
                    </div>
                  )}

                  {/* ── Time + date with status ───────────────────────────── */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                    <span>
                      {formatMessageTime(msg.created_at)}
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
                      me?.avatar ||
                      'https://img.icons8.com/color/24/google-contacts.png'
                    }
                    alt=""
                    className="rounded-full aspect-square object-cover flex-shrink-0"
                    unoptimized
                  />
                )}
              </div>
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