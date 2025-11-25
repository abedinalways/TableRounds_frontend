'use client';
import Image from 'next/image';
import React, { useState } from 'react'

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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

export default function Navbar() {
  
  const [open, setOpen] = useState(false);
   const [position, setPosition] = React.useState('bottom');
  return (
    <div className="bg-custom-gradient/50 md:px-[140px] md:py-[10px] py-2 flex items-center justify-evenly font-[manrope] sticky top-0 left-0 right-0 z-50 backdrop-blur-xs border-1 border-green-600/30">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-lg" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white/10 backdrop-blur-2xl border-0">
            <SheetHeader>
              {/* logo */}
              <div>
                <span className="flex items-center">
                  <Image
                    src="/images/logo.png"
                    width={30}
                    height={30}
                    alt="logo"
                    className=""
                  />
                </span>
              </div>

              <div className="mt-2">
                {/* <NavItems variant="mobile" /> */}
                <ul className="flex flex-col justify-between gap-4 ">
                  <li>Home</li>
                  <li>
                    <span className="flex items-start gap-1">
                      Specialits
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="cursor-pointer">
                            {' '}
                            <ChevronDown />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={position}
                            onValueChange={setPosition}
                          >
                            <DropdownMenuRadioItem value="top">
                              Top
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom">
                              Bottom
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right">
                              Right
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </li>
                  <li>Question Bank</li>
                  <li>Legal</li>
                  <li>Contact</li>
                </ul>
              </div>

              {/* Mobile CTA */}
              <div className="mt-4 flex flex-col gap-4">
                {/* Login Button */}
                <Btn
                  text="Login"
                  // onClick={handleLogin}
                  className="bg-[#B79E6B] text-white py-[4px] px-[32px] w-[111px] h-[40px]"
                />

                {/* Sign Up Button */}
                <Btn
                  text="Sign up"
                  // onClick={handleSignUp}
                  className="py-[4px] px-[32px] w-[105px] h-[40px] bg-white text-[#B79E6B]"
                />
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      {/* medium and large device*/}
      {/* logo */}
      <div>
        <span className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="w-1/2 md:w-full "
          />
          <h1 className="font-bold  text-xl md:text-3xl text-white">
            TableRounds
          </h1>
        </span>
      </div>
      {/* navitems */}
      <div className="md:block hidden items-center text-white md:w-[541px] ">
        <ul className="flex justify-between gap-[24px] ">
          <li>Home</li>
          <li>
            <span className="flex items-start gap-1">
              Specialits
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer">
                    {' '}
                    <ChevronDown />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="top">
                      Top
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">
                      Bottom
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                      Right
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </li>
          <li>Question Bank</li>
          <li>Legal</li>
          <li>Contact</li>
        </ul>
      </div>
      {/* auth btn */}
      <div className="md:flex hidden justify-evenly items-center-safe gap-4">
        {/* Login Button */}
        <Btn
          text="Login"
          // onClick={handleLogin}
          className="bg-[#B79E6B] text-white py-[4px] px-[32px] w-[111px] h-[40px]"
        />

        {/* Sign Up Button */}
        <Btn
          text="Sign up"
          // onClick={handleSignUp}
          className="py-[4px] px-[32px] w-[105px] h-[40px] bg-white text-[#B79E6B]"
        />
      </div>
    </div>
  );
}
