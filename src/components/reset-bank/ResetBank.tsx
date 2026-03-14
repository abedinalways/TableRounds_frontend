'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

interface ResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResetBank({ open, onOpenChange, onConfirm }: ResetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-red-500 text-lg font-semibold">
            Reset Question Bank
          </DialogTitle>

          <DialogDescription className="text-gray-600 mt-2">
            Are you sure you want to restart the question bank?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-3 justify-end">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
