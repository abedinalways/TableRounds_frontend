'use client';
import { VerifiedUser } from '@/types/admin';
import Image from 'next/image';
import EyeIcon from '../reusable/icons/EyeIcon';
import { MoreVertical } from 'lucide-react'; 
import FacebookIcon from '../reusable/icons/FacebookIcon';
import InstaIcon from '../reusable/icons/InstaIcon';
import LinkedInIcon from '../reusable/icons/LinkedInIcon';
import XIcon from '../reusable/icons/XIcon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useState } from 'react';
type Props = {
  users: VerifiedUser[];
  onDelete: (id: string) => void;
  page: number;
  total?: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function VerifiedUsers({
  users,
  onDelete,
  page,
  total,
  limit,

  onPageChange,
}: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <>
    <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
      <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
        Users Verified
      </div>
      <div className="rounded-t-[8px] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-[#01503b] h-[89px] text-white">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Location</th>

              <th className="p-3">Social media</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Profile</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr
              key={user.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <td className="p-4 font-medium flex gap-2 items-center">
                  <Image
                    src={user?.image ?? '/images/doc.png'}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full aspect-square object-cover"
                    unoptimized
                  />
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 truncate max-w-[150px]">{user.location}</td>

                <td className="p-4">
                  <div className="flex gap-3 text-[#01503b]">
                    {/* Replace with your actual social icons */}
                    <span className="cursor-pointer">
                      <FacebookIcon />
                    </span>
                    <span className="cursor-pointer">
                      <InstaIcon />
                    </span>
                    <span className="cursor-pointer">
                      <LinkedInIcon />
                    </span>
                    <span className="cursor-pointer">
                      <XIcon />
                    </span>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <button
                    onClick={() =>
                      setPreviewImage(
                        user.verifiy_document_url ?? '/images/doc.png',
                      )
                    }
                    className="bg-[#cdebe3] text-[#01503b] rounded-[4px] cursor-pointer py-1 px-2 flex items-center gap-2"
                    >
                    <EyeIcon /> View
                  </button>
                </td>
                <td className="p-4">
                  <Link href={`/dashboard/admin/user-profile/${user.id}`}>
                    <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-3 flex items-center gap-2">
                      <EyeIcon /> Profile
                    </button>
                  </Link>
                </td>
                <td className="p-4 text-center">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-500 hover:text-black cursor-pointer">
                        <MoreVertical size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/admin/user-profile/${user.id}`}>
                          View profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard/admin/support-message/${user.id}">
                          Contact user
                        </Link>
                      </DropdownMenuItem>
                      {/* implement delete user functionality */}
                      <DropdownMenuItem
                        onClick={() => onDelete(user.id)}
                        className=" cursor-pointer"
                        >
                        Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
            Prev
          </button>

          <span className="text-sm">Page {page}</span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={total ? page * limit >= total : false}
            className="px-3 py-1 border rounded cursor-pointer"
            >
            Next
          </button>
        </div>
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
                    className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            </>
  );
}
