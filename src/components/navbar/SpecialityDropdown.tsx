
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isNavItemActive } from './navbar.utils';
import type { SpecialityOption } from './navbar.types';

interface SpecialityDropdownProps {
  options: SpecialityOption[];
  isLoading: boolean;
  value: string;
  onValueChange: (value: string) => void;
}

export default function SpecialityDropdown({
  options,
  isLoading,
  value,
  onValueChange,
}: SpecialityDropdownProps) {
  const pathname = usePathname();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center cursor-pointer gap-1 focus:outline-none hover:text-[#B79E6B] transition-colors">
          Specialties
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white z-[70] font-[manrope] w-56">
        <DropdownMenuLabel>Select speciality</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="px-3 py-2 text-sm text-gray-500">
            Loading specialties...
          </div>
        ) : (
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            {options.map(option => (
              <Link key={option.value} href={option.href || '#'}>
                <DropdownMenuRadioItem
                  value={option.value}
                  className={`cursor-pointer ${
                    isNavItemActive(pathname, option.href)
                      ? 'text-[#B79E6B] font-semibold'
                      : ''
                  }`}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              </Link>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
