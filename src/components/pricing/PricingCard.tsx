import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingCard: React.FC = () => {
  const features = [
    'Full question bank access',
    'Track quiz performances',
    'Flag and review questions',
    'Connect with colleagues',
    'Compete against others worldwide',
  ];

  return (
    <div className=" flex items-center justify-center font-[manrope]">
      <Card className="w-full max-w-md  shadow-lg">
        <CardContent className="p-8">
          {/* Price Section */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-5xl font-bold text-[#01281e]">$0</span>
              <span className="text-xl text-[#01281e] ml-2">/month</span>
            </div>
            <p className="text-slate-500 text-sm">While in Early Access</p>
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-[#B79E6B] hover:[bg-[#B79E6B] text-white font-semibold py-6 text-base mb-6 rounded-md shadow-sm cursor-pointer">
            Create Free Account
          </Button>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                </div>
                <span className="text-slate-600 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCard;
