
import { Education, Publication } from './../app/redux/api/getProfileApi';

// export interface UserProfile {
//   name: string;
//   id: string;
//   details: string;
//   title: string;
//   avatar: string;
//   location: string;
//   jobArea: string;
//   joiningDate: string;
//   followers: number;
//   following: number;
//   credentials: string;
//   year: string;
//   instagram: string;
//   linkedin: string;
//   twitter: string;
//   facebook: string;
//   practiceName: string;
// }

// export interface EducationItem {
//   title: string;
//   institute: string;
//   degree: string;
//   year: string;
// }

// export interface ExperienceItem {
//   role: string;
//   hospital: string;
//   location: string;
//   period: string;
//   specialty: string;
// }

// export interface PublicationItem {
//   title: string;
//   year: string;
//   author: string;
//   articleLink: string;
// }

// export interface ProfileData {
//   user: UserProfile;
//   education: EducationItem[];
//   experience: ExperienceItem[];
//   publications: PublicationItem[];
//   skills: string[];
//   questionBank: QuestionBankStats;
//   practiceName: string;
// }
// export interface QuestionBankStats {
//   completion: number;
//   ranking: number;
//   correctRate: number;
//   bestTopic: string;
// };
// export type ProfileTab = 'overview' | 'education' | 'experience'| 'publications' | 'activity';

export interface UserProfile {
  name: string;
  id: string;
  cv: string;
  bio: string;
  title: string;
  avatar: string;
  address: string;
  jobArea: string;
  country: string;
  state: string;
  created_at: string;
  followers: number;
  following: number;
  credentials: string;
  is_public: boolean;
  training_practice: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  current_practice: string;
  specialty: string;
}

export interface EducationItem {
  title: string;
  institute: string;
  degree: string;
  year: string;
}

export interface ExperienceItem{
  role: string;
  hospital: string;
  location: string;
  period: string;
  specialty: string;
}

export interface PublicationItem{
  title: string;
  year: string;
  author: string;
  articleLink: string;
}

export interface QuestionBankStats {
  completion: number;
  ranking: number | string;
  correctRate: number;
  bestTopic: string;
}

export interface statisticsItems {
  complete_percentage: number;
  correct_percentage: number;
  ranking: number;
  question_bank_usage: number;
  best_topic: topicItems | null;
}


export interface topicItems {
  name: string;
  correct_percentage: number;
}
export interface ProfileData {
  user: UserProfile;
  education: EducationItem[];
  experience: ExperienceItem[];
  publications: PublicationItem[];
  statistics: statisticsItems;
  skills: string[];
  practiceName: string;
}

export type ProfileTab =
  | 'overview'
  | 'education'
  | 'experience'
  | 'publications'
  | 'activity';