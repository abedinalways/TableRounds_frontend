import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | TableRounds',
  description:
    'Get in touch with the TableRounds team. We are here to help with any questions about our board-style question banks and community platform.',
  openGraph: {
    title: 'Contact Us | TableRounds',
    description:
      'Get in touch with the TableRounds team. We are here to help with any questions about our board-style question banks and community platform.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Us | TableRounds',
    description:
      'Get in touch with the TableRounds team. We are here to help with any questions about our board-style question banks and community platform.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}