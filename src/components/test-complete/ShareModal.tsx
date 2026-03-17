'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Colleague, TestCardData } from './ResultSummary';
import { ColleagueSkeleton } from './ColleagueSkeleton';
import { Avatar, AvatarImage } from '../ui/avatar';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  colleagues: Colleague[];
  testCardData: TestCardData | null;
  onSendTestCard: (selectedUser: Colleague, testCardData: TestCardData) => void;
}

export function ShareModal({
  open,
  onClose,
  loading,
  colleagues = [],
  testCardData,
  onSendTestCard,
}: ShareModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleagues = useMemo(() => {
    const term = searchTerm.toLowerCase();

    if (!term) return colleagues;

    return colleagues.filter(c => c.name.toLowerCase().includes(term));
  }, [colleagues, searchTerm]);

  const handleSend = () => {
    if (!selectedId || !testCardData) return;

    const selectedUser = colleagues.find(c => c.id === selectedId);

    if (!selectedUser) return;

    onSendTestCard(selectedUser, testCardData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto font-[manrope]">
        <DialogHeader>
          <DialogTitle>Suggested Colleagues</DialogTitle>
        </DialogHeader>

        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search colleague..."
        />

        <div className="max-h-[300px] overflow-y-auto mt-3">
          <div className="grid sm:grid-cols-3 gap-2">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ColleagueSkeleton key={i} />
              ))
            ) : filteredColleagues.length === 0 ? (
              <div className="sm:col-span-3 text-center text-sm py-6">
                No colleagues found
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
                      : 'border-gray-200'
                  }`}
                >
                  <Avatar className="h-14 w-14">
              <AvatarImage src={item.avatar} />
                   </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {item.training_practice || '—'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          disabled={!selectedId}
          onClick={handleSend}
          className="mt-4 w-[80px] h-[44px] cursor-pointer rounded-[8px] bg-[#01503b] text-white disabled:opacity-50"
        >
          Send
        </button>
      </DialogContent>
    </Dialog>
  );
}
