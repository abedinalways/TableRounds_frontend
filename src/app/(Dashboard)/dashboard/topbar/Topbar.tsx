// 'use client';

// import Image from 'next/image';
// import { Menu } from 'lucide-react';
// import { NotificationButton } from '@/components/topbar/NotificationButton';
// import { useMeQuery } from '@/app/redux/api/authApi';
// import { useNotificationSocket } from '@/app/socket/useNotificationSocket';
// import { useGetUserNotificationsQuery } from '@/app/redux/api/notificationApi';
// import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
// import Link from 'next/link';

// interface TopbarProps {
//   onMenuClick?: () => void;
// }

// export default function Topbar({ onMenuClick }: TopbarProps = {}) {
//   //
//   useChatSocket();
//   useGetUserNotificationsQuery();

//   const { data: user } = useMeQuery();
//   console.log(user, 'user data=====================')

//   console.log('TOPBAR USER:', user);
//   const avatar =
//     user?.avatar && user.avatar.startsWith('http')
//       ? new URL(user.avatar).href
//       : '/images/dashboard/doctor.png';

//   return (
//     <header className="sticky top-0 z-1000 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15">
//       {onMenuClick && (
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
//         >
//           <Menu className="w-5 h-5 text-gray-700" />
//         </button>
//       )}

//       <div className="flex items-center gap-3 ml-auto">
//         <NotificationButton />
//         <Link
//           href="/dashboard/user/my-profile "
//           className="cursor-pointer flex gap-2 items-center justify-between "
//         >
//           <Image
//             src={avatar}
//             width={32}
//             height={32}
//             alt=""
//             className="rounded-full aspect-square object-cover"
//             unoptimized
//           />
//           <span className="hidden sm:block font-semibold text-gray-700">
//             Dr. {user?.name}
//           </span>
//         </Link>
//       </div>
//     </header>
//   );
// }

'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { NotificationButton } from '@/components/topbar/NotificationButton';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetUserNotificationsQuery } from '@/app/redux/api/notificationApi';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import { useAppSelector } from '@/app/redux/hook';


interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  // sockets
  useChatSocket();
  useGetUserNotificationsQuery();

  const { data: user } = useMeQuery();

  // ✅ role from redux (fallback from API)
  const role = useAppSelector(state => state.auth.auth.role) || user?.type;

  // ✅ avatar fix
  const getImageUrl = (path?: string) => {
    if (!path) return '/images/dashboard/doctor.png';
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
  };

  const avatar = getImageUrl(user?.avatar);

  // ✅ role-based link
  const profileLink =
    role === 'admin'
      ? '/dashboard/admin/manage-settings'
      : '/dashboard/user/my-profile';

  return (
    <header className="sticky top-0 z-1000 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15">
      {/* Mobile menu */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <NotificationButton />

        <Link
          href={profileLink}
          className="cursor-pointer flex gap-2 items-center"
        >
          <Image
            src={avatar}
            width={32}
            height={32}
            alt="profile"
            className="rounded-full aspect-square object-cover"
            unoptimized
          />

          <span className="hidden sm:block font-semibold text-gray-700">
            {role === 'admin' ? '' : 'Dr.'} {user?.name}
          </span>
        </Link>
      </div>
    </header>
  );
}