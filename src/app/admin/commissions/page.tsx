'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Search, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Payout {
  shopId: string;
  shopName: string;
  totalSales: number;
  platformCut: number;
  sellerPayout: number;
}

interface CommissionData {
  metrics: {
    totalOrderVolume: number;
    totalPlatformCommission: number;
    commissionRate: number;
  };
  payouts: Payout[];
}

export default function AdminCommissions() {
  const [data, setData] = useState<CommissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const res = await fetch('/api/admin/commissions');
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayouts = data?.payouts.filter((p) =>
    p.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-primary" />
            Commissions & Payouts
          </h1>
          <p className="text-on-surface-variant mt-2">Track platform revenue and seller earnings.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
              <h3 className="text-on-surface-variant font-medium text-sm">Total Order Volume</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                {formatPrice(data?.metrics.totalOrderVolume || 0)}
              </p>
            </div>
            <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
              <h3 className="text-on-surface-variant font-medium text-sm">Platform Commission Earned</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatPrice(data?.metrics.totalPlatformCommission || 0)}
              </p>
            </div>
            <div className="card bg-white p-6 border border-outline-variant/50 rounded-2xl">
              <h3 className="text-on-surface-variant font-medium text-sm">Current Rate</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                {data?.metrics.commissionRate}%
              </p>
            </div>
          </div>

          <div className="card bg-white overflow-hidden border border-outline-variant/50 rounded-2xl">
            <div className="p-4 border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-primary">Shop Earnings</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-primary"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant/50">
                    <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap">Shop Name</th>
                    <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Total Sales</th>
                    <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Platform Cut</th>
                    <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-right">Seller Payout</th>
                    <th className="px-6 py-4 font-semibold text-on-surface-variant text-sm whitespace-nowrap text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                        No commission data available.
                      </td>
                    </tr>
                  ) : (
                    filteredPayouts.map((p) => (
                      <tr key={p.shopId} className="border-b border-outline-variant/50 hover:bg-surface-container/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{p.shopName}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">{formatPrice(p.totalSales)}</td>
                        <td className="px-6 py-4 text-right text-red-600 font-medium whitespace-nowrap">-{formatPrice(p.platformCut)}</td>
                        <td className="px-6 py-4 text-right text-green-600 font-bold whitespace-nowrap">{formatPrice(p.sellerPayout)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                             Pending
                           </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
