'use client';

import React from 'react';
import { Check, Plus } from 'lucide-react';
import {
  BackendPlanData,
  useGetSubscriptionPlansQuery,
} from '@/app/redux/api/financialApi';

interface SubscriptionPlansProps {
  onEditPlan?: (plan: BackendPlanData) => void;
  onAddNewPlan?: () => void;
}

export default function SubscriptionPlans({
  onEditPlan,
  onAddNewPlan,
}: SubscriptionPlansProps) {
  const { data: plans = [], isLoading } = useGetSubscriptionPlansQuery();

  if (isLoading) {
    return (
      <div className="text-sm font-medium text-gray-500 p-6 animate-pulse">
        Loading plans...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 items-start pt-6 font-[manrope]">
      {plans.map(plan => (
        <div
          key={plan.id}
          className="relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[460px] w-full max-w-[320px]"
        >
          {plan.isPopular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bfa122] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Popular Plan
            </span>
          )}

          <div>
            <div className="text-center mt-3 space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                {plan.name ||
                  (plan.type === 'PAY_AS_YOU_GO'
                    ? 'Pay-As-You-Go'
                    : 'Monthly Professional')}
              </p>
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
                  /{plan.billing_period === 'post' ? 'post' : 'month'}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center md:text-left">
                Core includes
              </p>
              <ul className="space-y-3.5">
                {plan.benefits?.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-gray-500"
                  >
                    <div className="gradient-bg p-0.5 rounded-full mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="leading-tight">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onEditPlan?.(plan)}
            className="w-full mt-8 gradient-bg hover:bg-[#2c312a] text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer text-center"
          >
            Update Plan
          </button>
        </div>
      ))}

      {/* Add New Plan Block */}
      <div className="flex flex-col justify-between bg-[#f4f9f1] border border-dashed border-[#cbdcc3] rounded-2xl p-6 min-h-[460px] w-full max-w-[320px] text-center">
        <p className="text-sm font-semibold text-gray-700 mt-3">
          Add New Plan Here
        </p>
        <div className="flex justify-center items-center">
          <button
            onClick={onAddNewPlan}
            className="flex items-center justify-center w-14 h-14 rounded-full gradient-bg hover:bg-[#2c312a] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </button>
        </div>
        <button
          onClick={onAddNewPlan}
          className="w-full gradient-bg hover:bg-[#2c312a] text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer"
        >
          Select
        </button>
      </div>
    </div>
  );
}
