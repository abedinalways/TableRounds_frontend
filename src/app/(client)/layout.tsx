
import Navbar from '@/components/shared/Navbar';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <main className="">{children}</main>
      {/* <Footer className="mt-auto" /> */}
    </div>
  );
}
