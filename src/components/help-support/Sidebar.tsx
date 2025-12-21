'use client';


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
          <button
            key={item.id}
           
            onClick={() => onChange(item.id)}
            className={` rounded-t-[16px] w-full text-center p-4 justify-start  ${
              active === item.id
                ? 'background text-white'
                : 'text-[#01281e] hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </aside>
    </div>
  );
}
