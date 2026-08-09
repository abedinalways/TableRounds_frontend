export type VerificationUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  avatar_url?: string | null;
};
export type PendingUser = {
  id: string;
  name: string;
  email: string;
  state?: string;
  location?: string;
  address?: string;
  document: string;
  avatar_url?: string | null;
  verifiy_document_url?: string | null;
  profile?: string;
  image?: string | null;
};

export type Activity = {
  id: string;
  message: string;
  time: string;
  icon?: string;
};


export type VerifiedUser = {
  id: string;
  name: string;
  email: string;
  location: string;
  state: string;
  document: string;
  avatar_url?: string | null;
  facebook: string;
  linkedin: string;
  twitter_x: string;
  instagram: string;
  currentPractice?: string;
  socialMedia?: string;
  action?: string;
  verifiy_document_url?: string | null;
  image?: string | null;
};

export type ReportedUser = {
  id: string;
  reportingUser: {
    name: string;
    avatar_url?: string | null;
    email: string;
  };
  reportedUser: {
    name: string;
    avatar_url?: string | null;
    email: string;
  };
};
