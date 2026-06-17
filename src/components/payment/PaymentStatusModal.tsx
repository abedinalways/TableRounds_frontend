'use client';

import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: 'success' | 'cancel' | null;
  onClose: () => void;
}

export default function PaymentStatusModal({
  isOpen,
  status,
  onClose,
}: PaymentStatusModalProps) {
  if (!isOpen || !status) return null;

  const isSuccess = status === 'success';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-6 text-center shadow-xl border border-gray-50 relative font-[manrope] space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center pt-2">
          {isSuccess ? (
            <div className="bg-[#e2f0db] p-3 rounded-full text-[#01503b]">
              <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="bg-red-50 p-3 rounded-full text-red-500">
              <XCircle className="w-12 h-12" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-gray-900">
            {isSuccess ? 'Payment Successful!' : 'Payment Cancelled'}
          </h3>
          <p className="text-sm text-gray-500 px-2">
            {isSuccess
              ? 'Thank you for your purchase! Your premium plan features have been successfully unlocked and activated.'
              : 'The transaction was not completed. If this was an error, please check your card details and try again.'}
          </p>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer mt-2 ${
            isSuccess
              ? 'bg-[#01503b] hover:bg-[#01281e]'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isSuccess ? 'Go to Dashboard' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}
