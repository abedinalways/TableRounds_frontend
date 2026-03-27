'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickActions() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/data/cv.pdf';
    link.download = 'Doctor.pdf';
    link.click();
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Profile',
          text: 'Check out my profile',
          url,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard');
    }
  };

  return (
    <Card className="background text-white border-none font-[manrope] text-sm md:text-[20px]">
      <CardHeader className="pb-3">
        <CardTitle className=" font-semibold">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex justify-start items-center bg-[#059166] hover:bg-emerald-600 text-sm md:text-[20px] rounded-[12px] py-[12px] px-[16px] cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CV
        </button>

        <button
          onClick={handleShare}
          className="w-full flex justify-start items-center bg-[#059166] hover:bg-emerald-600 text-sm md:text-[20px] rounded-[12px] py-[12px] px-[16px] cursor-pointer "
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Profile
        </button>
      </CardContent>
    </Card>
  );
}
