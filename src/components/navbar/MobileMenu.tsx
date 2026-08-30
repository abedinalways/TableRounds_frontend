// MobileMenu.tsx
'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import NavLogo from './NavLogo';
import AuthButtons from './AuthButtons';
import MobileSpecialityAccordion from './MobileSpecialityAccordion';
import MobileLegalAccordion from './MobileLegalAccordion';
import MobileUserPanel from './MobileUserPanel';
import { navItems } from './navbar.constants';
import { isNavItemActive } from './navbar.utils';
import type { CurrentUser, SpecialityOption } from './navbar.types';
import { NavbarAuthToken } from './useNavbarAuth';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: NavbarAuthToken;
  currentUser?: CurrentUser;
  isLoggingOut: boolean;
  onLogout: () => void;
  specialityOptions: SpecialityOption[];
  isLoadingSpecialties: boolean;
}

export default function MobileMenu({
  open,
  onOpenChange,
  token,
  currentUser,
  isLoggingOut,
  onLogout,
  specialityOptions,
  isLoadingSpecialties,
}: MobileMenuProps) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="text-white"
        >
          <Menu className="w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#02533d] border-0 w-[280px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <NavLogo variant="mobile" />

          <nav className="mt-4">
            <ul className="flex flex-col gap-4 text-white font-[manrope]">
              {navItems.map(item => (
                <li key={item.label}>
                  {item.hasDropdown ? (
                    item.dropdownKey === 'speciality' ? (
                      <MobileSpecialityAccordion
                        options={specialityOptions}
                        isLoading={isLoadingSpecialties}
                        onNavigate={close}
                      />
                    ) : (
                      <MobileLegalAccordion onNavigate={close} />
                    )
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={close}
                      className={`block transition-colors ${
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
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            {token && currentUser ? (
              <MobileUserPanel
                currentUser={currentUser}
                isLoggingOut={isLoggingOut}
                onLogout={onLogout}
                onNavigate={close}
              />
            ) : (
              <AuthButtons layout="mobile" />
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
