'use client'
import { useGetHelpQuery } from '@/app/redux/api/helpApi';
import TermsConditions from '@/components/legal/TermsConditions'
import React from 'react'

export default function TermsConditionsPage() {
  const { data, isLoading } = useGetHelpQuery();
      if (isLoading) {
        return <p className="p-10">Loading...</p>;
      }
      // console.log(data, 'data=================')
      const helpData = data?.data?.[0];
      // console.log(helpData, 'jjj===============')
  return (
    <div className="custom-container">
      <TermsConditions html={helpData?.terms_of_conditions ?? ''} />
    </div>
  );
}
