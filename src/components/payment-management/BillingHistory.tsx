'use client';

import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGetBillingTransactionsQuery } from '@/app/redux/api/financialApi';

export default function BillingHistory() {
  // এপিআই থেকে সরাসরি রিয়েল ট্রানজেকশন ডেটা ফেচ করা হচ্ছে
  const { data: transactions = [], isLoading } =
    useGetBillingTransactionsQuery();

  const [statusFilter, setStatusFilter] = useState('all');

  // ক্লায়েন্ট সাইড ফিল্টারিং (ব্যাকএন্ড স্ট্যাটাস ভ্যালু সাধারণত lowercase/uppercase চেক করে নেওয়া ভালো)
  const filteredTransactions = transactions.filter(tx => {
    if (statusFilter === 'all') return true;
    return tx.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#01503b]" />
        <p className="text-sm font-medium text-gray-500 font-[manrope]">
          Loading transaction logs...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm font-[manrope] space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <h3 className="text-lg font-bold text-gray-900">Transaction Logs</h3>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="trailing">Trailing</option>
          </select>

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
                Transaction ID
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                User ID
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Plan ID
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Period End
              </th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-gray-400"
                >
                  No transactions found matching the filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(row => {
                const isActive = row.status.toLowerCase() === 'active';

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="p-3 text-sm font-medium text-gray-900">
                      #{row.id.substring(0, 8)}...
                    </td>

                    {/* User ID */}
                    <td className="p-3 text-sm text-gray-600">{row.user_id}</td>

                    {/* Plan ID */}
                    <td className="p-3 text-sm text-gray-600">{row.plan_id}</td>

                    {/* Current Period End / Subscription Date */}
                    <td className="p-3 text-sm font-medium text-gray-600">
                      {row.current_period_end
                        ? new Date(row.current_period_end).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
                          isActive
                            ? 'bg-[#e2f0db] text-[#01503b]'
                            : 'bg-red-50 text-red-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#01503b]' : 'bg-red-500'}`}
                        />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination View footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Showing {filteredTransactions.length} of {filteredTransactions.length}{' '}
          entries
        </p>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button className="px-3 py-1 bg-[#3d443a] text-white text-xs font-bold rounded-lg">
            1
          </button>
          <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
