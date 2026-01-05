'use client';

import { useState } from 'react';
import { profileData } from '../../../../lib/data/myProfile-data';
import { ProfileTab } from '@/types/myProfile';
import ProfileHeader from '@/components/my-profile/ProfileHeader';
import ProfileTabs from '@/components/my-profile/ProfileTabs';
import ManageProfile from '@/components/settings/ManageProfile';

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  return (
    <div className="font-[manrope]">
      <div className="my-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold ">
          My Profile
        </h2>
        <p className="text-12px] md:text-[18px] font-normal text-[#6b7280]">
          Manage your professional profile
        </p>
      </div>
      <div className=" w-full rounded-2xl  background h-[383px]"></div>
      <div className="profile-container">
        <div className="-mt-60">
          
          <ManageProfile user={profileData.user} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={profileData}
        />
      </div>
      <div>

      </div>
    </div>
  );
}
