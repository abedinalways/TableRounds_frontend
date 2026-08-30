
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './navbar.constants';
import { isNavItemActive } from './navbar.utils';
import SpecialityDropdown from './SpecialityDropdown';
import LegalDropdown from './LegalDropdown';
import type { SpecialityOption } from './navbar.types';

interface DesktopNavProps {
  specialityOptions: SpecialityOption[];
  isLoadingSpecialties: boolean;
  speciality: string;
  onSpecialityChange: (value: string) => void;
}

export default function DesktopNav({
  specialityOptions,
  isLoadingSpecialties,
  speciality,
  onSpecialityChange,
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-[manrope] cursor-pointer">
      {navItems.map(item => (
        <li key={item.label}>
          {item.hasDropdown ? (
            item.dropdownKey === 'speciality' ? (
              <SpecialityDropdown
                options={specialityOptions}
                isLoading={isLoadingSpecialties}
                value={speciality}
                onValueChange={onSpecialityChange}
              />
            ) : (
              <LegalDropdown />
            )
          ) : (
            <Link
              href={item.href || '#'}
              className={`cursor-pointer transition-colors ${
                isNavItemActive(pathname, item.href)
                  ? 'text-[#B79E6B] font-semibold'
                  : 'text-white hover:text-[#B79E6B]'
              }`}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
