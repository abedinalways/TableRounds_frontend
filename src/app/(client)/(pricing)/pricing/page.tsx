import PricingSection from '@/components/pricing/PricingCard';
import React from 'react';


export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#f9f9f4] font-[manrope] py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <PricingSection />
      </div>
    </div>
  );
}
