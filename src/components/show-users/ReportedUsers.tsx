import Image from "next/image";
import Link from "next/link";
import EyeIcon from "../reusable/icons/EyeIcon";


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
};

export function ReportedUsers({ users }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-[18px] font-[manrope]">
      <div className="mb-4 text-[#01281e] text-[20px] font-bold leading-[150%]">
        Users Reported
      </div>

      <div className="rounded-t-[8px] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-[#01503b] text-white h-[70px]">
            <tr className="text-left">
              <th className="p-4">Reporting User</th>
              <th className="p-4">Reporting User Email</th>
              <th className="p-4">Profile</th>
              <th className="p-4">Reported User</th>
              <th className="p-4">Reported User Email</th>
              <th className="p-4">Profile</th>
            </tr>
          </thead>

          <tbody>
            {users.map(item => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 flex items-center gap-2 font-medium cursor-pointer">
                  <Image
                    src={item.reportingUser.image ?? '/images/doc.png'}
                    alt={item.reportingUser.name}
                    width={32}
                    height={32}
                    className="rounded-full aspect-square object-cover"
                    unoptimized
                  />
                  {item.reportingUser.name}
                </td>

                <td className="p-4">{item.reportingUser.email}</td>

                <td className="p-4 align-middle">
                  <Link
                    href={`/dashboard/admin/user-profile/${item.reportingUser.id}`}
                  >
                    <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2">
                      <EyeIcon /> Profile
                    </button>
                  </Link>
                </td>

                <td className="p-4 cursor-pointer flex items-center gap-2 font-medium">
                  <Image
                    src={item.reportedUser.image ?? '/images/doc.png'}
                    alt={item.reportedUser.name}
                    width={32}
                    height={32}
                    className="rounded-full aspect-square object-cover"
                    unoptimized
                  />
                  {item.reportedUser.name}
                </td>

                <td className="p-4">{item.reportedUser.email}</td>
                <td className="p-4 align-middle">
                  <Link
                    href={`/dashboard/admin/user-profile/${item.reportedUser.id}`}
                  >
                    <button className="bg-[#cdebe3] text-[#01503b] cursor-pointer rounded-[4px] py-1 px-2 flex items-center gap-2">
                      <EyeIcon /> Profile
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
