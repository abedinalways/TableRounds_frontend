
export interface MenuItem {
  title: string;
  href: string;
  icon: string;
  section?: string;
  
}

export const adminMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: '/images/dashboard/img01.png',
  },
  {
    title: 'Users',
    href: '/dashboard/admin/show-users',
    icon: '/images/dashboard/img02.png',
  },
  {
    title: 'Create Questions',
    href: '/dashboard/admin/create-questions',
    icon: '/images/dashboard/img03.png',
  },
  {
    title: 'Question Manager',
    href: '/dashboard/admin/question-manager',
    icon: '/images/dashboard/img04.png',
  },

  {
    title: 'Messages',
    href: '/dashboard/admin/support-message',
    icon: '/images/dashboard/img007.png',
  },
  {
    title: 'Admin Profile',
    href: '/dashboard/admin/manage-settings',
    icon: '/images/dashboard/img00008.png',
  },

  // OTHER SECTION
  {
    section: 'Other',
    title: 'Legal',
    href: '/dashboard/admin/help-support',
    icon: '/images/dashboard/img08.png',
  },
  // {
  //   title: 'Settings',
  //   href: '/dashboard/manage-settings',
  //   icon: '/images/dashboard/img09.png',
  // },
  {
    title: 'Logout',
    href: '/login',
    icon: '/images/dashboard/img10.png',
  },
];

export const userMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/user',
    icon: '/images/dashboard/img01.png',
  },
  {
    title: 'Create Test',
    href: '/dashboard/user/create-test',
    icon: '/images/dashboard/img02.png',
  },
  {
    title: 'Previous Tests',
    href: '/dashboard/user/previous-test',
    icon: '/images/dashboard/img03.png',
  },
  {
    title: 'Statistics',
    href: '/dashboard/user/statistics',
    icon: '/images/dashboard/img04.png',
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/user/leaderboard',
    icon: '/images/dashboard/img05.png',
  },
  {
    title: 'Reset Bank',
    href: '/dashboard/user/reset-bank',
    icon: '/images/dashboard/img06.png',
  },
  {
    title: 'Messages',
    href: '/dashboard/user/messages',
    icon: '/images/dashboard/img007.png',
  },
  {
    title: 'My Profile',
    href: '/dashboard/user/my-profile',
    icon: '/images/dashboard/img00008.png',
  },

  // OTHER SECTION
  {
    section: 'Other',
    title: 'Help & Support',
    href: '/dashboard/user/support',
    icon: '/images/dashboard/img08.png',
  },

  {
    title: 'Logout',
    href: '/login',
    icon: '/images/dashboard/img10.png',
  },
];
