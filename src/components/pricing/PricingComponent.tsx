'use client';

import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

import PricingCard from './PricingCard';
export default function Pricing() {
  return (
    <div className="font-[manrope] my-40 mx-2 md:mx-auto">
      <CardHeader className="gradient-bg text-white rounded-2xl py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Pricing
        </CardTitle>
      </CardHeader>
      <div className="my-10 flex items-center justify-center">
        <div className="gradient-bg p-[2px] rounded-2xl w-full ">
          <PricingCard />
        </div>
      </div>
      
    </div>
  );
}