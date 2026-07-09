import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | TableRounds',
  description:
    'Explore TableRounds pricing plans. Choose the best option for your board-style question bank preparation and community access.',
  openGraph: {
    title: 'Pricing | TableRounds',
    description:
      'Explore TableRounds pricing plans. Choose the best option for your board-style question bank preparation and community access.',
    url: '/pricing',
  },
  twitter: {
    title: 'Pricing | TableRounds',
    description:
      'Explore TableRounds pricing plans. Choose the best option for your board-style question bank preparation and community access.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}