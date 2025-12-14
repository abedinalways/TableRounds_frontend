
export interface MenuItem {
  title: string;
  href: string;
  icon: string;
  section?: string;
}

export const adminMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '/images/dashboard/img01.png',
  },
  {
    title: 'Create Test',
    href: '/dashboard/create-test',
    icon: '/images/dashboard/img02.png',
  },
  {
    title: 'Previous Test',
    href: '/dashboard/previous-test',
    icon: '/images/dashboard/img03.png',
  },
  {
    title: 'Statistics',
    href: '/dashboard/statistics',
    icon: '/images/dashboard/img04.png',
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: '/images/dashboard/img05.png',
  },
  {
    title: 'Reset Question Bank',
    href: '/dashboard/reset-question-bank',
    icon: '/images/dashboard/img06.png',
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: '/images/dashboard/img07.png',
  },

  // OTHER SECTION
  {
    section: 'Other',
    title: 'Help & Support',
    href: '/dashboard/support',
    icon: '/images/dashboard/img08.png',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: '/images/dashboard/img09.png',
  },
  {
    title: 'Logout',
    href: '/dashboard/logout',
    icon: '/images/dashboard/img10.png',
  },
];

export const userMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '/images/dashboard/img01.png',
  },
  {
    title: 'Create Test',
    href: '/dashboard/create-test',
    icon: '/images/dashboard/img02.png',
  },
  {
    title: 'Previous Test',
    href: '/dashboard/previous-test',
    icon: '/images/dashboard/img03.png',
  },
  {
    title: 'Statistics',
    href: '/dashboard/statistics',
    icon: '/images/dashboard/img04.png',
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: '/images/dashboard/img05.png',
  },
  {
    title: 'Reset Question Bank',
    href: '/dashboard/reset-question-bank',
    icon: '/images/dashboard/img06.png',
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: '/images/dashboard/img07.png',
  },

  // OTHER SECTION
  {
    section: 'Other',
    title: 'Help & Support',
    href: '/dashboard/support',
    icon: '/images/dashboard/img08.png',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: '/images/dashboard/img09.png',
  },
  {
    title: 'Logout',
    href: '/dashboard/logout',
    icon: '/images/dashboard/img10.png',
  },
];
