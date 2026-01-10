
export interface UserProfile {
  name: string;
  details: string;
  title: string;
  avatar: string;
  location: string;
  jobArea: string;
  joiningDate: string;
  followers: number;
  following: number;
  
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
}
export interface QuestionBankStats {
  completion: number; 
  ranking: number;
  correctRate: number;
  bestTopic: string;
};
export type ProfileTab = 'overview' | 'education' | 'experience'| 'publications' | 'activity';
