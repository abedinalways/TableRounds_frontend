'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Btn from '../reusable/button/Btn';
import { useRouter } from 'next/navigation';

interface ResetBankModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetBankModal({
  open,
  onClose,
  onConfirm,
}: ResetBankModalProps) {
    const router = useRouter();

    const handleConfirm = () => {
      onConfirm(); 
      onClose(); 
      router.push('/dashboard/create-test'); 
    };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-[manrope]">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Reset Question Bank
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to restart the question bank?
            <br />
            {/* <span className="text-red-500 font-medium">
              This action cannot be undone.
            </span> */}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Btn onClick={onClose} className="px-4 py-2 bg-gray-300">
            Cancel
          </Btn>

          <Btn
            className="bg-red-600 text-white px-4 py-2"
            onClick={handleConfirm}
          >
            Yes, Reset
          </Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
