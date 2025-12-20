'use client';
import { Button } from '@/components/ui/button';

type SidebarItem = { id: string; label: string };

type Props = {
  items: SidebarItem[];
  active: string;
  onChange: (id: string) => void;
};

export function Sidebar({ items, active, onChange }: Props) {
  return (
    <div>
      <aside className="h-[216px] md:w-[266px] card-bg rounded-lg space-y-2">
        {items.map(item => (
          <Button
            key={item.id}
            variant={active === item.id ? 'secondary' : 'ghost'}
            onClick={() => onChange(item.id)}
            className={` rounded-t-lg w-full justify-start text-left ${
              active === item.id
                ? 'background text-white'
                : 'text-[#01281e] hover:bg-white/10'
            }`}
          >
            {item.label}
          </Button>
        ))}
      </aside>
    </div>
  );
}
