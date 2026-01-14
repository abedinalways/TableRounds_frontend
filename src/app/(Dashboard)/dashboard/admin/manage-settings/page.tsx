
import AccountSettings from '@/components/admin-settings/AccountSettings';
import ManageProfile from '@/components/admin-settings/ManageProfile';
import React from 'react'

export default function SettingsPage() {
  return (
    <div className="font-[manrope]">
      <div className="my-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold ">
          Admin Profile
        </h2>
        <p className="text-12px] md:text-[18px] font-normal text-[#6b7280]">
          Manage your professional profile
        </p>
      </div>
      <div className=" w-full rounded-2xl  background h-[383px]"></div>
      <div className="profile-container">
        <div className="-mt-60">
          <ManageProfile />
        </div>
      <div className="profile-container">

      <AccountSettings />
      </div>
      </div>
    </div>
  );
}
