'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateCvMutation } from '@/app/redux/api/authApi';

export default function QuickActions() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [updateCv, { isLoading: isUploadingCv }] = useUpdateCvMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF or DOC files are allowed');
      e.target.value = '';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file); // key must match API: "file"

      const res = await updateCv(formData).unwrap();
      toast.success(res?.message || 'CV uploaded successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'CV upload failed');
    } finally {
      e.target.value = ''; // reset so same file can be re-uploaded
    }
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
        <CardTitle className="font-semibold">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleUploadClick}
          disabled={isUploadingCv}
          className="w-full flex justify-start items-center bg-[#059166] hover:bg-emerald-600 text-sm md:text-[20px] rounded-[12px] py-[12px] px-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="mr-2 h-4 w-4" />
          {isUploadingCv ? 'Uploading...' : 'Upload CV'}
        </button>

        {/* <button
          onClick={handleShare}
          className="w-full flex justify-start items-center bg-[#059166] hover:bg-emerald-600 text-sm md:text-[20px] rounded-[12px] py-[12px] px-[16px] cursor-pointer"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Profile
        </button> */}
      </CardContent>
    </Card>
  );
}
