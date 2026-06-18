'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard/user/payment?tab=history&status=success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-[manrope]">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center space-y-4 border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-[#e2f0db] p-3 rounded-full text-[#01503b]">
            <CheckCircle2 className="w-16 h-16 animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-950">
          Payment Successful!
        </h2>
        <p className="text-sm text-gray-500">
          Thank you for your purchase. We are activating your subscription
          features and redirecting you to your dashboard...
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 pt-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#01503b]" />
          Redirecting shortly...
        </div>
      </div>
    </div>
  );
}
