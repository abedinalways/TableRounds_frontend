'use client';

import { PendingUser } from '@/types/admin';
import Image from 'next/image';
import EyeIcon from '../reusable/icons/EyeIcon';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  users: PendingUser[];
  onApprove: (user: PendingUser) => void;
  onReject: (id: string) => void;
  page: number;
  total?: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function PendingUsers({
  users,
  onApprove,
  onReject,
  page,
  total,
  limit,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / limit));
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(safePage);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
        <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
          Users Pending
        </div>

        <div className="rounded-t-[8px] overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#01503b] h-[89px] text-white">
              <tr className="text-left text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Document</th>
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="p-4 font-medium flex gap-2 items-center">
                    <Image
                      src={user?.image ?? '/images/doc.png'}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full aspect-square object-cover"
                      unoptimized
                    />
                    {user.name}
                  </td>

                  <td className="p-4 align-middle">{user.email}</td>

                  <td className="p-4 truncate max-w-[200px]">
                    {user.state}, {user.location}
                  </td>

                  <td className="p-4 align-middle">
                    <button
                      onClick={() =>
                        setPreviewImage(
                          user.verifiy_document_url ?? '/images/documents.jpg',
                        )
                      }
                      className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2"
                    >
                      <EyeIcon /> View
                    </button>
                  </td>

                  <td className="p-4 align-middle">
                    <Link href={`/dashboard/admin/user-profile/${user.id}`}>
                      <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2">
                        <EyeIcon /> Profile
                      </button>
                    </Link>
                  </td>

                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(user)}
                        className="bg-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(user.id)}
                        className="bg-white rounded-[4px] cursor-pointer py-1 px-2 text-[#01503b] border border-[#01503b]"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-lg p-6 max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            {previewImage.toLowerCase().endsWith('.pdf') ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-700 font-medium">
                  PDF Preview not available
                </p>

                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#01503b] text-white px-4 py-2 rounded-md hover:bg-[#013e2f] transition"
                >
                  Open PDF Document
                </a>
              </div>
            ) : (
              <Image
                src={previewImage}
                alt="Verification Document"
                width={700}
                height={700}
                className="object-contain rounded-lg max-h-[80vh]"
                unoptimized
              />
            )}

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
