// MobileLegalAccordion.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isNavItemActive } from './navbar.utils';
import { legalOptions } from './navbar.constants';

interface MobileLegalAccordionProps {
  onNavigate: () => void;
}

export default function MobileLegalAccordion({
  onNavigate,
}: MobileLegalAccordionProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between hover:text-[#B79E6B] transition-colors"
      >
        Legal
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-2 ml-3 flex flex-col gap-3 border-l border-white/20 pl-3">
          {legalOptions.map(opt => (
            <Link
              key={opt.href}
              href={opt.href}
              onClick={onNavigate}
              className={`text-sm transition-colors ${
                isNavItemActive(pathname, opt.href)
                  ? 'text-[#B79E6B] font-semibold'
                  : 'text-white/90 hover:text-[#B79E6B]'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
