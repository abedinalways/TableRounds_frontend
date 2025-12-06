'use client'
import { Card } from '@/components/ui/card';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import Image from 'next/image';
interface WelcomeBannerProps {
  name: string;
  date: string;
  followers: number;
  following: number;
}

export const WelcomeBanner = ({
  
  date,
  followers,
  following,
}: WelcomeBannerProps) => {
  const [userName, setUserName] = useState('');
  
    useEffect(() => {
      const user = getUser();
      setUserName(user?.name ?? '');
    }, []);
  return (
    <Card className="p-6 background text-white rounded-lg shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 h-full w-1/3 bg-green-700 opacity-20 transform skew-x-12 -translate-x-1/4"></div>
      <div className="flex items-center justify-between z-10 relative">
        <div className="space-y-2">
          <p className="text-sm font-medium">{date}</p>
          <h2 className="text-2xl font-bold">Welcome, {userName}!</h2>
          <p className="text-sm">Stay up to date on your current progress</p>
          <div className="flex space-x-4 pt-2">
            <span className="text-lg font-semibold">{followers} Followers</span>
            <span className="text-lg font-semibold">{following} Following</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src="/images/dashboard/main_dashboard/img01.png"
              width={257}
              height={213}
              alt=""
            />
          </div>
          <Image
            src="/images/dashboard/main_dashboard/doc.png"
            width={176}
            height={245}
            alt="doctor"
          />
        </div>
      </div>
    </Card>
  );
};
