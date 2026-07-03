import type { Metadata, Viewport } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Farm Center Market — Kano's #1 Electronics Marketplace",
  description:
    'Discover the best phones, laptops, and accessories from trusted sellers at Farm Center, Kano. Shop new and UK-used electronics at unbeatable prices.',
  keywords: [
    'Farm Center',
    'Kano',
    'electronics',
    'phones',
    'laptops',
    'marketplace',
    'Nigeria',
  ],
  openGraph: {
    title: "Farm Center Market — Kano's #1 Electronics Marketplace",
    description:
      'Discover the best phones, laptops, and accessories from trusted sellers at Farm Center, Kano.',
    siteName: 'Farm Center Market',
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Farm Center Market — Kano's #1 Electronics Marketplace",
    description:
      'Shop new and UK-used electronics at unbeatable prices from Kano.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f0f23',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy-950 text-text-primary font-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
