// 'use client';

// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { NotificationItem } from './NotificationItem';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
// import { X } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../app/redux/store';
// import { markAllAsRead } from '../../store/NotificationSlice';

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// export function NotificationSheet({ open, onClose }: Props) {
//   const dispatch = useDispatch();

//   const notifications = useSelector(
//     (state: RootState) => state.notifications.notifications,
//   );

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={value => {
//         if (!value) {
//           dispatch(markAllAsRead());
//           onClose();
//         }
//       }}
//     >
//       <SheetContent side="right" className="w-full sm:w-96 p-0 z-100">
//         <SheetHeader className="p-4 border-b relative">
//           <div className="flex items-center justify-between">
//             <SheetTitle className="text-base font-semibold">
//               Notifications
//             </SheetTitle>
//             <Button
//               size="icon"
//               variant="ghost"
//               onClick={() => {
//                 dispatch(markAllAsRead());
//                 onClose();
//               }}
//               className="absolute top-4 right-2 z-20 cursor-pointer"
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </SheetHeader>

//         <ScrollArea className="h-[calc(100vh-8rem)] p-3">
//           <div className="space-y-1">
//             {notifications.length > 0 ? (
//               notifications.map(notification => (
//                 <NotificationItem
//                   key={notification.id}
//                   notification={notification}
//                 />
//               ))
//             ) : (
//               <div className="text-center text-sm text-gray-500 py-10">
//                 No notifications found
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         <div className="border-t p-3">
//           <Button
//             variant="ghost"
//             className="w-full text-teal-600 hover:bg-teal-50 cursor-pointer"
//           >
//             View All
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/redux/store';
import { NotificationItem } from './NotificationItem';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationSheet({ open, onClose }: Props) {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  );

  // Handle marking a notification as read
  const handleRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification,
    );
    // Optionally: Update the state of notifications in Redux (or local state)
    // For now, we are doing it locally here for UI update only.
  };

  return (
    <Sheet
      open={open}
      onOpenChange={value => {
        if (!value) {
          onClose();
        }
      }}
    >
      <SheetHeader></SheetHeader>
      <SheetContent className="font-[manrope]">
        <ScrollArea className="h-[calc(100vh-8rem)] p-3 mt-16">
          <div className="space-y-1">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleRead} // Pass the onRead function to mark notifications as read
                />
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-10">
                No notifications found
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}