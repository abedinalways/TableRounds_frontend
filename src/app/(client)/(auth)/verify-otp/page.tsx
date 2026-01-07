import VerifyOtp from '@/components/verify-otp/VerifyOtp'
import React, { Suspense } from 'react'

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
}
