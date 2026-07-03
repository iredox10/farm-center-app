import Link from 'next/link';
import { LayoutDashboard, Store, Users, DollarSign, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-outline-variant/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-outline-variant/50">
          <h1 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/admin/shops" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
            <Store className="w-5 h-5" />
            <span className="font-medium">Shops</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Users</span>
          </Link>
          <Link href="/admin/commissions" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Commissions</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-outline-variant/50">
           <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-error hover:bg-error-container transition-colors">
             <LogOut className="w-5 h-5" />
             <span className="font-medium">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
