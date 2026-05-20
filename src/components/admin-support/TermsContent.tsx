'use client';

import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  useGetHelpQuery,
  useUpdateHelpMutation,
} from '@/app/redux/api/helpApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function TermsEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [updateHelp, { isLoading: isUpdating }] = useUpdateHelpMutation();

  const handleSave = async () => {
    try {
      await updateHelp({
        terms_of_conditions: content,
      }).unwrap();

      toast.success('Terms updated successfully');
    } catch {
      toast.error('Failed to update terms');
    }
  };

  return (
    <>
      <RichTextEditor value={content} onChange={setContent} />

      <Button
        onClick={handleSave}
        disabled={isUpdating}
        className="mt-6 md:px-16! text-lg md:py-6! cursor-pointer"
      >
        {isUpdating ? 'Saving...' : 'Save'}
      </Button>
    </>
  );
}

export default function TermsContent() {
  const { data, isLoading } = useGetHelpQuery();

  const help = data?.data?.[0];

  return (
    <div className="mx-auto font-[manrope]">
      <div className="background text-white rounded-2xl py-8 ">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Terms of Use
        </div>
      </div>

      <div className="space-y-10 mt-10 text-gray-700 leading-relaxed">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <TermsEditor
            key={`terms-${help?.id ?? 'default'}-${help?.terms_of_conditions ?? ''}`}
            initialContent={help?.terms_of_conditions ?? ''}
          />
        )}
      </div>
    </div>
  );
}
