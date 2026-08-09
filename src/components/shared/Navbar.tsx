'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Btn from '../reusable/button/Btn';
import { ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import Link from 'next/link';
import OmsLogo from '../reusable/icons/OmsLogo';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { useMeQuery, useLogoutMutation } from '@/app/redux/api/authApi';
import { toast } from 'sonner';
import { clearUser } from '@/app/redux/authSlice';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Specialties', hasDropdown: true, dropdownKey: 'specialty' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Legal', hasDropdown: true, dropdownKey: 'legal' },
  { label: 'Contact', href: '/contact' },
];

const specialtyOptions = [
  { value: 'oms', label: 'OMS', href: '/oms' },
];

const legalOptions = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Terms of Use', href: '/terms-conditions' },
];

export default function Navbar({ isOms = false }) {
  const [open, setOpen] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.auth.token);

  const { data: currentUser } = useMeQuery(undefined, {
    skip: !token,
  });
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success('Logged out successfully');
      window.location.href = '/login';
      setOpen(false);
    } catch {
      toast.error('Failed to logout');
    }
  };

  const isActive = (href?: string) => {
    if (!href || href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const SpecialtyDropdown = ({ isMobile = false }) => (
    <DropdownMenu modal={!isMobile}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center cursor-pointer gap-1 focus:outline-none hover:text-[#B79E6B] transition-colors ${
            isMobile ? 'w-full justify-between' : ''
          }`}
        >
          Specialties
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`bg-white font-[manrope] ${isMobile ? 'w-full' : 'w-56'}`}
      >
        <DropdownMenuLabel>Select Specialty</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={specialty} onValueChange={setSpecialty}>
          {specialtyOptions.map(option => (
            <Link
              key={option.value}
              href={option.href || '#'}
              onClick={() => {
                if (isMobile) setOpen(false);
              }}
            >
              <DropdownMenuRadioItem
                value={option.value}
                className={`cursor-pointer ${
                  isActive(option.href) ? 'text-[#B79E6B] font-semibold' : ''
                }`}
              >
                {option.label}
              </DropdownMenuRadioItem>
            </Link>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const LegalDropdown = ({ isMobile = false }) => (
    <DropdownMenu modal={!isMobile}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center cursor-pointer gap-1 focus:outline-none hover:text-[#B79E6B] transition-colors ${
            isMobile ? 'w-full justify-between' : ''
          }`}
        >
          Legal
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`bg-white font-[manrope] ${isMobile ? 'w-full' : 'w-56'}`}
      >
        <DropdownMenuLabel>Legal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {legalOptions.map(opt => (
          <DropdownMenuItem
            key={opt.href}
            className={`cursor-pointer ${
              isActive(opt.href) ? 'text-[#B79E6B] font-semibold' : ''
            }`}
            asChild
          >
            <Link
              href={opt.href}
              onClick={() => {
                if (isMobile) setOpen(false);
              }}
            >
              {opt.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderUserAvatarDropdown = (isMobile = false) => {
    if (!currentUser) return null;
    const initials = currentUser.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <DropdownMenu modal={!isMobile}>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center gap-2 focus:outline-none group ${
              isMobile ? 'w-full' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#B79E6B] flex items-center justify-center text-white text-sm font-semibold overflow-hidden border-2 border-[#B79E6B]/50 group-hover:border-[#B79E6B] transition-all">
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials || 'U'}</span>
              )}
            </div>
            <span className="text-white text-sm font-medium max-w-[120px] truncate hidden xl:block">
              {currentUser.name}
            </span>
            <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`bg-white font-[manrope] ${isMobile ? 'w-full' : 'w-56'}`}
          align={isMobile ? 'start' : 'end'}
        >
          <DropdownMenuLabel className="truncate">
            {currentUser.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={
                currentUser.type === 'admin'
                  ? '/dashboard/admin'
                  : '/dashboard/user'
              }
              className="cursor-pointer"
              onClick={() => {
                if (isMobile) setOpen(false);
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 cursor-pointer focus:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="fixed inset-x-0 top-0 left-0 right-0 z-50 bg-[#02533d]/90 backdrop-blur-xs border-b border-green-600/30 overflow-hidden h-[92px] flex items-center justify-between font-[manrope]">
      <div className="mx-auto w-full px-4 sm:px-0 lg:px-0 custom-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 shrink-0 cursor-pointer">
              <Image
                src="/images/navbar-logo.png"
                width={40}
                height={40}
                alt="TableRounds Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"
                style={{ width: 'auto', height: 'auto' }}
              />
              {/* {isOms ? (
                <h1 className="relative font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope] mb-4">
                  <div className="flex items-center justify-center gap-1">
                    Table
                    <span>
                      <OmsLogo />
                    </span>
                  </div>
                  <span className="absolute top-6">Rounds</span>
                </h1>
              ) : (
                
              )} */}
              <h1 className="font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope]">
                TableRounds
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-[manrope] cursor-pointer">
            {navItems.map(item => (
              <li key={item.label}>
                {item.hasDropdown ? (
                  item.dropdownKey === 'specialty' ? (
                    <SpecialtyDropdown />
                  ) : (
                    <LegalDropdown />
                  )
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`cursor-pointer transition-colors ${
                      isActive(item.href)
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

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {token && currentUser ? (
              <>{renderUserAvatarDropdown()}</>
            ) : (
              <>
                <Btn
                  text="Login"
                  href="/login"
                  className="bg-[#B79E6B] text-white w-[105px] h-[54px] hover:bg-[#a08c5f] transition-colors"
                />
                <Btn
                  text="Sign Up"
                  href="/register"
                  className="bg-white text-[#B79E6B] w-[107px] h-[54px] hover:bg-gray-100 transition-colors"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
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
            <SheetContent className="bg-white/10 backdrop-blur-2xl border-0 w-[280px] sm:w-[350px]">
              <SheetHeader>
                {/* Mobile Logo */}
                <div className="flex items-center gap-2 mb-6">
                  <Image
                    src="/images/navbar-logo.png"
                    width={30}
                    height={30}
                    alt="T"
                    className="shrink-0"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <span className="font-bold text-xl text-white font-[manrope]">
                    TableRounds
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="mt-4">
                  <ul className="flex flex-col gap-4 text-white font-[manrope]">
                    {navItems.map(item => (
                      <li key={item.label}>
                        {item.hasDropdown ? (
                          item.dropdownKey === 'specialty' ? (
                            <SpecialtyDropdown isMobile />
                          ) : (
                            <LegalDropdown isMobile />
                          )
                        ) : (
                          <Link
                            href={item.href || '#'}
                            onClick={() => setOpen(false)}
                            className={`block transition-colors ${
                              isActive(item.href)
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

                {/* Mobile Auth Section */}
                <div className="mt-8 flex flex-col gap-3">
                  {token && currentUser ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-[#B79E6B] flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                          {currentUser.avatar ? (
                            <Image
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {currentUser.name
                                ?.split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2) || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-semibold truncate max-w-[180px]">
                            {currentUser.name}
                          </p>
                          <p className="text-white/60 text-xs truncate max-w-[180px]">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={
                          currentUser.type === 'admin'
                            ? '/dashboard/admin'
                            : '/dashboard/user'
                        }
                        onClick={() => setOpen(false)}
                      >
                        <Btn
                          text="Dashboard"
                          className="bg-[#B79E6B] text-white w-full h-[54px] hover:bg-[#a08c5f] transition-colors"
                        />
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-white/10 text-white w-full h-[54px] rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <Btn
                        text="Login"
                        href="/login"
                        className="bg-[#B79E6B] text-white w-full h-[54px] hover:bg-[#a08c5f] transition-colors"
                      />
                      <Btn
                        href="/register"
                        text="Sign Up"
                        className="bg-white text-[#B79E6B] w-full h-[54px] hover:bg-gray-100 transition-colors"
                      />
                    </>
                  )}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}