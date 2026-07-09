import {
  ProfileData,
  Education,
  Experience,
  Publication,
  Skill,
} from '@/app/redux/api/getProfileApi';

import { ProfileData as ProfileUIData } from '@/types/myProfile';

export function mapProfileToUI(data: ProfileData): ProfileUIData {
  
  const specialty =
    data.specialty ??
   
    data.current_practice ??
    'Medical Professional';

  return {
    user: {
      id: data.id,
      cv: data.cv ?? '',
      name: data.name || '',
      bio: data.bio || '',
      title: data.credentials || '',
      avatar: data.avatar || '',
      address: data.address || '',
      jobArea: data.current_practice || '',
      country: data.country || '',
      state: data.state || '',
      followers: data.followers || 0,
      following: data?.followings || 0,
      is_public: data.is_public,
      credentials: data.credentials ?? '',
      training_practice: data.training_practice ?? '',
      instagram: data.instagram ?? '',
      linkedin: data.linkedin ?? '',
      twitter: data.twitter_x ?? '',
      facebook: data.facebook ?? '',
      current_practice: data.current_practice ?? '',
      created_at: data.created_at ?? '',
      specialty: specialty,
    },

    education: (data.educations ?? []).map((edu: Education) => ({
      title: edu.degree,
      institute: edu.institute,
      degree: edu.description,
      year: edu.year,
    })),

    experience: (data.experiences ?? []).map((exp: Experience) => ({
      role: exp.position,
      hospital: exp.company,
      location: exp.location,
      period: `${exp.start_date} - ${exp.end_date}`,
      description: '',
    })),

    publications: (data.publications ?? []).map((pub: Publication) => ({
      title: pub.title,
      year: pub.year,
      author: pub.topic,
      articleLink: pub.link,
    })),

    skills: (data.skills ?? []).map((skill: Skill) => skill.name),

    statistics: {
      complete_percentage: data.statistics?.complete_percentage ?? 0,
      correct_percentage: data.statistics?.correct_percentage ?? 0,
      ranking: data.statistics?.ranking ?? 0,
      best_topic: data.statistics?.best_topic ?? null,
      question_bank_usage:data?.statistics?.question_bank_usage?? 0
    },
  };
}
