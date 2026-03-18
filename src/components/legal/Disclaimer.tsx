import React from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card';


type Props = {
  html: string;
};
export default function Disclaimer({ html }: Props) {
  return (
    <div className="font-[manrope] my-40 mx-2 md:mx-auto">
      <CardHeader className="background text-white rounded-2xl py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Disclaimer
        </CardTitle>
      </CardHeader>
     <div
        className="p-8 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  
  );
}
