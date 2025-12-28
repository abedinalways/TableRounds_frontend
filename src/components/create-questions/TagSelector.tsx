
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function TagSelector({
  label,
  options,
  selected,
  onChange,
}: TagSelectorProps) {
  return (
    <div className="space-y-2 p-4 bg-white border rounded-lg">
      <h3 className="text-md md:text-[20px] text-[#444950] font-bold  leading-[160%]">
        {label}
      </h3>
      <div className="flex flex-wrap gap-3 bg-[#f8f8f4] p-3 md:p-4 rounded-[8px] w-fit">
        {options.map(option => (
          <Badge
            key={option}
            variant={selected === option ? 'default' : 'secondary'}
            className={cn(
              'px-3 py-2 rounded-[4px] cursor-pointer transition-all text-sm md:text-[18px]',
              selected === option
                ? 'bg-[#01503b] hover:bg-[#013b2c]'
                : 'bg-white text-gray-600'
            )}
            onClick={() => onChange(option)}
          >
            {option} {selected === option && '✕'}
          </Badge>
        ))}
      </div>
    </div>
  );
}
