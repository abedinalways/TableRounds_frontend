'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UserSubscriptionTab from './UserSubscriptionTab';
import UserBillingHistoryTab from './UserBillingHistoryTab';
import PaymentStatusModal from './PaymentStatusModal';

type UserTabType = 'subscription' | 'methods' | 'history';

export default function PaymentMainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get('tab') as UserTabType) || 'subscription';
  const paymentStatus = searchParams.get('status');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (paymentStatus === 'success' || paymentStatus === 'cancel') {
      setIsModalOpen(true);
    }
  }, [paymentStatus]);

  const handleTabChange = (tab: UserTabType) => {
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.href = '/dashboard/user/payment?tab=history';
  };
  return (
    <>
      <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold font-[manrope]">
        Payment & Billing
      </h2>
      <div className="min-h-screen bg-gray-50/20 p-4 md:p-4 space-y-4 font-[manrope]">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 text-sm font-medium">
            <button
              onClick={() => handleTabChange('subscription')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'subscription' ? 'border-[#01503b] text-[#01503b] font-bold' : 'border-transparent text-gray-400'}`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'history' ? 'border-[#01503b] text-[#01503b] font-bold' : 'border-transparent text-gray-400'}`}
            >
              Billing History
            </button>
          </nav>
        </div>

        <div className="pt-2">
          {activeTab === 'subscription' && <UserSubscriptionTab />}
          {activeTab === 'history' && <UserBillingHistoryTab />}
        </div>

        <PaymentStatusModal
          isOpen={isModalOpen}
          status={paymentStatus as 'success' | 'cancel'}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
}
