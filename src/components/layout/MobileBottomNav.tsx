'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const totalItems = getItemCount();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/login', icon: User }, // Or /dashboard if logged in
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant/30 bg-surface pb-safe lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Cart' && pathname === '/checkout');
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-16 h-full gap-1"
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isActive ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name === 'Cart' && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-on-error">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-on-surface' : 'text-on-surface-variant'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
