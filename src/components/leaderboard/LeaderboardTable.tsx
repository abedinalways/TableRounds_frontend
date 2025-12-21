import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LeaderboardItem } from '@/types/type';
import { LeaderboardProgress } from '../ui/LeaderboardProgress';
import { LineChart, Line } from 'recharts';
import { Search, Filter } from 'lucide-react';
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

interface LeaderboardTableProps {
  data: LeaderboardItem[];
}

// Simple Trend Chart Component
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

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [filters, setFilters] = useState({
    highAccuracy: false,
    topPerformers: false,
    activeUsers: false,
  });

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.institution.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply checkbox filters
    if (filters.highAccuracy) {
      filtered = filtered.filter(item => item.accuracy >= 70);
    }
    if (filters.topPerformers) {
      filtered = filtered.filter(item => item.rank <= 10);
    }
    if (filters.activeUsers) {
      filtered = filtered.filter(item => item.tests >= 50);
    }

   

    return filtered;
  }, [data, searchQuery, filters]);

  return (
    <Card className="mt-6 p-4">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between  mb-4 pb-4 border-b">
        <div className="flex gap-6">
          {/* Time Period Selector */}
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40 bg-[#f7f7f3]">
              <CalendarIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, institution, or location"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#f7f7f3] w-[607px]!"
            />
          </div>
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-[#f7f7f3]">
              <Filter className="w-4 h-4 " />
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
                setFilters(prev => ({ ...prev, highAccuracy: checked }))
              }
            >
              High Accuracy (≥70%)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.topPerformers}
              onCheckedChange={checked =>
                setFilters(prev => ({ ...prev, topPerformers: checked }))
              }
            >
              Top 10 Performers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.activeUsers}
              onCheckedChange={checked =>
                setFilters(prev => ({ ...prev, activeUsers: checked }))
              }
            >
              Active Users (≥50 tests)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results count */}
      {/* <div className="mb-3 text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} results
      </div> */}

      {/* Table */}
      <table className="w-full text-sm rounded-2xl border border-gray-100 rounded-t-xl">
        <thead className="background text-white">
          <tr className="">
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Tests</th>
            <th className="p-3">Accuracy</th>
            <th className="p-3">Avg Score</th>
            <th className="p-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No results found. Try adjusting your search or filters.
              </td>
            </tr>
          ) : (
            filteredData.map(row => (
              <tr key={row.rank} className="border-b hover:bg-gray-50">
                <td className="p-3">{row.rank}</td>
                <td className="p-3">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.institution}
                  </p>
                </td>
                <td className="p-3 text-center">{row.tests}</td>
                <td className="p-3 flex flex-col items-center">
                  <div>
                    <span className="text-xs">{row.accuracy}%</span>
                    <LeaderboardProgress value={row.accuracy} />
                  </div>
                </td>
                <td className="p-3 text-center">{row.avgScore}%</td>
                <td className="p-3 flex items-center justify-center">
                  {row.trend && <TrendChart data={row.trend} />}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
