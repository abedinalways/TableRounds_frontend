'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  AlertTriangle,
  CalendarDays,
  Mail,
  MessageSquare,
  Search,
  Shield,
  User,
  ArrowLeft,
} from 'lucide-react';
import { ChatProvider } from '@/app/(Dashboard)/context/ChatContext';
import { useGetReportedUsersQuery } from '@/app/redux/api/userStatusApi';
import { useGetMessagesQuery } from '@/app/redux/api/chat/chatApi';


// Route: /dashboard/reported-conversations/[id]
// Example usage: /dashboard/reported-conversations/cmnh04f3g001quwm0m3ibih8w

interface UserCard {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface ReportedUserItem {
  id: string;
  description?: string;
  created_at?: string;
  conversation_id: string | null;
  reporter: UserCard;
  reported: UserCard;
}

interface MessageUser {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

interface MessageItem {
  id: string;
  message: string;
  created_at: string;
  status: string;
  sender: MessageUser;
  receiver: MessageUser;
  attachments?: unknown[];
}

function formatDate(date?: string) {
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatShortDate(date?: string) {
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
      <div className="mb-4 rounded-2xl bg-slate-100 p-4">
        <MessageSquare className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function UserAvatar({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
        <User className="h-5 w-5 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
}

export default function ReportedConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string | undefined;

  const [search, setSearch] = useState('');

  const { data: reportedData, isLoading: reportsLoading } =
    useGetReportedUsersQuery(undefined);

  const reports: ReportedUserItem[] = useMemo(() => {
    return (reportedData?.data ?? []) as ReportedUserItem[];
  }, [reportedData]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filteredByConversation = reports.filter(
      item => item.conversation_id === conversationId,
    );

    if (!query) return filteredByConversation;

    return filteredByConversation.filter(item => {
      const haystack = [
        item.description,
        item.reporter?.name,
        item.reporter?.email,
        item.reported?.name,
        item.reported?.email,
        item.conversation_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [reports, search, conversationId]);

  const activeReport = filteredReports[0] ?? null;

  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesQuery(
      conversationId
        ? {
            conversationId,
            limit: 100,
          }
        : skipToken,
    );

  const messages: MessageItem[] = useMemo(() => {
    return (messagesData?.data ?? []) as MessageItem[];
  }, [messagesData]);

  return (
    <ChatProvider>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8 font-[manrope]">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#134e4a] p-6 text-white shadow-xl lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  <Shield className="h-4 w-4" />
                  Moderation Center
                </div>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Reported Conversation
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 lg:text-base">
                  Review the full conversation between the reporter and the
                  reported user before taking moderation action.
                </p>
              </div>

              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Reports
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Report Details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Conversation-specific moderation summary.
                    </p>
                  </div>
                </div>

                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search in this report"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4">
                {reportsLoading ? (
                  <div className="animate-pulse rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-slate-200" />
                        <div className="h-3 w-56 rounded bg-slate-200" />
                        <div className="h-3 w-32 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ) : activeReport ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Conversation ID
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-900">
                        {activeReport.conversation_id || 'N/A'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {activeReport.description || 'No reason provided'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={activeReport.reporter?.avatar_url}
                          alt={activeReport.reporter?.name || 'Reporter'}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Reporter
                          </p>
                          <h3 className="text-base font-bold text-slate-900">
                            {activeReport.reporter?.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {activeReport.reporter?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={activeReport.reported?.avatar_url}
                          alt={activeReport.reported?.name || 'Reported user'}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Reported User
                          </p>
                          <h3 className="text-base font-bold text-slate-900">
                            {activeReport.reported?.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {activeReport.reported?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {formatDate(activeReport.created_at)}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="Report not found"
                    description="No reported item matched this conversation ID."
                  />
                )}
              </div>
            </section>

            <section className="space-y-6">
              {activeReport ? (
                <>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          <AlertTriangle className="h-4 w-4 text-rose-500" />
                          Active moderation review
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          Chat History
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Messages exchanged between the reporter and the
                          reported user.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Reporter: {activeReport.reporter?.name}
                        </span>
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          Reported: {activeReport.reported?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Conversation Messages
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Loaded by conversation ID from the report.
                          </p>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {messages.length} messages
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[760px] space-y-4 overflow-y-auto bg-slate-50 p-5">
                      {messagesLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="mb-2 h-3 w-24 rounded bg-slate-200" />
                            <div className="h-20 w-[75%] rounded-3xl bg-slate-200" />
                          </div>
                        ))
                      ) : messages.length ? (
                        messages.map(message => {
                          const isReporter =
                            message.sender?.id === activeReport.reporter?.id;
                          const isReported =
                            message.sender?.id === activeReport.reported?.id;
                          const senderName =
                            message.sender?.name || 'Unknown User';

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isReporter ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-[85%] lg:max-w-[72%] ${isReporter ? 'items-start' : 'items-end'} flex flex-col`}
                              >
                                <div className="mb-2 flex items-center gap-2 px-1">
                                  <span className="text-xs font-semibold text-slate-700">
                                    {senderName}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                      isReporter
                                        ? 'bg-blue-100 text-blue-700'
                                        : isReported
                                          ? 'bg-rose-100 text-rose-700'
                                          : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {isReporter
                                      ? 'Reporter'
                                      : isReported
                                        ? 'Reported User'
                                        : 'Participant'}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {formatDate(message.created_at)}
                                  </span>
                                </div>

                                <div
                                  className={`rounded-3xl px-4 py-3 shadow-sm ${
                                    isReporter
                                      ? 'rounded-bl-md border border-blue-200 bg-white'
                                      : 'rounded-br-md bg-emerald-600 text-white'
                                  }`}
                                >
                                  <p
                                    className={`whitespace-pre-wrap break-words text-sm leading-6 ${
                                      isReporter
                                        ? 'text-slate-700'
                                        : 'text-white'
                                    }`}
                                  >
                                    {message.message || 'No message content'}
                                  </p>

                                  <div
                                    className={`mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs ${
                                      isReporter
                                        ? 'border-slate-200 text-slate-400'
                                        : 'border-white/20 text-white/80'
                                    }`}
                                  >
                                    <span>{message.status}</span>
                                    <span>
                                      {message.attachments?.length
                                        ? `${message.attachments.length} attachment(s)`
                                        : 'No attachments'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <EmptyState
                          title="No messages found"
                          description="This conversation ID exists, but no messages were returned from the API."
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="No report selected"
                  description="This conversation does not have a matching report item yet."
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
