'use client';
import { useGetHelpQuery } from '@/app/redux/api/helpApi';
import Disclaimer from '@/components/legal/Disclaimer'
import React from 'react'
 

export default function DisclaimerPage() {
  const { data, isLoading } = useGetHelpQuery();
    if (isLoading) {
      return <p className="p-10">Loading...</p>;
    }
    console.log(data, 'data=================')
    const helpData = data?.data?.[0];
    console.log(helpData, 'jjj===============')
  return (
    <div className="custom-container">
      <Disclaimer html={helpData?.disclaimer ?? ''} />
    </div>
  );
}
