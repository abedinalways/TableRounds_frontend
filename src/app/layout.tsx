import type { Metadata, Viewport } from 'next';
import {
  EB_Garamond,
  Fraunces,
  Inter,
  Manrope,
  Outfit,
  Plus_Jakarta_Sans,
  Roboto,
} from 'next/font/google';
import '../styles/globals.css';

import { Toaster } from 'sonner';


import { Providers } from './Providers';
import AuthProvider from './AuthProvider';
import { OfflineBanner } from '@/components/pwa/offline-banner';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { InstallPrompt } from '@/components/pwa/install-prompt';
;

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-fraunces',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const garamond = EB_Garamond({
  variable: '--font-garamond',
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: 'TableRounds',
  description:
    'TableRounds is a clinician-built platform that brings board-style question banks and a vetted community of surgeons, dentists, and trainees into one place. Create a verified profile, work through specialty-tagged questions with detailed explanations, track your performance by topic, and connect with colleagues who are equally invested in maintaining a high standard of practice',
  metadataBase: new URL('https://tablerounds.ai'),
  manifest: '/manifest.webmanifest',
  applicationName: 'TableRounds',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TableRounds',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  //preview for Facebook, WhatsApp, LinkedIn
  openGraph: {
    title: 'TableRounds',
    description:
      'TableRounds is a clinician-built platform that brings board-style question banks and a vetted community of surgeons, dentists, and trainees into one place.',
    url: '/',  // ✅ Relative path — metadataBase converts it to absolute
    siteName: 'TableRounds',
    type: 'website',
    images: [
      {
        url: '/footer-logo.png',  // ✅ Relative — metadataBase converts to absolute
        width: 600,
        height: 300,
        alt: 'TableRounds Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TableRounds',
    description:
      'TableRounds is a clinician-built platform that brings board-style question banks and a vetted community of surgeons, dentists, and trainees into one place.',
    images: ['/footer-logo.png'],  // ✅ Relative — metadataBase converts to absolute
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#01503b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${outfit.variable} ${inter.variable} ${fraunces.variable} ${garamond.variable} ${roboto.variable} ${jakarta.variable} antialiased`}
      >
          <Providers>
        <OfflineBanner />
        <ServiceWorkerRegister />
        <InstallPrompt />
        <AuthProvider>
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
              }}
            />
            {children}
        </AuthProvider>
          </Providers>
      </body>
    </html>
  );
}
