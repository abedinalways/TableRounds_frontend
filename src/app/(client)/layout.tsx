
import Navbar from '@/components/shared/Navbar';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* <Footer className="mt-auto" /> */}
    </div>
  );
}
