import type { Metadata } from 'next';
import {
  EB_Garamond,
  Inter,
  Manrope,
  Outfit,
  Plus_Jakarta_Sans,
  Roboto,
} from 'next/font/google';
import '../styles/globals.css';

import { Toaster } from 'sonner';


import { Providers } from './Providers';
import AuthProvider from './AuthProvider'


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
  title: 'Amrounds',
  description: 'Doctors App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${outfit.variable} ${inter.variable} ${outfit.variable} ${garamond.variable} ${roboto.variable} ${jakarta.variable} antialiased`}
      >
        <Providers>
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
      {children}
        </Providers>
      </body>
    </html>
  );
}
