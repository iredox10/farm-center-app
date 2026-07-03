'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Menu,
  ShoppingBag,
  User,
  ChevronDown,
  Smartphone,
  Laptop,
  Headphones,
  Battery,
  Cable,
  Monitor,
  Bell,
  Store,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import MobileSidebar from './MobileSidebar';
import CartDrawer from './CartDrawer';

const categories = [
  { name: 'Phones', icon: Smartphone, href: '/categories/phones' },
  { name: 'Laptops', icon: Laptop, href: '/categories/laptops' },
  { name: 'Audio', icon: Headphones, href: '/categories/audio' },
  { name: 'Power Banks', icon: Battery, href: '/categories/power-banks' },
  { name: 'Accessories', icon: Cable, href: '/categories/accessories' },
  { name: 'Monitors', icon: Monitor, href: '/categories/monitors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const totalItems = getItemCount();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-surface-container-highest shadow-sm lg:shadow-[0_10px_20px_-5px_rgba(4,22,39,0.08)]'
            : 'bg-[#e9f0fa] lg:bg-surface border-b lg:border-outline-variant/30 border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4 lg:h-[72px]">
            {/* Left: Mobile Logo & Desktop Hamburger + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="flex items-center gap-1.5 shrink-0">
                <Store className="h-5 w-5 text-on-surface lg:text-primary" />
                <span className="font-heading text-lg font-bold text-on-surface lg:text-primary tracking-tight">
                  FarmCenter
                </span>
              </Link>
            </div>

            {/* Center: Search bar (desktop only) */}
            <div className="hidden flex-1 max-w-2xl lg:block px-8">
              <div className="group relative shadow-[0_4px_12px_rgba(4,22,39,0.03)] rounded-lg bg-surface-container-lowest border border-outline-variant focus-within:border-secondary-container transition-colors duration-200 flex items-center px-4 py-2">
                <Search className="h-5 w-5 text-on-surface-variant mr-3 group-focus-within:text-secondary" />
                <input
                  type="text"
                  placeholder="Search phones, laptops, accessories..."
                  className="w-full bg-transparent border-none focus:ring-0 font-body text-base text-on-surface placeholder:text-outline p-0 outline-none"
                />
              </div>
            </div>

            {/* Right: Mobile Bell & Desktop Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Notification Bell */}
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-black/5 hover:text-on-surface lg:hidden"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>

              {/* Category dropdown (desktop) */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onBlur={() =>
                    setTimeout(() => setCategoryDropdownOpen(false), 200)
                  }
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-label font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      categoryDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg transition-all duration-200 ${
                    categoryDropdownOpen
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="p-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-label text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <cat.icon className="h-4 w-4 text-secondary" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart button (desktop only) */}
              <button
                onClick={() => { if (!isCartOpen) toggleCart(); }}
                className="hidden relative h-10 w-10 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary lg:flex"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {isMounted && totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-on-error shadow-sm ring-2 ring-surface-container-lowest">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth buttons (desktop only) */}
              <div className="hidden items-center gap-3 lg:flex pl-2 border-l border-outline-variant/50">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-label font-medium text-on-surface-variant transition-all hover:text-primary hover:bg-surface-container"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-label font-semibold text-on-primary transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-14 lg:h-[72px]" />

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <CartDrawer />
    </>
  );
}
