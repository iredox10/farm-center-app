'use client';

import { DollarSign, Store, Clock, ShoppingBag, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Metrics {
  totalRevenue: string;
  activeShops: string;
  pendingApprovals: string;
  totalOrders: string;
}

export default function AdminOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/admin/metrics');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const stats = [
    { name: 'Total Revenue', value: metrics?.totalRevenue || '₦0', icon: DollarSign, change: '+0%' },
    { name: 'Active Shops', value: metrics?.activeShops || '0', icon: Store, change: '+0%' },
    { name: 'Pending Approvals', value: metrics?.pendingApprovals || '0', icon: Clock, change: '0' },
    { name: 'Total Orders', value: metrics?.totalOrders || '0', icon: ShoppingBag, change: '+0%' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Overview</h1>
          <p className="text-on-surface-variant mt-2">Welcome to the Farm Center Admin Dashboard.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="card bg-white p-6 flex flex-col border border-outline-variant/50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-secondary' : 'text-error'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-on-surface-variant font-medium text-sm">{stat.name}</h3>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* Chart placeholder */}
          <div className="mt-8 card bg-white p-6 h-96 flex flex-col justify-center items-center border border-outline-variant/50 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <DollarSign className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-outline font-medium">Revenue Chart (Coming Soon)</p>
          </div>
        </>
      )}
    </div>
  );
}
