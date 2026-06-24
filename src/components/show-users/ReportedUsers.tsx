'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import EyeIcon from '../reusable/icons/EyeIcon';
import {
  useGetReportedUsersQuery,
  useDeleteUserMutation,
} from '@/app/redux/api/userStatusApi';

type ReportedUser = {
  id: string;
  reportingUser: {
    name: string;
    id: string;
    avatar_url?: string;
    image?: string;
    email: string;
  };
  reportedUser: {
    name: string;
    id: string;
    avatar_url?: string;
    image?: string;
    email: string;
  };
};

type Props = {
  users: ReportedUser[];
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDeleteDialog({
  userName,
  onConfirm,
  onCancel,
  isLoading,
}: {
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 font-[manrope]">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-[#01281e] text-lg font-bold">Delete User?</h3>
          <p className="text-gray-500 text-sm">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-gray-800">{userName}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isLoading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReportedUsers({
  users,
  page = 1,
  total,
  limit = 10,
  onPageChange,
}: Props) {
  const router = useRouter();
  const { data: reportedData } = useGetReportedUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [pendingDelete, setPendingDelete] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / limit));

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange?.(safePage);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser(pendingDelete.userId).unwrap();
      toast.success(`${pendingDelete.userName} has been deleted`);
      setPendingDelete(null);
    } catch {
      toast.error('Failed to delete user. Please try again.');
    }
  };

  return (
    <>
      {pendingDelete && (
        <ConfirmDeleteDialog
          userName={pendingDelete.userName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
          isLoading={isDeleting}
        />
      )}

      <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
        <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
          Users Reported
        </div>

        <div className="rounded-t-[8px] overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-[#01503b] text-white h-[70px]">
              <tr className="text-left">
                <th className="p-4">Reporting User</th>
                <th className="p-4">Reporting User Email</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Reported User</th>
                <th className="p-4">Reported User Email</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-400 text-sm"
                  >
                    No reported users found.
                  </td>
                </tr>
              )}

              {users.map(item => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Image
                        src={item.reportingUser.image ?? '/images/doc.png'}
                        alt={item.reportingUser.name}
                        width={32}
                        height={32}
                        className="rounded-full aspect-square object-cover shrink-0"
                        unoptimized
                      />
                      {item.reportingUser.name}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.reportingUser.email}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/dashboard/admin/user-profile/${item.reportingUser.id}`}
                    >
                      <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2 hover:bg-[#b8dfd5] transition-colors">
                        <EyeIcon /> Profile
                      </button>
                    </Link>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Image
                        src={item.reportedUser.image ?? '/images/doc.png'}
                        alt={item.reportedUser.name}
                        width={32}
                        height={32}
                        className="rounded-full aspect-square object-cover shrink-0"
                        unoptimized
                      />
                      {item.reportedUser.name}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.reportedUser.email}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => {
                        const reportMatch = reportedData?.data?.find(
                          report => report.id === item.id,
                        );
                        const cId = reportMatch?.conversation_id;
                        if (cId) {
                          router.push(
                            `/dashboard/admin/reported-conversation/${cId}`,
                          );
                        } else {
                          toast.error(
                            'Conversation not found for this report.',
                          );
                        }
                      }}
                      className="px-3 py-1.5 bg-[#01503b] text-white rounded-md text-sm font-semibold hover:bg-[#01382a] cursor-pointer transition-colors whitespace-nowrap"
                    >
                      View Conversation
                    </button>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        setPendingDelete({
                          userId: item.reportedUser.id,
                          userName: item.reportedUser.name,
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination — only added here */}
        <div className="flex flex-wrap justify-end items-center gap-2 mt-4 text-[#01281e]">
          <button
            onClick={() => goToPage(1)}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            First
          </button>

          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            Prev
          </button>

          <span className="text-sm px-2 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            Next
          </button>

          <button
            onClick={() => goToPage(totalPages)}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
}
