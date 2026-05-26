
'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { LeaderboardProgress } from '../ui/LeaderboardProgress';
import { LineChart, Line } from 'recharts';
import { Search, Filter } from 'lucide-react';
import { getFullCountryName } from '@/lib/country';
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
import { LeaderboardTableRowsSkeleton } from './LeaderboardTableRowsSkeleton';

type ActiveFilter = 'high_accuracy' | 'top_10' | 'active_users';

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

const getApiPeriod = (timePeriod: string) => {
  switch (timePeriod) {
    case 'this-week':
      return 'week';
    case 'this-month':
      return 'month';
    case 'this-quarter':
      return 'quarter';
    case 'this-year':
      return 'year';
    case 'all-time':
      return 'all';
    default:
      return 'week';
  }
};

export function LeaderboardTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read all state from URL — persists on reload
  const searchQuery = searchParams.get('search') ?? '';
  const timePeriod = searchParams.get('period') ?? 'this-month';
  const activeFilter =
    (searchParams.get('filter') as ActiveFilter) ?? undefined;

  // Helper to update a single URL param without full navigation
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filter: ActiveFilter, checked: boolean) => {
    updateParam('filter', checked ? filter : null);
  };

  // Build API query params — omit filter key when not set
  const queryParams = useMemo(() => {
    const params: {
      period: 'week' | 'month' | 'quarter' | 'year' | 'all';
      page: number;
      limit: number;
      filter?: ActiveFilter;
      search?: string;
    } = {
      period: getApiPeriod(timePeriod) as
        | 'week'
        | 'month'
        | 'quarter'
        | 'year'
        | 'all',
      page: 1,
      limit: 10,
    };

    if (activeFilter) {
      params.filter = activeFilter;
    }

    const trimmedSearch = searchQuery.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    return params;
  }, [timePeriod, activeFilter, searchQuery]);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetLeaderboardQuery(queryParams);

 const filteredData = useMemo(() => {
   return response?.data?.leaderboard ?? [];
 }, [response]);

  const hasActiveFilter = activeFilter !== undefined;

  return (
    <Card className="mt-6 p-4">
      {/* Search & Filter */}
      <div className="md:flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex gap-6 items-center">
          {/* Time Period */}
          <Select
            value={timePeriod}
            onValueChange={val => updateParam('period', val)}
          >
            <SelectTrigger className="w-50 bg-[#f7f7f3]">
              <CalendarIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
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
                    placeholder="Search by name , institution or location"
                    value={searchQuery}
                    onChange={e =>
                      updateParam('search', e.target.value || null)
                    }
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
              placeholder="Search by name , institution or location"
              value={searchQuery}
              onChange={e => updateParam('search', e.target.value || null)}
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
              {hasActiveFilter && (
                <span className="ml-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={activeFilter === 'high_accuracy'}
              onCheckedChange={checked =>
                handleFilterChange('high_accuracy', checked)
              }
            >
              High Accuracy (≥70%)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilter === 'top_10'}
              onCheckedChange={checked => handleFilterChange('top_10', checked)}
            >
              Top 10 Performers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilter === 'active_users'}
              onCheckedChange={checked =>
                handleFilterChange('active_users', checked)
              }
            >
              Active Users (≥50% Accuracy)
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
              <th className="p-3 text-left">Country</th>
              <th className="p-3">Question Bank Usage</th>
              <th className="p-3 text-left">Accuracy</th>
              {/* <th className="p-3">Correct</th> */}
              <th className="p-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LeaderboardTableRowsSkeleton />
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
                      {row?.user?.avatar && (
                        <Image
                          src={row.user.avatar}
                          alt={row.user.name}
                          width={40}
                          height={40}
                          className="rounded-full aspect-square object-cover"
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
                  <td className="p-3">
                    {getFullCountryName(row.user?.country)}
                  </td>
                  <td className="p-3 text-center">
                    {row.completion_percentage}%
                  </td>
                  <td className="p-3">
                    <span className="text-xs">{row.accuracy}%</span>
                    <LeaderboardProgress value={row.accuracy} />
                  </td>
                  {/* <td className="p-3 text-center">{row.avg_score}%</td> */}
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