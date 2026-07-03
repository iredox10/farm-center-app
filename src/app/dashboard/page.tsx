'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Eye,
  Plus,
  ExternalLink,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';

/* ─── Mock Data ─── */

const STATS = [
  {
    label: 'Total Products',
    value: '12',
    change: '+2 this week',
    trend: 'up' as const,
    icon: Package,
    color: 'from-green-400 to-green-600',
    bgTint: 'bg-green-400/10',
  },
  {
    label: 'Total Orders',
    value: '48',
    change: '+5 this week',
    trend: 'up' as const,
    icon: ShoppingCart,
    color: 'from-blue-400 to-blue-600',
    bgTint: 'bg-blue-400/10',
  },
  {
    label: 'Total Revenue',
    value: formatPrice(385000),
    change: '+12.5%',
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'from-gold-400 to-gold-500',
    bgTint: 'bg-gold-400/10',
  },
  {
    label: 'Views This Month',
    value: '1,234',
    change: '-3.2%',
    trend: 'down' as const,
    icon: Eye,
    color: 'from-purple-400 to-purple-600',
    bgTint: 'bg-purple-400/10',
  },
];

const SPARKLINE_PATHS: Record<string, string> = {
  'Total Products': 'M0,20 L8,18 L16,15 L24,16 L32,12 L40,8 L48,10 L56,5',
  'Total Orders': 'M0,18 L8,15 L16,17 L24,10 L32,12 L40,6 L48,8 L56,3',
  'Total Revenue': 'M0,22 L8,20 L16,18 L24,15 L32,12 L40,10 L48,6 L56,4',
  'Views This Month': 'M0,8 L8,10 L16,6 L24,12 L32,15 L40,13 L48,18 L56,16',
};

interface MockOrder {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

const RECENT_ORDERS: MockOrder[] = [
  { id: '1', orderNumber: 'FC-20260701-A3F1', customer: 'Adaeze Okonkwo', amount: 45000, status: 'delivered', date: '2026-07-01' },
  { id: '2', orderNumber: 'FC-20260701-B7C2', customer: 'Emeka Nwankwo', amount: 12500, status: 'processing', date: '2026-07-01' },
  { id: '3', orderNumber: 'FC-20260630-D4E8', customer: 'Fatima Suleiman', amount: 78000, status: 'paid', date: '2026-06-30' },
  { id: '4', orderNumber: 'FC-20260630-F1G9', customer: 'Chidi Okafor', amount: 23500, status: 'pending', date: '2026-06-30' },
  { id: '5', orderNumber: 'FC-20260629-H6J3', customer: 'Blessing Eze', amount: 95000, status: 'shipped', date: '2026-06-29' },
];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  paid: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  processing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  shipped: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

export default function DashboardOverview() {
  const [copied, setCopied] = useState(false);
  const shopSlug = 'my-tech-store';

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://farmcentermarket.com/shop/${shopSlug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-gold-400/5" />
        <div className="relative z-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
            Welcome back, <span className="gradient-text">TechVille Store</span> 👋
          </h2>
          <p className="mt-2 text-text-secondary max-w-lg">
            Here&apos;s what&apos;s happening with your shop today. Keep up the great work!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const sparkPath = SPARKLINE_PATHS[stat.label] || '';
          return (
            <div
              key={stat.label}
              className="glass-card p-5 group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center',
                    stat.bgTint
                  )}
                >
                  <Icon className={cn('w-5 h-5 bg-gradient-to-br bg-clip-text', stat.color === 'from-green-400 to-green-600' ? 'text-green-400' : stat.color === 'from-blue-400 to-blue-600' ? 'text-blue-400' : stat.color === 'from-gold-400 to-gold-500' ? 'text-gold-400' : 'text-purple-400')} />
                </div>
                {/* Sparkline */}
                <svg
                  width="56"
                  height="24"
                  viewBox="0 0 56 24"
                  className="opacity-40 group-hover:opacity-70 transition-opacity"
                >
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke={stat.trend === 'up' ? '#00f5a0' : '#f87171'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-4 font-heading text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm text-text-muted">{stat.label}</p>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              Recent Orders
            </h3>
            <Link
              href="/dashboard/orders"
              className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-left border-b border-white/6">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {RECENT_ORDERS.map((order) => {
                  const statusStyle = STATUS_STYLES[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-white/2 transition-colors"
                    >
                      <td className="py-3 text-text-primary font-mono text-xs">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-text-secondary">{order.customer}</td>
                      <td className="py-3 text-text-primary font-medium">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                            statusStyle.bg,
                            statusStyle.text
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-text-muted text-xs">
                        {new Date(order.date).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {RECENT_ORDERS.map((order) => {
              const statusStyle = STATUS_STYLES[order.status];
              return (
                <div key={order.id} className="p-3 rounded-xl bg-white/3 border border-white/4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-text-muted">{order.orderNumber}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        statusStyle.bg,
                        statusStyle.text
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">{order.customer}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-semibold text-text-primary">{formatPrice(order.amount)}</span>
                    <span className="text-xs text-text-muted">
                      {new Date(order.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-green-400/10 to-green-600/10 border border-green-400/20 hover:border-green-400/40 hover:scale-[1.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                <Plus className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Add Product</p>
                <p className="text-xs text-text-muted">List a new item for sale</p>
              </div>
            </Link>

            <Link
              href={`/shop/${shopSlug}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 hover:scale-[1.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ExternalLink className="w-5 h-5 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">View Shop</p>
                <p className="text-xs text-text-muted">See your public storefront</p>
              </div>
            </Link>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 hover:scale-[1.02] transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Share2 className="w-5 h-5 text-text-secondary" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {copied ? 'Link Copied!' : 'Share Shop Link'}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  {copied ? 'Ready to paste' : 'Copy your store URL'}
                  {!copied && <Copy className="w-3 h-3" />}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
