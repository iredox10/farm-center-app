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
    <div className="flex h-screen bg-[#fafafa]">
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-outline-variant/50">
        <div className="p-6">
          <div className="animate-pulse h-8 w-36 rounded-lg bg-surface-container" />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="animate-pulse h-11 w-full rounded-lg bg-surface-container" />
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-outline-variant/50 bg-white flex items-center justify-between px-6">
          <div className="animate-pulse h-6 w-32 rounded bg-surface-container" />
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-9 w-9 rounded-full bg-surface-container" />
            <div className="animate-pulse h-9 w-9 rounded-full bg-surface-container" />
          </div>
        </header>
        <main className="flex-1 p-6 space-y-6">
          <div className="animate-pulse h-32 w-full rounded-2xl bg-white" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-28 w-full rounded-2xl bg-white" />
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
    <div className="flex h-screen overflow-hidden bg-[#fafafa] font-body">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          'bg-white border-r border-outline-variant/50',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/50">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Store className="w-5 h-5 text-on-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-on-surface">
              Farm Center
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-label font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface-variant group-hover:text-primary'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-outline-variant/50">
          <div className="bg-white border border-outline-variant/50 p-3 rounded-xl shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
            <p className="text-xs font-body text-on-surface-variant mb-1">Current Plan</p>
            <p className="text-sm font-heading font-semibold text-primary">Free Plan</p>
            <Link
              href="/dashboard/billing"
              className="mt-2 block text-center text-xs font-label font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 border-b border-outline-variant/50 bg-white/80 backdrop-blur-lg flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-heading font-semibold text-lg text-on-surface">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            </button>

            {/* User avatar dropdown */}
            <div className="relative" data-avatar-dropdown>
              <button
                onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-container transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-label font-bold text-on-primary">
                  {initials}
                </div>
                <span className="hidden md:block text-sm font-label font-medium text-on-surface max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={cn(
                    'hidden md:block w-4 h-4 text-on-surface-variant transition-transform duration-200',
                    avatarDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {avatarDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white p-2 rounded-xl border border-outline-variant/50 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-outline-variant/50 mb-1">
                    <p className="text-sm font-heading font-medium text-on-surface truncate">{displayName}</p>
                    <p className="text-xs font-body text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/shop"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-label text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    onClick={() => setAvatarDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Shop
                  </Link>
                  <Link
                    href="/dashboard/shop"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-label text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-label text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
