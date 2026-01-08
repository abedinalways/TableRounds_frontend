'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import colleaguesData from '../../../public/data/colleagues.json';
import Btn from '../reusable/button/Btn';
import Link from 'next/link';

interface Colleague {
  id: number;
  name: string;
  institution: string;
  avatar: string;
  specialty: string;
}

const FindColleagues: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const colleagues: Colleague[] = colleaguesData.colleagues;

  const filteredColleagues = useMemo(() => {
    return colleagues.filter(colleague => {
      const query = searchQuery.toLowerCase();
      return (
        colleague.name.toLowerCase().includes(query) ||
        colleague.institution.toLowerCase().includes(query) ||
        colleague.specialty.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, colleagues]);

  const displayedColleagues = showAll
    ? filteredColleagues
    : filteredColleagues.slice(0, 6);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto  bg-white border rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Find Colleagues
        </h2>
        <Button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#01503b] hover:bg-teal-800 text-white px-6 self-start sm:self-auto cursor-pointer"
        >
          {showAll ? 'Show Less' : 'View All Surgeons'}
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 bg-[#f7f7f3]" />
        <Input
          type="text"
          placeholder="Search by name, institution, or location"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-base border-gray-200 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Suggested Colleagues
        </h3>
      </div>

      {filteredColleagues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No colleagues found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedColleagues.map(colleague => (
            <Card
              key={colleague.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 "
            >
                <Link href='/dashboard/profile'>
              <div className="flex items-center gap-3 ">
                  <Avatar className="h-[59px] w-[59px]">
                    <AvatarImage src={colleague.avatar} alt={colleague.name} />
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                      {getInitials(colleague.name)}
                    </AvatarFallback>
                  </Avatar>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {colleague.name}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {colleague.institution}
                  </p>
                </div>
              </div>
                </Link>

              {/* ✅ Buttons appear ONLY when View All is active */}
              {showAll && (
                <div className="mt-4 flex gap-2">
                  <Btn
                    href="/dashboard/messages"
                    className="flex-1 bg-[#01503b] hover:bg-teal-800 text-white py-2 px-6 cursor-pointer"
                  >
                    Message
                  </Btn>

                  <Btn className="flex-1 card-bg border-none text-[#01503b] py-2 px-6 cursor-pointer">
                    Following
                  </Btn>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!showAll && filteredColleagues.length > 6 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing 6 of {filteredColleagues.length} colleagues
        </div>
      )}
    </div>
  );
};

export default FindColleagues;
