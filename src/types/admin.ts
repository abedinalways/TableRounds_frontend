export type VerificationUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  image?: string;
  
};
export type PendingUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  image?: string;
  profile?: string;
};

export type Activity = {
  id: number;
  message: string;
  time: string;
  icon?: string;
};


export type VerifiedUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  image?: string;
  currentPractice?: string;
  socialMedia?: string;
  action?: string;
};

export type ReportedUser = {
  id: number;
  reportingUser: {
    name: string;
    image?: string;
    email: string;
  };
  reportedUser: {
    name: string;
    image?: string;
    email: string;
  };
};
