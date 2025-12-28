export type VerificationUser = {
  id: number;
  name: string;
  email: string;
  location: string;
  document: string;
  image?: string;
};

export type Activity = {
  id: number;
  message: string;
  time: string;
  icon?: string;
};
