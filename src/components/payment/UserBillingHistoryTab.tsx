'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGetUserBillingTransactionsQuery } from '@/app/redux/api/userFinancialApi';

const statusStyles: Record<string, string> = {
  active: 'bg-[#e2f0db] text-[#01503b]',
  expired: 'bg-red-50 text-red-500',
  pending: 'bg-amber-50 text-amber-600',
  trailing: 'bg-blue-50 text-blue-600',
};

const getStatusStyle = (status: string) =>
  statusStyles[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600';

export default function UserBillingHistoryTab() {
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
        <h3 className="text-xl font-bold text-gray-900">Your Billing History</h3>
        <p className="text-xs text-gray-400 mt-1">Today&apos;s Payment</p>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan Name
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan Price
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan Type
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Status
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Period End
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-gray-400"
                >
                  No payments found.

</td>
              </tr>
            ) : (
              transactions.map(tx => {
                const rawPrice = Number(tx.plan?.price);
                const formattedPrice = Number.isNaN(rawPrice)
                  ? tx.plan?.price ?? 'N/A'
                  : `$${rawPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Plan Name */}
                    <td className="p-3 text-sm font-bold text-gray-800">
                      {tx.plan?.name?.trim() || 'N/A'}
                    </td>

                    {/* Plan Price */}
                    <td className="p-3 text-sm font-semibold text-gray-800">
                      {formattedPrice}
                    </td>

                    {/* Plan Type */}
                    <td className="p-3 text-sm font-medium text-gray-600 uppercase">
                      {tx.plan_type}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(tx.status)}`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    {/* Period End */}
                    <td className="p-3 text-sm font-medium text-gray-600">
                      {tx.current_period_end
                        ? new Date(tx.current_period_end).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}