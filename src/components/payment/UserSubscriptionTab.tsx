'use client';

import React, { useState } from 'react';
import { Check, DollarSign, DollarSignIcon, Loader2, LucideDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetUserSubscriptionPlansQuery,
  useBuySubscriptionMutation,
} from '@/app/redux/api/userFinancialApi';
import { FaDollarSign } from 'react-icons/fa6';

export default function UserSubscriptionTab() {
 
  const { data: plans = [], isLoading } = useGetUserSubscriptionPlansQuery();
  const [buySubscription] = useBuySubscriptionMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
     

      const currentOrigin = window.location.origin;

      const response = await buySubscription({
        planId,
        callbackUrl: currentOrigin,
      }).unwrap();

      if (response && response.data?.url) {
        
        toast.info('Redirecting to secure Stripe checkout...');
        window.location.href = response.data.url;
      } else {
        throw new Error('You already have an active monthly subscription.');
      }
    } catch (error: any) {
      
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        'Failed to initiate checkout. Please try again.';

      toast.error(errorMessage);
      
      setLoadingPlanId(null);
    }
  };
  if (isLoading) {
    return (
      <div className="text-sm font-medium text-gray-500 p-6 animate-pulse font-[manrope]">
        Loading subscription plans...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 items-start pt-6 font-[manrope]">
      {plans.map(plan => (
        <div
          key={plan.id}
          className="relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-6 shadow-xs min-h-[460px] w-full max-w-[320px]"
        >
          {plan.name.toLowerCase().includes('professional') && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bfa122] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Popular Plan
            </span>
          )}

          <div>
            <div className="text-center mt-3 space-y-4">
              <p className="text-sm font-semibold text-gray-700">{plan.name}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-4xl font-bold text-gray-900 flex items-center gap-1">
                  <img
                    width="32"
                    height="32"
                    src="https://img.icons8.com/material-outlined/48/us-dollar--v1.png"
                    alt="us-dollar--v1"
                  />{' '}
                  {Number(plan.price || 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">
                  /{plan.billing_period}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center md:text-left">
                Core includes
              </p>
              <ul className="space-y-3.5">
                {plan.benefits?.map((benefit, idx) => (
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
