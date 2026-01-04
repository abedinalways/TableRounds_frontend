'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Image from 'next/image';
import { ColleagueSkeleton } from './ColleagueSkeleton';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface Colleague {
  id: number;
  name: string;
  title: string;
  university: string;
  avatar: string;
}

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  colleagues: Colleague[];
}

export function ShareModal({
  open,
  onClose,
  loading,
  colleagues = [],
}: ShareModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleagues = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return colleagues;

    return colleagues.filter(c => {
      const name = c.name?.toLowerCase() || '';
      const title = c.title?.toLowerCase() || '';
      const university = c.university?.toLowerCase() || '';
      return (
        name.includes(term) || title.includes(term) || university.includes(term)
      );
    });
  }, [colleagues, searchTerm]);

  const handleSend = () => {
    if (!selectedId) return;

    const selectedUser = colleagues.find(c => c.id === selectedId);
    if (!selectedUser) return;

    console.log('Sending result to:', selectedUser);

    setTimeout(() => {
      toast(`Result sent to ${selectedUser.name}`);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-[manrope] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggested Colleagues</DialogTitle>
        </DialogHeader>

        {/* Search input right under title */}
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full"
        />

        <div className="max-h-[300px] overflow-y-auto mt-3">
          <div className="grid sm:grid-cols-3 gap-1 font-[manrope]">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ColleagueSkeleton key={i} />
              ))
            ) : filteredColleagues.length === 0 ? (
              <div className="sm:col-span-3 text-sm text-muted-foreground py-6 text-center">
                No colleagues found.
              </div>
            ) : (
              filteredColleagues.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`border rounded-xl p-3 flex gap-2 cursor-pointer transition
                    ${
                      selectedId === item.id
                        ? 'border-[#01503b] bg-[#01503b]/5'
                        : 'border-gray-200 hover:border-[#01503b]'
                    }
                  `}
                >
                  <div>
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-full mx-auto"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.title}
                    </p>
                    {/* If you want university back, uncomment */}
                    {/* <p className="text-xs text-muted-foreground">{item.university}</p> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          className="cursor-pointer text-white text-[14px] mt-4 outline max-w-lg w-[66px] h-[30px] rounded-[8px] bg-[#01503b] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedId}
          onClick={handleSend}
        >
          Send
        </button>
      </DialogContent>
    </Dialog>
  );
}
