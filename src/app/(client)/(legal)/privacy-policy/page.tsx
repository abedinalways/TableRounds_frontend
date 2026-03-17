'use client';
import { useGetHelpQuery } from '@/app/redux/api/helpApi';
import PrivacyPolicy from '@/components/legal/PrivacyPolicy'
import React from 'react'

export default function PrivacyPolicyPage() {
  const { data, isLoading } = useGetHelpQuery();
  if (isLoading) {
    return <p className="p-10">Loading...</p>;
  }
  console.log(data, 'data=================')
  const helpData = data?.data?.[0];
  console.log(helpData, 'jjj===============')
  return (
    <div className="custom-container">
      <PrivacyPolicy html={helpData?.privacy_policy ?? ''} />
    </div>
  );
}
