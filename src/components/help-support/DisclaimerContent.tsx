'use client';

import { CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  html: string;
}

export default function DisclaimerContent({ html }: Props) {
  return (
    <div className="mx-auto font-[manrope]">
      <CardHeader className="background text-white rounded-2xl py-8">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Disclaimer
        </CardTitle>
      </CardHeader>

      <div
        className="mt-10 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
