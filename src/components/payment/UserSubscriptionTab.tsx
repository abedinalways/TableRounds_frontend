'use client';

import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserPlan {
  id: string;
  type: string;
  price: number;
  billingPeriod: 'post' | 'month';
  isPopular?: boolean;
  benefits: string[];
}

const USER_PLANS: UserPlan[] = [
  {
    id: 'price_pay_as_you_go_id', 
    type: 'Pay-As-You-Go',
    price: 35.0,
    billingPeriod: 'post',
    isPopular: false,
    benefits: [
      'One Official Memorial Notice',
      'Charity Integration',
      'Verified Professional Seal',
      'Tribute Book Generation',
      'Stripe Secure Processing',
    ],
  },
  {
    id: 'price_monthly_prof_id',
    type: 'Monthly Professional',
    price: 135.0,
    billingPeriod: 'month',
    isPopular: true,
    benefits: [
      'Unlimited Notices',
      'Priority Verification',
      'Advanced Analytics',
      'Multi-User Access',
      'Premium Priority on Notice',
    ],
  },
];

export default function UserSubscriptionTab() {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      toast.info('Redirecting to secure Stripe checkout...');

      /* 
         =========================================
         API INTEGRATION PLACEHOLDER:
         =========================================
         const response = await createStripeSessionMutation({ priceId: planId }).unwrap();
         window.location.href = response.stripeCheckoutUrl;
      */

     
      setTimeout(() => {
        window.location.href = `https://checkout.stripe.com/pay/mock_session_for_${planId}`;
      }, 1500);
    } catch (error) {
      toast.error('Failed to initiate checkout. Please try again.');
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 items-start pt-6 font-[manrope]">
      {USER_PLANS.map(plan => (
        <div
          key={plan.id}
          className="relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-6 shadow-xs min-h-[460px] w-full max-w-[320px]"
        >
          {plan.isPopular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bfa122] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Popular Plan
            </span>
          )}

          <div>
            <div className="text-center mt-3 space-y-4">
              <p className="text-sm font-semibold text-gray-700">{plan.type}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-4xl font-bold text-gray-900">
                  £{plan.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">
                  /{plan.billingPeriod}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center md:text-left">
                Core includes
              </p>
              <ul className="space-y-3.5">
                {plan.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-gray-500"
                  >
                    <div className="bg-[#56634d] p-0.5 rounded-full mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="leading-tight">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            disabled={loadingPlanId !== null}
            onClick={() => handleCheckout(plan.id)}
            className="w-full mt-8 gradient-bg hover:bg-[#01503b] disabled:bg-gray-400 text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loadingPlanId === plan.id ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Select'
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
