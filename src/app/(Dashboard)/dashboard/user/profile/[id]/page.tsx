'use client';

import { useState, use } from 'react';
import { ProfileTab } from '@/types/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useGetProfileDataQuery } from '@/app/redux/api/getProfileApi';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const { data, isLoading, error } = useGetProfileDataQuery(id);

  const apiData = data;

  console.log(apiData, '=======colleague data');

  if (isLoading)
    return <div className="p-10 text-center">Loading profile...</div>;

  if (error || !apiData)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading profile.
      </div>
    );

 const formattedData = {
   user: {
     name: apiData.name,
     id: apiData.id,

     avatar: apiData.avatar
       ? apiData.avatar.startsWith('http')
         ? apiData.avatar
         : `${apiData.avatar}`
       : '/images/settings/img01.png',

     title: apiData.training_practice || 'Medical Professional',
     location: apiData.address || 'Location not set',
     jobArea: apiData.current_practice || 'General Practice',
     joiningDate: 'March 2025',

     details: apiData.bio || 'No bio available.',

     followers: apiData.followers ?? 0,
     following: apiData.followings ?? 0,

     credentials: apiData.credentials ?? '',
     year: apiData.educations?.[0]?.year ?? '',
     instagram: apiData.instagram ?? '',
     linkedin: apiData.linkedin ?? '',
     twitter: apiData.twitter_x ?? '',
     facebook: apiData.facebook ?? '',
     practiceName: apiData.current_practice ?? '',
   },

   // ✅ FIXED
   education: (apiData.educations ?? []).map((edu: any) => ({
     title: edu.degree,
     institute: edu.institute,
     degree: edu.description,
     year: edu.year,
   })),

   // ✅ FIXED
   experience: (apiData.experiences ?? []).map((exp: any) => ({
     role: exp.position,
     hospital: exp.company,
     location: exp.location,
     period: `${exp.start_date} - ${exp.end_date}`,
     specialty: exp.specialty ?? '',
   })),

   // ✅ FIXED
   publications: (apiData.publications ?? []).map((pub: any) => ({
     title: pub.title,
     year: pub.year,
     author: pub.topic,
     articleLink: pub.link,
   })),

   skills: (apiData.skills ?? []).map((skill: any) => skill.name),

   questionBank: {
     completion: 0,
     ranking: 0,
     correctRate: 0,
     bestTopic: '',
   },

   practiceName: apiData.current_practice ?? '',
 };

  return (
    <div>
      <div className="w-full rounded-2xl background h-[383px]" />

      <div className="profile-container">
        <div className="-mt-60">
          <ProfileHeader user={formattedData.user} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={formattedData}
        />
      </div>
    </div>
  );
}
