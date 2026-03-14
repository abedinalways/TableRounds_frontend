'use client';

import { useState } from 'react';
import { ProfileTab } from '@/types/myProfile';
import ProfileTabs from '@/components/my-profile/ProfileTabs';
import ManageProfile from '@/components/settings/ManageProfile';
import { useMeQuery } from '@/app/redux/api/authApi';
import { mapProfileToUI } from '@/utils/profileMapper';

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const { data, isLoading } = useMeQuery();

  if (isLoading || !data) return null;

  const profileUI = mapProfileToUI(data as any);

  return (
    <div className="font-[manrope]">
      <div className="my-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold">
          My Profile
        </h2>

        <p className="md:text-[18px] font-normal text-[#6b7280]">
          Manage your professional profile
        </p>
      </div>

      <div className="w-full rounded-2xl background h-[383px]" />

      <div className="profile-container">
        <div className="-mt-60">
          <ManageProfile user={profileUI.user} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={profileUI}
        />
      </div>
    </div>
  );
}
