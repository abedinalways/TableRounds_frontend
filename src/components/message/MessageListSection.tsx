import Image from 'next/image';
import React from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

export default function MessageListSection() {
  return (
    <div className="">
      <h4 className="font-semibold mb-3">Message list</h4>
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input placeholder="Search messages..." className="pl-9" />
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {[1, 2, 3, 4, 5].map(item => (
          <div
            key={item}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <div>
              <Image
                src="/images/dashboard/message/doctor.png"
                alt="list"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Dr. Michael Rodriguez</p>
              <p className="text-xs text-gray-500 truncate">
                Can we schedule a consultation for next...
              </p>
            </div>
            <span className="text-xs text-gray-400">15m</span>
          </div>
        ))}
      </div>
    </div>
  );
}
