'use client';

import { useEffect, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  useGetHelpQuery,
  useUpdateHelpMutation,
} from '@/app/redux/api/helpApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DisclaimerContent() {
  const { data } = useGetHelpQuery();
  const [updateHelp] = useUpdateHelpMutation();

  const help = data?.data?.[0];

  const [content, setContent] = useState(help?.disclaimer ?? '');

  const handleSave = async () => {
    if (!help?.id) return;

    console.log(content, 'content');

    try {
      await updateHelp({
        id: help.id,
        body: {
          disclaimer: content,
        },
      }).unwrap();

      toast.success('Disclaimer updated successfully');
    } catch {
      toast.error('Failed to update disclaimer');
    }
  };

  return (
    <div className="mx-auto font-[manrope]">
      <div className="background text-white rounded-2xl py-8 ">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Disclaimer
        </div>
      </div>

      <div className="space-y-10 mt-10 text-gray-700 leading-relaxed">
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
