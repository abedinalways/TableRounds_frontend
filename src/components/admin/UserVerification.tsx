// components/admin/UserVerification.tsx
import { Button } from '@/components/ui/button';
import { VerificationUser } from '@/types/admin';
import Image from 'next/image';

type Props = {
  users: VerificationUser[];
  onAction: (user: VerificationUser, action: 'approved' | 'rejected') => void;
};

export function UserVerification({ users, onAction }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
      <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
        User Verifications
      </div>
      <div className="rounded-t-[8px]  overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className=" bg-[#01503b] h-[89px] text-white ">
            <tr className="text-left text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Location</th>
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
                    className="rounded-full"
                  />
                  {user.name}
                </td>
                <td className='p-4 align-middle"'>{user.email}</td>
                <td className="truncate max-w-[200px]">{user.location}</td>
                <td className="p-4 align-middle">
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-700"
                      onClick={() => onAction(user, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAction(user, 'rejected')}
                    >
                      Reject
                    </Button>
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
