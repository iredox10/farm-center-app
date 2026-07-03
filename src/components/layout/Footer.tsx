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
    <footer className="relative mt-auto">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="bg-navy-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                  <ShoppingBag className="h-5 w-5 text-navy-950" />
                </div>
                <div>
                  <span className="font-heading text-lg font-bold text-green-400">
                    Farm Center
                  </span>{' '}
                  <span className="font-heading text-lg font-bold text-gold-400">
                    Market
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-text-muted max-w-xs">
                Kano&apos;s premier electronics marketplace. Shop the latest phones,
                laptops, and accessories from trusted sellers at Farm Center.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors duration-200 hover:text-green-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: For Sellers */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
                For Sellers
              </h3>
              <ul className="space-y-3">
                {sellerLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors duration-200 hover:text-green-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-text-primary">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+2348000000000"
                    className="flex items-center gap-2.5 text-sm text-text-muted transition-colors hover:text-green-400"
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
                    className="flex items-center gap-2.5 text-sm text-text-muted transition-colors hover:text-green-400"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@farmcentermarket.com"
                    className="flex items-center gap-2.5 text-sm text-text-muted transition-colors hover:text-green-400"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    hello@farmcentermarket.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-text-muted">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  Farm Center, Kano, Nigeria
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Farm Center Market. All rights reserved.
            </p>

            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-text-muted transition-colors hover:text-green-400"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-text-muted transition-colors hover:text-green-400"
                aria-label="Social"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-text-muted transition-colors hover:text-green-400"
                aria-label="More"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
