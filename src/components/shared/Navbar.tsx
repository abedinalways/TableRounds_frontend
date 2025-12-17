'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Btn from '../reusable/button/Btn';
import { ChevronDown, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Specialists', hasDropdown: true },
  { label: 'Question Bank', href: '#' },
  { label: 'Legal', href: '#' },
  { label: 'Contact', href: '#' },
];

const specialtyOptions = [
  { value: 'oms', label: 'OMS', href: '/oms' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
];

export default function Navbar({ isOms = false }) {
  const [open, setOpen] = useState(false);
  const [specialty, setSpecialty] = useState('');

  const SpecialtyDropdown = ({ isMobile = false }) => (
    <DropdownMenu modal={!isMobile}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center cursor-pointer  gap-1 focus:outline-none hover:text-[#B79E6B] transition-colors ${
            isMobile ? 'w-full justify-between' : ''
          }`}
        >
          Specialists
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`bg-white ${isMobile ? 'w-full' : 'w-56'}`}
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
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuRadioItem>
            </Link>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="fixed inset-x-0 top-0 left-0 right-0 z-50 bg-custom-gradient backdrop-blur-md border-b border-green-600/30 overflow-hidden h-[92px] flex items-center justify-between">
      <div className=" mx-auto w-full px-4 sm:px-0 lg:px-0 custom-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
              <Image
                src="/images/navbar-logo.png"
                width={40}
                height={40}
                alt="TableRounds Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              {isOms ? (
                <h1 className="font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope]">
                  Table{' '}
                  <span className="text-xs bg-[#B79E6B] rounded-sm p-1 mb-2">
                    OMS
                  </span>{' '}
                  <br /> Rounds
                </h1>
              ) : (
                <h1 className="font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope]">
                  TableRounds
                </h1>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-[manrope] cursor-pointer">
            {navItems.map(item => (
              <li key={item.label}>
                {item.hasDropdown ? (
                  <SpecialtyDropdown />
                ) : (
                  <a
                    href={item.href}
                    className="cursor-pointer hover:text-[#B79E6B] transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Btn
              text="Login"
              href="/login"
              className="bg-[#B79E6B] text-white w-[105px] h-[54px] hover:bg-[#a08c5f] transition-colors"
            />
            <Btn
              text="Sign up"
              href="/register"
              className="bg-white text-[#B79E6B] w-[107px] h-[54px] hover:bg-gray-100 transition-colors"
            />
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
                <Menu className="w-8 h-8 " />
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
                          <SpecialtyDropdown isMobile />
                        ) : (
                          <a
                            href={item.href}
                            className="block cursor-pointer hover:text-[#B79E6B] transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  <Btn
                    text="Login"
                    href="/login"
                    className="bg-[#B79E6B] text-white w-full h-[54px] hover:bg-[#a08c5f] transition-colors"
                  />

                  <Btn
                    href="/register"
                    text="Sign up"
                    className="bg-white text-[#B79E6B] w-full h-[54px] hover:bg-gray-100 transition-colors"
                  />
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
