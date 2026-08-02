'use client';

import React from 'react';
import { DollarSign, Calendar, Clock } from 'lucide-react';
import { useGetStatsQuery } from '@/app/redux/api/overviewStatsApi';


interface FinancialStatsData {
  totalRevenue: number;
  yearlyPlansRevenue: number;
  monthlyPlansRevenue: number;
}

export default function StatsCards() {

  const { data, isLoading } = useGetStatsQuery();
  const stats = data as FinancialStatsData | undefined;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-[manrope]">
      {/* Total Revenue */}
      <div className="gradient-bg border border-green-200 rounded-2xl px-5 py-12 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#f4f9f1] p-3 rounded-full text-[#01503b]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-md font-semibold text-gray-200">Total Revenue</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              ${stats?.totalRevenue ?? 0}
            </h3>
          </div>
        </div>
        <span className="bg-red-50 text-red-500 text-xs px-2.5 py-1 rounded-full font-medium">
          Last Year
        </span>
      </div>

      {/* Yearly Plans */}
      <div className="gradient-bg border border-green-200 rounded-2xl px-5 py-12 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#f4f9f1] p-3 rounded-full text-[#01503b]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-md font-semibold text-gray-200">Yearly Plans</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              ${stats?.yearlyPlansRevenue ?? 0}
            </h3>
          </div>
        </div>
        <span className="bg-[#e2f0db] text-[#01503b] text-xs px-2.5 py-1 rounded-full font-medium">
          +5 week
        </span>
      </div>

      {/* Monthly Plans */}
      <div className="gradient-bg border border-green-200 rounded-2xl px-5 py-12 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#f4f9f1] p-3 rounded-full text-[#01503b]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-md font-semibold text-gray-200">Monthly Plans</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              ${stats?.monthlyPlansRevenue ?? 0}
            </h3>
          </div>
        </div>
        <span className="bg-red-50 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium">
          -1.2%
        </span>
      </div>
    </div>
  );
}
