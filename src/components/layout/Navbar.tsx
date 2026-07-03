'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Menu,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  Smartphone,
  Laptop,
  Headphones,
  Battery,
  Cable,
  Monitor,
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const totalItems = getItemCount();

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
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-navy-950/80 shadow-lg shadow-black/20 backdrop-blur-2xl border-b border-white/5'
            : 'bg-navy-950/50 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/20">
                  <ShoppingBag className="h-5 w-5 text-navy-950" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-heading text-lg font-bold text-green-400">
                    Farm Center
                  </span>{' '}
                  <span className="font-heading text-lg font-bold text-gold-400">
                    Market
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search bar (desktop) */}
            <div className="hidden flex-1 max-w-xl lg:block">
              <div className="group relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-green-400" />
                <input
                  type="text"
                  placeholder="Search phones, laptops, accessories..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-green-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-green-400/30 focus:shadow-[0_0_20px_rgba(0,245,160,0.08)]"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary lg:hidden"
                aria-label="Search"
              >
                {mobileSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>

              {/* Category dropdown (desktop) */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onBlur={() =>
                    setTimeout(() => setCategoryDropdownOpen(false), 200)
                  }
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  Categories
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      categoryDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 backdrop-blur-2xl shadow-2xl transition-all duration-200 ${
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
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                      >
                        <cat.icon className="h-4 w-4 text-green-400/70" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart button */}
              <button
                onClick={() => { if (!isCartOpen) toggleCart(); }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-400 px-1.5 text-[10px] font-bold text-navy-950 animate-[cart-badge_0.3s_ease-out]">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth buttons (desktop) */}
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-green-400/30 hover:text-text-primary hover:bg-white/5"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-400 px-4 py-2 text-sm font-semibold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/20 active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile search bar (expanded) */}
          <div
            className={`overflow-hidden transition-all duration-300 lg:hidden ${
              mobileSearchOpen ? 'max-h-20 pb-3' : 'max-h-0'
            }`}
          >
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-green-400" />
              <input
                type="text"
                placeholder="Search phones, laptops, accessories..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-all duration-300 focus:border-green-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-green-400/30"
              />
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <CartDrawer />
    </>
  );
}
