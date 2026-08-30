// MobileSpecialityAccordion.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isNavItemActive } from './navbar.utils';
import type { SpecialityOption } from './navbar.types';

interface MobileSpecialityAccordionProps {
  options: SpecialityOption[];
  isLoading: boolean;
  onNavigate: () => void;
}

export default function MobileSpecialityAccordion({
  options,
  isLoading,
  onNavigate,
}: MobileSpecialityAccordionProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between hover:text-[#B79E6B] transition-colors"
      >
        Specialties
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-2 ml-3 flex flex-col gap-3 border-l border-white/20 pl-3">
          {isLoading ? (
            <span className="text-sm text-white/60">
              Loading specialties...
            </span>
          ) : (
            options.map(option => (
              <Link
                key={option.value}
                href={option.href}
                onClick={onNavigate}
                className={`text-sm transition-colors ${
                  isNavItemActive(pathname, option.href)
                    ? 'text-[#B79E6B] font-semibold'
                    : 'text-white/90 hover:text-[#B79E6B]'
                }`}
              >
                {option.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
