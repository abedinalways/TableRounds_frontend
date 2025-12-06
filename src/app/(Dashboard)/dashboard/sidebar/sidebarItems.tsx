
export interface MenuItem {
  title: string;
  href: string;

}

export const adminMenu: MenuItem[] = [
  { title: 'Dashboard', href: '/dashboard/admin' },
  { title: 'Doctors', href: '/dashboard/admin/doctors' },
  { title: 'Users', href: '/dashboard/admin/users' },
  { title: 'Appointments', href: '/dashboard/admin/appointments' },
];

export const userMenu: MenuItem[] = [
  { title: 'Dashboard', href: '/dashboard/user' },
  { title: 'My Appointments', href: '/dashboard/user/appointments' },
  { title: 'Profile', href: '/dashboard/user/profile' },
];
