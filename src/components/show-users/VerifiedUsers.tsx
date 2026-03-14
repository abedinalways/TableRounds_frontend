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
type Props = {
  users: VerifiedUser[];
  onDelete: (id: string) => void;
};

export function VerifiedUsers({ users, onDelete }: Props) {
  return (
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
                    src={user.image ?? '/images/doc.png'}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
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
                <td className="p-4">
                  <Link href="/dashboard/profile">
                    <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-3 flex items-center gap-2">
                      <EyeIcon /> View
                    </button>
                  </Link>
                </td>
                <td className="p-4">
                  <Link href="/dashboard/profile">
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
                        <Link href="/dashboard/profile">View profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard/support-message">Contact user</Link>
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
      </div>
    </div>
  );
}
