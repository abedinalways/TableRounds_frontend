import Image from "next/image";


type ReportedUser = {
  id: number;
  reportingUser: {
    name: string;
    image?: string;
    email: string;
  };
  reportedUser: {
    name: string;
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
              <th className="p-4">Reported User</th>
              <th className="p-4">Reported User Email</th>
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
                    className="rounded-full"
                  />
                  {item.reportingUser.name}
                </td>

                <td className="p-4">{item.reportingUser.email}</td>

                <td className="p-4 cursor-pointer flex items-center gap-2 font-medium">
                  <Image
                    src={item.reportedUser.image ?? '/images/doc.png'}
                    alt={item.reportedUser.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {item.reportedUser.name}
                </td>

                <td className="p-4">{item.reportedUser.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
