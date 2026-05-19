'use client';

import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  useGetHelpQuery,
  useUpdateHelpMutation,
} from '@/app/redux/api/helpApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function PrivacyPolicyEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [updateHelp, { isLoading: isUpdating }] = useUpdateHelpMutation();

  const handleSave = async () => {
    try {
      await updateHelp({
        privacy_policy: content,
      }).unwrap();

      toast.success('Privacy policy updated successfully');
    } catch {
      toast.error('Failed to update privacy policy');
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

export default function PrivacyPolicyContent() {
  const { data, isLoading } = useGetHelpQuery();

  const help = data?.data?.[0];

  return (
    <div className="mx-auto font-[manrope]">
      <div className="background text-white rounded-2xl py-8 ">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Privacy Policy
        </div>
      </div>

      <div className="py-8 space-y-10 text-gray-700 leading-relaxed">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <PrivacyPolicyEditor
            key={`privacy-${help?.id ?? 'default'}-${help?.privacy_policy ?? ''}`}
            initialContent={help?.privacy_policy ?? ''}
          />
        )}
      </div>
    </div>
  );
}
