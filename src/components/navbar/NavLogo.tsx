
'use client';
import Image from 'next/image';
import Link from 'next/link';

interface NavLogoProps {
  variant?: 'desktop' | 'mobile';
}

export default function NavLogo({ variant = 'desktop' }: NavLogoProps) {
  if (variant === 'mobile') {
    return (
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
    );
  }

  return (
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
        <h1 className="font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope]">
          TableRounds
        </h1>
      </div>
    </Link>
  );
}
