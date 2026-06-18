'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success('Payment authorized successfully!');
    
    router.replace(
      '/dashboard/user/financial-management?tab=history&status=success',
    );
  }, [router]);

  return (
    <div className="min-screen flex flex-col items-center justify-center p-24 font-[manrope] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#01503b]" />
      <h3 className="text-lg font-bold text-gray-800">
        Verifying your payment...
      </h3>
      <p className="text-xs text-gray-400">
        Please wait while we unlock your premium options.
      </p>
    </div>
  );
}
