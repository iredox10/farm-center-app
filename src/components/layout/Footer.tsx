import Link from 'next/link';
import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  ExternalLink,
} from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'About Us', href: '/about' },
];

const sellerLinks = [
  { label: 'Open a Shop', href: '/seller/register' },
  { label: 'Seller Dashboard', href: '/seller/dashboard' },
  { label: 'Pricing Plans', href: '/pricing' },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-primary text-on-primary">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary-container via-secondary to-primary-container" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-7 w-7 text-secondary" />
              <div>
                <span className="font-heading text-xl font-bold tracking-tight text-on-primary">
                  FarmCenter
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-on-primary-container max-w-xs font-body">
              Kano&apos;s premier electronics marketplace. Shop the latest phones,
              laptops, and accessories from trusted sellers at Farm Center.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 font-label text-sm font-semibold uppercase tracking-wider text-on-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-on-primary-container transition-colors duration-200 hover:text-secondary-container"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Sellers */}
          <div>
            <h3 className="mb-4 font-label text-sm font-semibold uppercase tracking-wider text-on-primary">
              For Sellers
            </h3>
            <ul className="space-y-3">
              {sellerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-on-primary-container transition-colors duration-200 hover:text-secondary-container"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-4 font-label text-sm font-semibold uppercase tracking-wider text-on-primary">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+2348000000000"
                  className="flex items-center gap-2.5 font-body text-sm text-on-primary-container transition-colors hover:text-secondary-container"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +234 800 000 0000
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-on-primary-container transition-colors hover:text-secondary-container"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@farmcentermarket.com"
                  className="flex items-center gap-2.5 font-body text-sm text-on-primary-container transition-colors hover:text-secondary-container"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  hello@farmcentermarket.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 font-body text-sm text-on-primary-container">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                Farm Center, Kano, Nigeria
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-container">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs font-label text-on-primary-container">
            &copy; {new Date().getFullYear()} Farm Center Market. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-on-primary-container transition-colors hover:text-secondary-container"
              aria-label="Website"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-on-primary-container transition-colors hover:text-secondary-container"
              aria-label="Social"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-on-primary-container transition-colors hover:text-secondary-container"
              aria-label="More"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs font-label text-on-primary-container transition-colors hover:text-on-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs font-label text-on-primary-container transition-colors hover:text-on-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
