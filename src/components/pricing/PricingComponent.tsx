import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

import PricingCard from './PricingCard';
export default function Pricing() {
  return (
    <div className="font-[manrope] my-40 mx-2 md:mx-auto">
      <CardHeader className="background text-white rounded-2xl py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Pricing
        </CardTitle>
      </CardHeader>
      <div className="my-10 flex items-center justify-center">
        <div className="bg-[#B79E6B] p-[2px] rounded-2xl w-full max-w-md">
          <PricingCard />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-[#B79E6B] font-semibold text-2xl">Frequently asked questions</h3>
        <p>Have questions? we've got answers.</p>
      </div>
    </div>
  );
}
