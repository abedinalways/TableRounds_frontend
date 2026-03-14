import {
  ProfileData,
  Education,
  Experience,
  Publication,
  Skill,
} from '@/app/redux/api/getProfileApi';

import { ProfileData as ProfileUIData } from '@/types/myProfile';


export function mapProfileToUI(data: ProfileData): ProfileUIData {
  return {
    user: {
      id: data.id,
      name: data.name || '',
      details: data.bio || '',
      title: data.credentials || '',
      avatar: data.avatar || '',
      location: data.address || '',
      jobArea: data.current_practice || '',
      joiningDate: data.training_practice || '',
      followers: data.followers || 0,
      following: data.followings || 0,
      credentials: data.credentials ?? '',
      year: data.educations?.[0]?.year ?? '',
      instagram: data.instagram ?? '',
      linkedin: data.linkedin ?? '',
      twitter: data.twitter_x ?? '',
      facebook: data.facebook ?? '',
      practiceName: data.current_practice ?? '',
    },

    // Safely handle potential undefined arrays
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

    questionBank: {
      completion: 0,
      ranking: 0,
      correctRate: 0,
      bestTopic: '',
    },
  };
}
