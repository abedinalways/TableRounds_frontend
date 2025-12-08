'use client'
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function ClientLayout({children}: {children: React.ReactNode}){
  const pathName = usePathname();
  const isOmsHome = pathName === '/oms';

  return (
    <div className="overflow-hidden">
      
        <Navbar isOms={isOmsHome} />
        <main className="">{children}</main>
        {/* <Footer className="mt-auto" /> */}
        <Footer />
    
    </div>
  );
}
