'use client';

import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useGetBillingTransactionsQuery } from '@/app/redux/api/financialApi';

export default function BillingHistory() {
  const { data: transactions = [], isLoading } =
    useGetBillingTransactionsQuery();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#01503b]" />
        <p className="text-sm font-medium text-gray-500 font-[manrope]">
          Loading billing history...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm font-[manrope] space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 gradient-bg hover:bg-[#01503b] text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export List
          </button>
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                User Name
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                User Email
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan Type
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan Price
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
                  No billing history found.

</td>
              </tr>
            ) : (
              transactions.map(row => {
                const rawPrice = Number(row.plan?.price);
                const formattedPrice = Number.isNaN(rawPrice)
                  ? row.plan?.price ?? 'N/A'
                  : `$${rawPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User Name */}
                    <td className="p-3 text-sm font-semibold text-gray-900">
                      {row.user?.name?.trim() || 'N/A'}
                    </td>

                    {/* User Email */}
                    <td className="p-3 text-sm text-gray-600">{row.user?.email}</td>

                    {/* Plan Type */}
                    <td className="p-3 text-sm font-medium text-gray-700 uppercase">
                      {row.plan_type}
                    </td>

                    {/* Plan Price */}
                    <td className="p-3 text-sm font-semibold text-gray-800">
                      {formattedPrice}
                    </td>

                    {/* Current Period End */}
                    <td className="p-3 text-sm font-medium text-gray-600">
                      {row.current_period_end
                        ? new Date(row.current_period_end).toLocaleDateString(undefined, {
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Showing {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
    </div>
  );
}