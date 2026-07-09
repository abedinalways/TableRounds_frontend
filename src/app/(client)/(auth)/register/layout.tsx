import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | TableRounds',
  description:
    'Create your TableRounds account. Join a vetted community of surgeons, dentists, and trainees with board-style question banks and performance tracking.',
  openGraph: {
    title: 'Register | TableRounds',
    description:
      'Create your TableRounds account. Join a vetted community of surgeons, dentists, and trainees with board-style question banks and performance tracking.',
    url: '/register',
  },
  twitter: {
    title: 'Register | TableRounds',
    description:
      'Create your TableRounds account. Join a vetted community of surgeons, dentists, and trainees with board-style question banks and performance tracking.',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}