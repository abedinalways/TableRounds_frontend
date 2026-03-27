export type VerificationUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  avatar_url?: string;
  
};
export type PendingUser = {
  id: string;
  name: string;
  email: string;
  location: string;
  document: string;
  avatar_url?: string;
  profile?: string;
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
  avatar_url?: string;
  currentPractice?: string;
  socialMedia?: string;
  action?: string;
};

export type ReportedUser = {
  id: string;
  reportingUser: {
    name: string;
    avatar_url?: string;
    email: string;
  };
  reportedUser: {
    name: string;
    avatar_url?: string;
    email: string;
  };
};
