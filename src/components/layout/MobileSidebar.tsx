'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  X,
  Home,
  Grid3x3,
  ShoppingBag,
  Store,
  ClipboardList,
  LogIn,
  UserPlus,
  ChevronDown,
  Smartphone,
  Laptop,
  Headphones,
  Battery,
  Cable,
  Monitor,
  User,
} from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'Phones', icon: Smartphone, href: '/categories/phones' },
  { name: 'Laptops', icon: Laptop, href: '/categories/laptops' },
  { name: 'Audio', icon: Headphones, href: '/categories/audio' },
  { name: 'Power Banks', icon: Battery, href: '/categories/power-banks' },
  { name: 'Accessories', icon: Cable, href: '/categories/accessories' },
  { name: 'Monitors', icon: Monitor, href: '/categories/monitors' },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const isLoggedIn = false;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-[100] h-full w-[300px] max-w-[85vw] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-surface-container-lowest border-r border-outline-variant shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-outline-variant/50">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
                  <User className="h-5 w-5 text-on-secondary-container" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface font-heading tracking-tight">
                    Welcome back
                  </p>
                  <p className="text-xs text-on-surface-variant font-body">user@example.com</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="font-heading text-lg font-bold text-primary tracking-tight">
                  FarmCenter
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <SidebarLink href="/" icon={Home} label="Home" onClick={onClose} />

            {/* Categories with expand */}
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex w-full items-center justify-between rounded-md px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              <span className="flex items-center gap-3">
                <Grid3x3 className="h-5 w-5" />
                <span className="text-sm font-label font-medium">Categories</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  categoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                categoriesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="ml-4 space-y-0.5 border-l border-outline-variant/50 pl-4 mt-1 mb-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-body text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                  >
                    <cat.icon className="h-4 w-4 text-secondary" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <SidebarLink
              href="/shops"
              icon={Store}
              label="Shops"
              onClick={onClose}
            />
            <SidebarLink
              href="/orders"
              icon={ClipboardList}
              label="My Orders"
              onClick={onClose}
            />
            <SidebarLink
              href="/dashboard"
              icon={ShoppingBag}
              label="My Shop"
              onClick={onClose}
            />
          </nav>

          {/* Auth Links */}
          {!isLoggedIn && (
            <div className="border-t border-outline-variant/50 p-4 space-y-3 bg-surface-container-low">
              <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-outline-variant px-4 py-3 text-sm font-label font-medium text-primary transition-all hover:bg-surface-container"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-label font-semibold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-label font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}
