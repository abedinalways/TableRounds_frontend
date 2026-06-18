import type { Metadata } from 'next';
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
  description: 'Where healthcare providers come to learn and collaborate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${outfit.variable} ${inter.variable} ${fraunces.variable} ${garamond.variable} ${roboto.variable} ${jakarta.variable} antialiased`}
      >
          <Providers>
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
