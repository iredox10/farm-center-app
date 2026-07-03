import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import './globals.css';

const inter = Inter({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

// Using a fallback for Geist if not available locally, or we can just let globals.css handle it
// Since Next.js has next/font/google for Geist now (if Next.js >= 15), let's see. 
// The user's package.json has Next.js 16 (Turbopack). 
// Wait, globals.css has the @import url for Geist anyway, so let's just keep Inter here 
// and use globals.css for Geist. Or we can just import it from next/font/google.
import { Geist } from 'next/font/google';

const geist = Geist({
  variable: '--font-label',
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
  themeColor: '#f8f9ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background font-body pb-16 lg:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

