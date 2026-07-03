'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, Users, DollarSign, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Shops', href: '/admin/shops', icon: Store },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Commissions', href: '/admin/commissions', icon: DollarSign },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-outline-variant/50 hidden md:flex flex-col">
      <div className="p-6 border-b border-outline-variant/50">
        <h1 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/50">
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-error hover:bg-error-container transition-colors font-medium"
         >
           <LogOut className="w-5 h-5" />
           <span>Logout</span>
         </button>
      </div>
    </aside>
  );
}
