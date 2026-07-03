'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  Palette,
  CreditCard,
  BarChart3,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'My Shop', href: '/dashboard/shop', icon: Store },
  { label: 'Customize', href: '/dashboard/shop/customize', icon: Palette },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
] as const;

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Overview';
  const match = NAV_ITEMS.find(
    (item) => item.href !== '/dashboard' && pathname.startsWith(item.href)
  );
  if (match) return match.label;
  if (pathname.includes('/products/new')) return 'Add Product';
  if (pathname.includes('/products/') && pathname.includes('/edit')) return 'Edit Product';
  return 'Dashboard';
}

function SidebarSkeleton() {
  return (
    <div className="flex h-screen">
      <aside className="hidden lg:flex w-64 flex-col bg-navy-900/80 border-r border-white/6">
        <div className="p-6">
          <div className="skeleton h-8 w-36 rounded-lg" />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-11 w-full rounded-lg" />
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/6 bg-navy-900/50 flex items-center justify-between px-6">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="flex items-center gap-4">
            <div className="skeleton h-9 w-9 rounded-full" />
            <div className="skeleton h-9 w-9 rounded-full" />
          </div>
        </header>
        <main className="flex-1 p-6 space-y-6">
          <div className="skeleton h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading, initialize } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (avatarDropdownOpen && !target.closest('[data-avatar-dropdown]')) {
        setAvatarDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [avatarDropdownOpen]);

  if (isLoading || !user) {
    return <SidebarSkeleton />;
  }

  const displayName = profile?.fullName || user.name || 'Seller';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          'bg-navy-900/80 backdrop-blur-xl border-r border-white/6',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-navy-950" />
            </div>
            <span className="font-heading font-bold text-lg text-text-primary">
              Farm Center
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-green-400 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-green-400'
                      : 'text-text-muted group-hover:text-text-secondary'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/6">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Current Plan</p>
            <p className="text-sm font-semibold text-green-400">Free Plan</p>
            <Link
              href="/dashboard/billing"
              className="mt-2 block text-center text-xs font-medium px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 border-b border-white/6 bg-navy-900/50 backdrop-blur-lg flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-heading font-semibold text-lg text-text-primary">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text-primary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full ring-2 ring-navy-900" />
            </button>

            {/* User avatar dropdown */}
            <div className="relative" data-avatar-dropdown>
              <button
                onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold text-navy-950">
                  {initials}
                </div>
                <span className="hidden md:block text-sm font-medium text-text-primary max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={cn(
                    'hidden md:block w-4 h-4 text-text-muted transition-transform duration-200',
                    avatarDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {avatarDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 rounded-xl border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/6 mb-1">
                    <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/shop"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setAvatarDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Shop
                  </Link>
                  <Link
                    href="/dashboard/shop"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setAvatarDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      setAvatarDropdownOpen(false);
                      await useAuthStore.getState().logout();
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
