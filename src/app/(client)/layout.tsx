
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main className="">{children}</main>
      {/* <Footer className="mt-auto" /> */}
      <Footer/>
    </div>
  );
}
