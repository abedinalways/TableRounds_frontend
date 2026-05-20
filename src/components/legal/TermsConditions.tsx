import React from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  html: string;
};

export default function TermsConditions({ html }: Props) {
  return (
    <div className="mx-2 md:mx-auto font-[manrope] my-40">
      <CardHeader className="background text-white rounded-lg py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Terms of Use
        </CardTitle>
      </CardHeader>
      <div
        className="p-8 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
