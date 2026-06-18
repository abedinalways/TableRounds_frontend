'use client';

import React from 'react';
import { RefreshCw, CreditCard, MoreVertical, Loader2 } from 'lucide-react';
import { useGetUserBillingTransactionsQuery } from '@/app/redux/api/userFinancialApi';

export default function UserBillingHistoryTab() {
  // নতুন ইউজার এپیআই হুক ব্যবহার করা হয়েছে
  const { data: transactions = [], isLoading } =
    useGetUserBillingTransactionsQuery();

  if (isLoading) {
    return (
      <div className="max-w-3xl p-12 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#01503b]" />
        <p className="text-sm text-gray-400 font-[manrope]">
          Fetching history...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-3xl font-[manrope] space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Your Billing History
        </h3>
        <p className="text-xs text-gray-400 mt-1">Today&apos;s Payment</p>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 border border-dashed rounded-xl">
            No payments found.
          </div>
        ) : (
          transactions.map(tx => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Subscription Charge
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tx.created_at
                      ? new Date(tx.created_at).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  Card Payment
                </div>
                <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md uppercase">
                  {tx.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
