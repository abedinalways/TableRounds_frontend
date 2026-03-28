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
  location: string;
  document: string;
  avatar_url?: string | null;
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
  document: string;
  avatar_url?: string | null;
  currentPractice?: string;
  socialMedia?: string;
  action?: string;
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
