
export interface NavItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownKey?: 'speciality' | 'legal';
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Specialties', hasDropdown: true, dropdownKey: 'speciality' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Legal', hasDropdown: true, dropdownKey: 'legal' },
  { label: 'Contact', href: '/contact' },
];

export const legalOptions = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Terms of Use', href: '/terms-conditions' },
];
