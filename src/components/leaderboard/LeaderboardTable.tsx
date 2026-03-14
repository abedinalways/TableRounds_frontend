'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LeaderboardProgress } from '../ui/LeaderboardProgress';
import { LineChart, Line } from 'recharts';
import { Search, Filter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CalendarIcon from '../reusable/icons/CalendarIcon';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGetLeaderboardQuery } from '@/app/redux/api/leaderboardApi';


const getRankWithBadge = (rank: number) => {
  const isTopThree = rank <= 3;

  return (
    <div className="flex items-center gap-2">
      <span className="card-style text-[#314158] px-5 py-3">{rank}</span>

      {isTopThree && (
        <Image
          src={`/images/dashboard/leaderboard/rank-${rank}.png`}
          alt={`Rank ${rank}`}
          width={32}
          height={32}
          className="shrink-0"
        />
      )}
    </div>
  );
};

function TrendChart({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <LineChart width={80} height={30} data={chartData}>
      <Line
        type="monotone"
        dataKey="value"
        stroke="#10b981"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
}

export function LeaderboardTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [filters, setFilters] = useState({
    highAccuracy: false,
    topPerformers: false,
    activeUsers: false,
  });

  // Fetch data from backend
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetLeaderboardQuery();
  console.log(DataTransfer, 'oop')
  const filteredData = useMemo(() => {
    if (!response?.data?.leaderboard) return [];

    let filtered = [...response.data.leaderboard];

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.user.institution
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (filters.highAccuracy) filtered = filtered.filter(i => i.accuracy >= 70);
    if (filters.topPerformers) filtered = filtered.filter(i => i.rank <= 10);
    if (filters.activeUsers)
      filtered = filtered.filter(i => i.tests_completed >= 50);

    return filtered;
  }, [response, searchQuery, filters]);

  return (
    <Card className="mt-6 p-4">
      {/* Search & Filter */}
      <div className="md:flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex gap-6 items-center">
          {/* Time Period */}
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40 bg-[#f7f7f3]">
              <CalendarIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-sm">
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* 🔍 MOBILE SEARCH (Dialog) */}
          <div className="md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-10 h-10 rounded-md bg-[#f7f7f3] flex items-center justify-center">
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              </DialogTrigger>

              <DialogContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    autoFocus
                    type="text"
                    placeholder="Search by name, institution, or location"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#f7f7f3]"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 🔍 DESKTOP SEARCH */}
          <div className="relative hidden md:flex md:flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, institution, or location"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#f7f7f3] md:w-[607px]"
            />
          </div>
        </div>

        {/* Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-[#f7f7f3]">
              <Filter className="w-4 h-4" />
              Filter
              {(filters.highAccuracy ||
                filters.topPerformers ||
                filters.activeUsers) && (
                <span className="ml-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {
                    [
                      filters.highAccuracy,
                      filters.topPerformers,
                      filters.activeUsers,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={filters.highAccuracy}
              onCheckedChange={checked =>
                setFilters(p => ({ ...p, highAccuracy: checked }))
              }
            >
              High Accuracy (≥70%)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.topPerformers}
              onCheckedChange={checked =>
                setFilters(p => ({ ...p, topPerformers: checked }))
              }
            >
              Top 10 Performers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.activeUsers}
              onCheckedChange={checked =>
                setFilters(p => ({ ...p, activeUsers: checked }))
              }
            >
              Active Users (≥50 tests)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-t-[4px] outline overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="background text-white h-[89px]">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">% Completed</th>
              <th className="p-3 text-left">Accuracy</th>
              <th className="p-3">Avg Score</th>
              <th className="p-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading leaderboard...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-red-500">
                  Error loading leaderboard data. Please try again later.
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              filteredData.map(row => (
                <tr
                  key={row.rank}
                  className="not-last:border-b hover:bg-gray-50"
                >
                  <td className="p-3">{getRankWithBadge(Number(row?.rank))}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {row.user.avatar && (
                        <Image
                          src={row.user.avatar}
                          alt={row.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{row.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.user.institution}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">{row.tests_completed}</td>
                  <td className="p-3">
                    <span className="text-xs">{row.accuracy}%</span>
                    <LeaderboardProgress value={row.accuracy} />
                  </td>
                  <td className="p-3 text-center">{row.avg_score}%</td>
                  <td className="p-3 flex justify-center">
                    {row.trend && row.trend.length > 0 && (
                      <TrendChart data={row.trend} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
