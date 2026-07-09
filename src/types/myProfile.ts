
export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  cv: string;
  title: string;
  avatar: string;
  is_public: boolean;
  address: string;
  created_at: string;
  jobArea: string;
  // joiningDate: string;
  followers: number;
  following: number;
  credentials: string;
  training_practice: string;
  country: string;
  state: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  current_practice: string;
  specialty: string;
}

export interface EducationItem {
  id?: string;
  title: string;
  institute: string;
  degree: string;
  year: string;
}

export interface ExperienceItem {
  role: string;
  hospital: string;
  location: string;
  period: string;
  description?: string;
  specialty?: string;
  id?: string;
  
}

export interface PublicationItem {
  title: string;
  year: string;
  author: string;
  articleLink: string;
}
export interface statisticsItems {
  complete_percentage: number;
  correct_percentage: number;
  ranking: number;
  best_topic: topicItems | null;
  question_bank_usage: number;
}
export interface topicItems{
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
  // questionBank: QuestionBankStats;

}
export interface QuestionBankStats {
  completion: number;
  ranking: number;
  correctRate: number;
  bestTopic: string;
}
export type ProfileTab =
  | 'overview'
  | 'education'
  | 'experience'
  | 'publications'
  | 'activity';
