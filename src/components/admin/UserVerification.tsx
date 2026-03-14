'use client';

import { AdminUser } from '@/app/redux/api/userStatusApi';

import Image from 'next/image';
import EyeIcon from '../reusable/icons/EyeIcon';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  users: AdminUser[];
  onAction: (user: AdminUser, action: 'approved' | 'rejected') => void;
  loading?: boolean;
};



export function UserVerification({ users, onAction, loading }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
        <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
          Verifications Pending
        </div>

        <div className="rounded-t-[8px] overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#01503b] h-[89px] text-white">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Profile</th>
                <th className="p-3">Document</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id} className="last:border-b">
                  {/* Name + Avatar */}
                  <td className="p-4 font-medium flex gap-2 items-center">
                    <Image
                      src={user.avatar ?? '/images/doc.png'}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full cursor-pointer"
                      onClick={() =>
                        setPreviewImage(user.avatar ?? '/images/doc.png')
                      }
                    />
                    {user.name}
                  </td>

                  {/* Email */}
                  <td className="p-4 align-middle">{user.email}</td>

                  {/* Profile Button */}
                  <td className="truncate max-w-[200px]">
                    <Link href={`/dashboard/profile/${user.id}`}>
                      <button className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2">
                        <EyeIcon /> Profile
                      </button>
                    </Link>
                  </td>

                  {/* Document Button */}
                  <td className="p-4 align-middle">
                    <button
                      onClick={() =>
                        setPreviewImage(
                          user.verification_doc ?? '/images/doc.png',
                        )
                      }
                      className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2"
                    >
                      <EyeIcon /> View
                    </button>
                  </td>

                  {/* Approve / Reject */}
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        disabled={loading}
                        className="bg-[#01503b] rounded-[4px] py-1 px-2 text-white cursor-pointer disabled:opacity-50"
                        onClick={() => onAction(user, 'approved')}
                      >
                        Approve
                      </button>

                      <button
                        disabled={loading}
                        className="bg-white rounded-[4px] py-1 px-2 cursor-pointer text-[#01503b] border border-[#01503b] disabled:opacity-50"
                        onClick={() => onAction(user, 'rejected')}
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
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-[90vw] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={previewImage}
              alt="Preview"
              width={400}
              height={400}
              className="object-contain rounded-lg"
            />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
