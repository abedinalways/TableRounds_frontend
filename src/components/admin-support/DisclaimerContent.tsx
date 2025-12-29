'use client';

import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';


export default function DisclaimerContent() {
  const [content, setContent] = useState('');
  return (
    <div className="mx-auto font-[manrope]">
      <div className="background text-white rounded-2xl py-8 ">
        <div className="text-3xl md:text-[48px] font-bold text-center">
          Disclaimer
        </div>
      </div>
      <div className="space-y-10 mt-10 text-gray-700 leading-relaxed">
        <RichTextEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
