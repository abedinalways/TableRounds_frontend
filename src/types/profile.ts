
export interface UserProfile {
  name: string;
  id: string;
  details: string;
  title: string;
  avatar: string;
  location: string;
  jobArea: string;
  joiningDate: string;
  followers: number;
  following: number;
  credentials: string;
  year: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  practiceName: string;
}

export interface EducationItem {
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
  specialty: string;
}

export interface PublicationItem {
  title: string;
  year: string;
  author: string;
  articleLink: string;
}

export interface ProfileData {
  user: UserProfile;
  education: EducationItem[];
  experience: ExperienceItem[];
  publications: PublicationItem[];
  skills: string[];
  questionBank: QuestionBankStats;
  practiceName: string;
}
export interface QuestionBankStats {
  completion: number; 
  ranking: number;
  correctRate: number;
  bestTopic: string;
};
export type ProfileTab = 'overview' | 'education' | 'experience'| 'publications' | 'activity';
