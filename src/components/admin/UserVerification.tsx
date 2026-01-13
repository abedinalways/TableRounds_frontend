'use client'
import { VerificationUser } from '@/types/admin';

import Image from 'next/image';
import EyeIcon from '../reusable/icons/EyeIcon';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  users: VerificationUser[];
  onAction: (user: VerificationUser, action: 'approved' | 'rejected') => void;
};

export function UserVerification({ users, onAction }: Props) {
   const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <>
      <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
        <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
          Verifications Pending
        </div>
        <div className="rounded-t-[8px]  overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className=" bg-[#01503b] h-[89px] text-white ">
              <tr className="text-left text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Document</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id} className="mx-auto last:border-b">
                  <td className="p-4 font-medium flex gap-2 items-center ">
                    <Image
                      src={user.image ?? '/images/doc.png'}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full cursor-pointer"
                      onClick={() =>
                        setPreviewImage(user.image ?? '/images/doc.png')
                      }
                    />
                    {user.name}
                  </td>
                  <td className='p-4 align-middle"'>{user.email}</td>
                  <td className="truncate max-w-[200px]">
                    <Link href='/dashboard/profile'>
                      <button className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2">
                        <EyeIcon /> Profile
                      </button>
                    </Link>
                  </td>
                  <td className="p-4 align-middle">
                    <button className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2">
                      <EyeIcon /> View
                    </button>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        className="bg-[#01503b] rounded-[4px] py-1 px-2 text-white cursor-pointer"
                        onClick={() => onAction(user, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-white rounded-[4px] py-1 px-2 cursor-pointer text-[#01503b] border border-[#01503b]"
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
      {/*  */}
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
              alt="Profile Preview"
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
