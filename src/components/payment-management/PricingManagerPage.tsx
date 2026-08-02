'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StatsCards from './StatsCards';
import SubscriptionPlans from './SubscriptionPlans';
import UpdatePlansForm from './UpdatePlansForm';
import BillingHistory from './BillingHistory';


import { BackendPlanData } from '@/app/redux/api/financialApi';

type TabType = 'subscription' | 'update' | 'history';

export default function PricingDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabType) || 'subscription';

  // Plan এর পরিবর্তে BackendPlanData সেট করা হলো
  const [selectedPlanForEdit, setSelectedPlanForEdit] =
    useState<BackendPlanData | null>(null);

  const handleTabChange = (tab: TabType) => {
    router.push(`?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    if (activeTab !== 'update') {
      setSelectedPlanForEdit(null);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 md:p-6 space-y-6 font-[manrope]">
      <StatsCards />

      <div className="space-y-4">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 text-md font-normal">
            <button
              onClick={() => handleTabChange('subscription')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'subscription'
                  ? 'border-[#01503b] text-[#01503b] font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => handleTabChange('update')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'update'
                  ? 'border-[#01503b] text-[#01503b] font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {selectedPlanForEdit ? 'Edit Plan' : 'Update Plans'}
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'border-[#01503b] text-[#01503b] font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Billing History
            </button>
          </nav>
        </div>

        <div className="pt-2">
          {activeTab === 'subscription' && (
            <SubscriptionPlans
              onEditPlan={plan => {
                setSelectedPlanForEdit(plan);
                handleTabChange('update');
              }}
              onAddNewPlan={() => {
                setSelectedPlanForEdit(null);
                handleTabChange('update');
              }}
            />
          )}

          {activeTab === 'update' && (
            <UpdatePlansForm
              editingPlan={selectedPlanForEdit}
              onSuccess={() => handleTabChange('subscription')}
            />
          )}

          {activeTab === 'history' && <BillingHistory />}
        </div>
      </div>
    </div>
  );
}
