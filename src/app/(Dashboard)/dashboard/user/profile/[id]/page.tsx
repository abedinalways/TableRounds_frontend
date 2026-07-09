/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, use } from 'react';
import { ProfileTab } from '@/types/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useGetProfileDataQuery } from '@/app/redux/api/getProfileApi';
import { ProfilePageSkeleton } from '@/components/user-profile/ProfilePageSkeleton';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const { data, isLoading, error } = useGetProfileDataQuery(id);

  const apiData = data;

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (error || !apiData) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading profile.
      </div>
    );
  }

  const getFullCountryName = (countryCode: string | null | undefined) => {
    if (!countryCode) return '';
    if (countryCode.length !== 2) return countryCode;

    try {
      
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode.toUpperCase()) || countryCode;
    } catch (error) {
      return countryCode;
    }
  };
  const specialty =
    apiData.specialty ??
    
    apiData.current_practice ??
    'Medical Professional';

  const formattedData = {
    user: {
      name: apiData.name,
      id: apiData.id,
      cv: apiData.cv ?? '',
      avatar: apiData.avatar
        ? apiData.avatar.startsWith('http')
          ? apiData.avatar
          : `${apiData.avatar}`
        : '/images/settings/img01.png',

      title: apiData.training_practice || 'Medical Professional',
      address: apiData.address || 'Location not set',
      jobArea: apiData.current_practice || 'General Practice',
      created_at: apiData.created_at,
      is_public: apiData.is_public,
      bio: apiData.bio || 'No bio available.',
      country: getFullCountryName(apiData.country),
      state: apiData.state,
      followers: apiData.followers ?? 0,
      following: apiData.followings ?? 0,
      credentials: apiData.credentials ?? '',
      training_practice: apiData.training_practice ?? '',
      instagram: apiData.instagram ?? '',
      linkedin: apiData.linkedin ?? '',
      twitter: apiData.twitter_x ?? '',
      facebook: apiData.facebook ?? '',
      current_practice: apiData.current_practice ?? '',
      specialty: specialty,
    },

    education: (apiData.educations ?? []).map((edu: any) => ({
      title: edu.degree,
      institute: edu.institute,
      degree: edu.description,
      year: edu.year,
    })),

    experience: (apiData.experiences ?? []).map((exp: any) => ({
      role: exp.position,
      hospital: exp.company,
      location: exp.location,
      period: `${exp.start_date} - ${exp.end_date}`,
      specialty: exp.specialty ?? '',
    })),

    publications: (apiData.publications ?? []).map((pub: any) => ({
      title: pub.title,
      year: pub.year,
      author: pub.topic,
      articleLink: pub.link,
    })),

    skills: (apiData.skills ?? []).map((skill: any) => skill.name),

    statistics: {
      complete_percentage: apiData.statistics?.complete_percentage ?? 0,
      correct_percentage: apiData.statistics?.correct_percentage ?? 0,
      ranking: apiData.statistics?.ranking ?? 0,
      best_topic: apiData.statistics?.best_topic ?? null,
      question_bank_usage:apiData?.statistics?.question_bank_usage?? 0
    },

    practiceName: apiData.current_practice ?? '',
  };

  
  return (
    <div>
      <div className="w-full rounded-2xl background h-[383px]" />

      <div className="profile-container">
        <div className="-mt-60">
          <ProfileHeader user={formattedData.user} id={formattedData.user.id} />
        </div>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={formattedData}
          profileUserId={id}
          cv={formattedData.user.cv}
        />
      </div>
    </div>
  );
}
