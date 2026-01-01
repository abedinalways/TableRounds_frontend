'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // const isCurrentMonth = (
  //   day: number,
  //   isPrevMonth: boolean,
  //   isNextMonth: boolean
  // ) => {
  //   if (isPrevMonth || isNextMonth) return false;
  //   return true;
  // };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

    const days= [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="h-10 flex items-center justify-center text-gray-400 text-sm font-medium"
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isTodayDate = isToday(day);
      days.push(
        <div
          key={`current-${day}`}
          className={`h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
            ${
              isTodayDate
                ? 'bg-[#01503b] text-white rounded-full w-10 mx-auto hover:bg-teal-800'
                : 'text-gray-900 hover:bg-gray-100 rounded-full w-10 mx-auto'
            }`}
        >
          {day}
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="h-12 flex items-center justify-center text-gray-400 text-sm font-medium"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-4 bg-white shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Calendar</h3>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-teal-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-10 w-10 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="bg-[#01503b] text-white px-3 py-2 rounded-full font-medium text-xs">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-10 w-10  rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(day => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
    </Card>
  );
};

export default Calendar;
