export interface UserProfile {
  name: string;
  details: string;
  title: string;
  avatar: string;
  followers: number;
  following: number;
}

export interface EducationItem {
  title: string;
  institute: string;
  year: string;
}

export interface ExperienceItem {
  role: string;
  hospital: string;
  period: string;
}

export interface PublicationItem {
  title: string;
  year: string;
}

export interface ProfileData {
  user: UserProfile;
  education: EducationItem[];
  experience: ExperienceItem[];
  publications: PublicationItem[];
  skills: string[];
}

export type ProfileTab = 'overview' | 'education' | 'experience' | 'activity';
