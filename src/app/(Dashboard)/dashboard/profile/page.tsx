'use client';

import { useState } from 'react';
import { profileData } from '../../../../lib/data/profile-data';
import { ProfileTab } from '@/types/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  return (
    <div className="relative ">
      <div className=" w-full rounded-2xl  background h-[383px]"></div>
      <div className="profile-container ">
        <div className="absolute top-10 max-w-full mx-auto ">
          <ProfileHeader user={profileData.user} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={profileData}
        />
      </div>
    </div>
  );
}
