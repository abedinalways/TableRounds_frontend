// navbar.types.ts
export interface SpecialityOption {
  value: string;
  label: string;
  href: string;
}

export interface CurrentUser {
  name?: string;
  avatar?: string;
  email?: string;
  type?: string;
}
