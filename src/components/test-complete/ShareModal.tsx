'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Image from 'next/image';
import { ColleagueSkeleton } from './ColleagueSkeleton';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const handleSend = () => {
    if (!selectedId) return;

    const selectedUser = colleagues.find(c => c.id === selectedId);

    console.log('Sending result to:', selectedUser);

    // simulate API call
    setTimeout(() => {
      toast(`Result sent to ${selectedUser?.name}`);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-[manrope]  max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggested Colleagues</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          <div className="grid sm:grid-cols-3 gap-1 font-[manrope]">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ColleagueSkeleton key={i} />
                ))
              : colleagues.map((item, index) => (
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
                      <p className="text-sm  font-semibold">{item.name}</p>
                      <p className="text-xs  text-muted-foreground">
                        {item.title} {colleagues.length}
                      </p>
                      {/* <p className="text-xs text-muted-foreground">
                      {item.university}
                    </p> */}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <button
          className="cursor-pointer text-white text-[14px] mt-4 outline max-w-lg w-[66px] h-[30px] rounded-[8px] bg-[#01503b]"
          disabled={!selectedId}
          onClick={handleSend}
        >
          Send
        </button>
      </DialogContent>
    </Dialog>
  );
}
