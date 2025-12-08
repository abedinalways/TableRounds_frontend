'use client'
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function ClientLayout({children}: {children: React.ReactNode}){
  const pathName = usePathname();
  const isOsmHome = pathName === '/osm';

  return (
    <div className="overflow-hidden">
      
        <Navbar isOsm={isOsmHome} />
        <main className="">{children}</main>
        {/* <Footer className="mt-auto" /> */}
        <Footer />
    
    </div>
  );
}
