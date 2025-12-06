'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';

export default function Topbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getUser();
    setUserName(user?.name ?? '');
  }, []);

  return (
    <header className="flex justify-end items-center bg-white shadow px-6 py-4">
      <span className="text-gray-700 font-semibold">Welcome, {userName}</span>
    </header>
  );
}
