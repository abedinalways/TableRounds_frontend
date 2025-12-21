import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AnimatedProgressCircle, { PerformanceData } from './AnimatedProgressCircle';
import StatIcon from '../ui/StatIcon';
import QuestionIcon from '../reusable/icons/QuestionIcon';



export default function PerformanceSummary({
  data,
}: {
  data?: PerformanceData;
}) {
  if (!data) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No performance data available
      </div>
    );
  }

  const p = data.performance;
  const qb = data.questionBank;

  return (
    <section className="grid gap-6 mt-6 font-[manrope]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full  text-green-700 text-xs">
                <StatIcon />
              </span>
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <AnimatedProgressCircle value={p.correctPercent} color="green" />
            <div className="space-y-3 text-[20px] flex-1 items-center">
              <div className="flex items-center justify-between bg-[#ecfdf5] p-6 rounded-[8px]">
                <span className="text-gray-600">Total Correct</span>
                <span className="font-semibold text-green-700">
                  {p.totalCorrect}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#fef2f2] px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Incorrect</span>
                <span className="font-semibold text-red-600">
                  {p.totalIncorrect}
                </span>
              </div>
              <div className="flex items-center justify-between card-bg px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Omitted</span>
                <span className="font-semibold text-gray-700">
                  {p.totalOmitted}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Bank Card */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs">
                <QuestionIcon />
              </span>
              Question Bank Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <AnimatedProgressCircle value={qb.usedPercent} color="brown" />
            <div className="space-y-[12px] text-[20px] flex-1 items-center">
              <div className="flex items-center justify-between card-bg01 px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Used Questions</span>
                <span className="font-semibold text-amber-700">{qb.used}</span>
              </div>
              <div className="flex items-center justify-between card-bg px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Unused Questions</span>
                <span className="font-semibold text-gray-700">{qb.unused}</span>
              </div>
              <div className="flex items-center justify-between bg-[#ecfdf5] px-[24px] py-[24px] rounded-[8px]">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-semibold text-gray-900">{qb.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
