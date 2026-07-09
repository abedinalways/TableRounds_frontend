import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | TableRounds',
  description:
    'Sign in to your TableRounds account to access board-style question banks, track your performance, and connect with colleagues.',
  openGraph: {
    title: 'Login | TableRounds',
    description:
      'Sign in to your TableRounds account to access board-style question banks, track your performance, and connect with colleagues.',
    url: '/login',
  },
  twitter: {
    title: 'Login | TableRounds',
    description:
      'Sign in to your TableRounds account to access board-style question banks, track your performance, and connect with colleagues.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}