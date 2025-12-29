// components/admin/RecentActivity.tsx
import { Activity } from '@/types/admin';

type Props = {
  activities: Activity[];
};

export function RecentActivity({ activities }: Props) {
  return (
    <div className="bg-white rounded-lg shadow h-full">
      <div className="p-4 font-bold text-[20px] leading-[150%]">Recent Activity</div>

      <div className="p-4 space-y-3 text-sm">
        {activities.map(a => (
          <div key={a.id} className="bg-gray-100 border-black border-l-[4px] rounded-[12px] p-3">
            <p className="font-medium">{a.message}</p>
            <span className="text-xs text-gray-500">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
