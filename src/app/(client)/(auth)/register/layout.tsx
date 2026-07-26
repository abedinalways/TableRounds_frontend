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
    siteName: 'TableRounds',
    type: 'website',
    images: [
      {
        url: '/footer-logo.png',
        width: 600,
        height: 300,
        alt: 'TableRounds Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register | TableRounds',
    description:
      'Create your TableRounds account. Join a vetted community of surgeons, dentists, and trainees with board-style question banks and performance tracking.',
    images: ['/footer-logo.png'],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}