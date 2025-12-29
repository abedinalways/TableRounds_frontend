'use client';

import { RichTextEditor } from './RichTextEditor';
import { useState } from 'react';

export default function TermsContent() {
  const [content, setContent] = useState('');
  return (
    <div className="mx-auto font-[manrope]">
      

      <div className="background text-white rounded-lg py-8 mx-8">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Terms & Conditions
        </div>
      </div>
      <div className="p-8 space-y-10 text-gray-700 leading-relaxed">
        <RichTextEditor value={content} onChange={setContent} />
      </div>
     
    </div>
  );
}
