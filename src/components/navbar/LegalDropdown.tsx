
'use client';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isNavItemActive } from './navbar.utils';
import { legalOptions } from './navbar.constants';

export default function LegalDropdown() {
  const pathname = usePathname();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center cursor-pointer gap-1 focus:outline-none hover:text-[#B79E6B] transition-colors">
          Legal
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white font-[manrope] w-56">
        <DropdownMenuLabel>Legal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {legalOptions.map(opt => (
          <DropdownMenuItem
            key={opt.href}
            className={`cursor-pointer ${
              isNavItemActive(pathname, opt.href)
                ? 'text-[#B79E6B] font-semibold'
                : ''
            }`}
            asChild
          >
            <Link href={opt.href}>{opt.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
