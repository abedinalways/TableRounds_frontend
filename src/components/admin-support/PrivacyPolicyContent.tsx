'use client';

import { useEffect, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  useGetHelpQuery,
  useUpdateHelpMutation,
} from '@/app/redux/api/helpApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PrivacyPolicyContent() {
  const { data } = useGetHelpQuery();
  const [updateHelp] = useUpdateHelpMutation();

  const help = data?.data?.[0];

 const [content, setContent] = useState(help?.privacy_policy ?? '');


  const handleSave = async () => {
    if (!help?.id) return;

    try {
      await updateHelp({
        id: help.id,
        body: {
          privacy_policy: content,
        },
      }).unwrap();

      toast.success('Privacy policy updated successfully');
    } catch {
      toast.error('Failed to update privacy policy');
    }
  };

  return (
    <div className="mx-auto font-[manrope]">
      <div className="background text-white rounded-2xl py-8 ">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Privacy Policy
        </div>
      </div>

      <div className="py-8 space-y-10 text-gray-700 leading-relaxed">
        <RichTextEditor value={content} onChange={setContent} />

        <Button
          onClick={handleSave}
          className="mt-6 md:px-16! text-lg md:py-6!  cursor-pointer"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
