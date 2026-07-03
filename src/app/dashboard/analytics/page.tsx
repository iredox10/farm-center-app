'use client';

import {
  BarChart3,
  Eye,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Lock,
  ArrowUpRight,
  Crown,
  Package,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

/* ─── Mock Data ─── */

const STATS = [
  {
    label: 'Total Views',
    value: '4,832',
    change: '+18.2%',
    trend: 'up' as const,
    icon: Eye,
    bgTint: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label: 'Total Orders',
    value: '48',
    change: '+12.5%',
    trend: 'up' as const,
    icon: ShoppingCart,
    bgTint: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    label: 'Revenue',
    value: formatPrice(385000),
    change: '+8.3%',
    trend: 'up' as const,
    icon: DollarSign,
    bgTint: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '+0.5%',
    trend: 'up' as const,
    icon: TrendingUp,
    bgTint: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
];

interface TopProduct {
  id: string;
  name: string;
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

const TOP_PRODUCTS: TopProduct[] = [
  { id: '1', name: 'iPhone 15 Pro Max 256GB', views: 1234, orders: 18, revenue: 17100000, conversionRate: 1.5 },
  { id: '2', name: 'Samsung Galaxy S24 Ultra', views: 987, orders: 12, revenue: 8640000, conversionRate: 1.2 },
  { id: '3', name: 'MacBook Air M3 2024', views: 756, orders: 5, revenue: 6000000, conversionRate: 0.7 },
  { id: '4', name: 'AirPods Pro 2nd Gen', views: 623, orders: 25, revenue: 4625000, conversionRate: 4.0 },
  { id: '5', name: 'JBL Flip 6 Speaker', views: 412, orders: 8, revenue: 600000, conversionRate: 1.9 },
];

/* ─── Weekly views mock data for bar chart ─── */

const WEEKLY_VIEWS = [
  { day: 'Mon', views: 180 },
  { day: 'Tue', views: 220 },
  { day: 'Wed', views: 310 },
  { day: 'Thu', views: 280 },
  { day: 'Fri', views: 420 },
  { day: 'Sat', views: 380 },
  { day: 'Sun', views: 190 },
];

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 85000 },
  { month: 'Feb', revenue: 120000 },
  { month: 'Mar', revenue: 95000 },
  { month: 'Apr', revenue: 180000 },
  { month: 'May', revenue: 220000 },
  { month: 'Jun', revenue: 385000 },
];

export default function AnalyticsPage() {
  const [currentTier] = useState<'free' | 'pro' | 'business'>('free');
  const isLocked = currentTier === 'free';

  /* Find max values for bar scaling */
  const maxViews = Math.max(...WEEKLY_VIEWS.map((d) => d.views));
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((d) => d.revenue));
  const maxProductViews = Math.max(...TOP_PRODUCTS.map((p) => p.views));

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Analytics</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Insights into your shop performance
          </p>
        </div>

        <div className="relative">
          {/* Blurred preview background */}
          <div className="space-y-6 filter blur-sm pointer-events-none select-none" aria-hidden="true">
            {/* Fake stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-5">
                    <div className="flex items-start justify-between">
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.bgTint)}>
                        <Icon className={cn('w-5 h-5', stat.iconColor)} />
                      </div>
                    </div>
                    <p className="mt-4 font-heading text-2xl font-bold text-on-surface">{stat.value}</p>
                    <p className="font-body text-sm text-on-surface-variant mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Fake chart */}
            <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
              <h3 className="font-heading text-lg font-semibold text-on-surface mb-4">Views This Week</h3>
              <div className="flex items-end gap-3 h-40">
                {WEEKLY_VIEWS.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-primary/20"
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                    />
                    <span className="font-body text-xs text-on-surface-variant">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center p-8 max-w-md bg-white border border-outline-variant/50 rounded-2xl shadow-lg">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
                <Lock className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-on-surface mb-2">
                Unlock Analytics
              </h3>
              <p className="font-body text-sm text-on-surface-variant mb-6">
                Upgrade to Pro to access detailed analytics, conversion tracking, and performance insights for your shop.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-on-primary text-sm font-label font-bold hover:opacity-90 hover:scale-[1.02] transition-all"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-on-surface">Analytics</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Track your shop performance and growth
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-5 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-start justify-between">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.bgTint)}>
                  <Icon className={cn('w-5 h-5', stat.iconColor)} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-label font-bold text-green-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 font-heading text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="font-body text-sm text-on-surface-variant mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views Chart */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-on-surface">Views This Week</h3>
            <span className="text-xs font-label font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
              +18.2% vs last week
            </span>
          </div>
          <div className="flex items-end gap-3 h-44">
            {WEEKLY_VIEWS.map((d) => {
              const height = (d.views / maxViews) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-body text-xs text-on-surface-variant">{d.views}</span>
                  <div className="w-full relative rounded-t-lg overflow-hidden bg-surface-container-highest" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-primary/40 rounded-t-lg" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                  </div>
                  <span className="font-body text-xs text-on-surface-variant">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-on-surface">Monthly Revenue</h3>
            <span className="text-xs font-label font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
              ₦385K this month
            </span>
          </div>
          <div className="flex items-end gap-3 h-44">
            {MONTHLY_REVENUE.map((d) => {
              const height = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-body text-xs text-on-surface-variant">{formatPrice(d.revenue).replace('.00', '')}</span>
                  <div className="w-full relative rounded-t-lg overflow-hidden bg-surface-container-highest" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-amber-500/40 rounded-t-lg" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                  </div>
                  <span className="font-body text-xs text-on-surface-variant">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
        <h3 className="font-heading text-lg font-semibold text-on-surface mb-5">
          Top Products by Views
        </h3>
        <div className="space-y-4">
          {TOP_PRODUCTS.map((product, index) => {
            const viewBarWidth = (product.views / maxProductViews) * 100;
            return (
              <div key={product.id} className="flex items-center gap-4">
                <span className="font-label text-sm font-bold text-on-surface-variant w-6 text-center shrink-0">
                  {index + 1}
                </span>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-on-surface-variant/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-on-surface truncate mb-1.5">
                    {product.name}
                  </p>
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${viewBarWidth}%` }}
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 shrink-0 font-body text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-on-surface">{product.views.toLocaleString()}</p>
                    <p className="text-xs text-on-surface-variant">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-on-surface">{product.orders}</p>
                    <p className="text-xs text-on-surface-variant">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-primary">{product.conversionRate}%</p>
                    <p className="text-xs text-on-surface-variant">Conv.</p>
                  </div>
                </div>
                <div className="md:hidden text-right shrink-0">
                  <p className="font-body text-sm font-semibold text-on-surface">{product.views.toLocaleString()}</p>
                  <p className="font-body text-xs text-on-surface-variant">views</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
