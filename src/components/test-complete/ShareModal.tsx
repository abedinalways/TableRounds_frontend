import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Colleague, TestCardData } from './ResultSummary';
import { useRouter } from 'next/navigation';
import { ColleagueSkeleton } from './ColleagueSkeleton'; // Import ColleagueSkeleton

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  colleagues: Colleague[];
  testCardData: TestCardData | null; // Ensure proper typing
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Filter colleagues based on the search term
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

    // Send the TestCard data to the selected user
    if (testCardData) {
      onSendTestCard(selectedUser, testCardData);
    }

    setTimeout(() => {
      toast(`Result sent to ${selectedUser.name}`);
      onClose();
      router.push('/dashboard/messages');
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-[manrope] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggested Colleagues</DialogTitle>
        </DialogHeader>

        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full"
        />
        <div className="max-h-[300px] overflow-y-auto mt-3">
          <div className="grid sm:grid-cols-3 gap-1 font-[manrope]">
            {loading ? (
              // Show skeleton loaders while loading
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
                    }`}
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
