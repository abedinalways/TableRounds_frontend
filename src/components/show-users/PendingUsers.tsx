
import { PendingUser } from '@/types/admin';

import Image from 'next/image';
import EyeIcon from '../reusable/icons/EyeIcon';

type Props = {
  users: PendingUser[];
  onApprove: (user: PendingUser) => void;
  onReject: (id: string) => void; 
};

export function PendingUsers({ users, onApprove, onReject }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
      <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
        Users Pending
      </div>
      <div className="rounded-t-[8px]  overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className=" bg-[#01503b] h-[89px] text-white ">
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
              <tr key={user.id} className="mx-auto last:border-b">
                <td className="p-4 font-medium flex gap-2 items-center ">
                  <Image
                    src={user.image ?? '/images/doc.png'}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {user.name}
                </td>
                <td className='p-4 align-middle"'>{user.email}</td>
                <td className="truncate max-w-[200px]">{user.location}</td>
                <td className="p-4 align-middle">
                  <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2">
                    <EyeIcon /> View
                  </button>
                </td>
                <td className="p-4 align-middle">
                  <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2">
                    <EyeIcon /> Profile
                  </button>
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
    </div>
  );
}
