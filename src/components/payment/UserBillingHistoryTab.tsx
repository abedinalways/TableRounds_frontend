'use client';

import React from 'react';
import { RefreshCw, CreditCard, MoreVertical } from 'lucide-react';

export default function UserBillingHistoryTab() {

  const TRANSACTIONS = [
    {
      id: 't1',
      title: 'Pay-As-You-Go',
      date: '15 Jan, 2026 at 3:20 PM',
      amount: '£35',
    },
    {
      id: 't2',
      title: 'Pay-As-You-Go',
      date: '21 Jan, 2026 at 4:30 PM',
      amount: '£35',
    },
    {
      id: 't3',
      title: 'Pay-As-You-Go',
      date: '28 Jan, 2026 at 5:00 PM',
      amount: '£35',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-3xl font-[manrope] space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Your Billing History
        </h3>
        <p className="text-xs text-gray-400 mt-1">Today&apos;s Payment</p>
      </div>

      <div className="space-y-4">
        {TRANSACTIONS.map(tx => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{tx.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                Card Payment
              </div>
              <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                {tx.amount}
              </span>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
