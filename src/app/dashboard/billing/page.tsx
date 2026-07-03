'use client';

import { useState } from 'react';
import {
  Check,
  X,
  Crown,
  Zap,
  Building2,
  Package,
  Image as ImageIcon,
  Video,
  Palette,
  BarChart3,
  HeadphonesIcon,
  Star,
  Shield,
  CreditCard,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { SUBSCRIPTION_TIERS } from '@/lib/config/subscriptions';

/* ─── Tier Display Config ─── */

interface TierDisplay {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderGlow: string;
  popular: boolean;
}

const TIER_DISPLAY: Record<string, TierDisplay> = {
  free: {
    icon: Package,
    gradient: 'from-white/10 to-white/5',
    borderGlow: 'border-white/10',
    popular: false,
  },
  pro: {
    icon: Zap,
    gradient: 'from-green-400/15 to-green-600/5',
    borderGlow: 'border-green-400/30',
    popular: true,
  },
  business: {
    icon: Building2,
    gradient: 'from-gold-400/15 to-gold-500/5',
    borderGlow: 'border-gold-400/30',
    popular: false,
  },
};

/* ─── Feature Display Map ─── */

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Up to 10 product listings': Package,
  'Up to 50 product listings': Package,
  'Unlimited product listings': Package,
  '5 images per product': ImageIcon,
  '8 images per product': ImageIcon,
  '8 images + 2 videos per product': ImageIcon,
  '1 video per product': Video,
  'Basic storefront customization': Palette,
  'Full storefront customization': Palette,
  'Sales analytics dashboard': BarChart3,
  'Advanced analytics & reports': BarChart3,
  'Priority customer support': HeadphonesIcon,
  'Featured shop placement': Star,
  'Paystack payment integration': CreditCard,
  'WhatsApp order support': Shield,
};

/* ─── Mock Payment History ─── */

interface PaymentHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
}

const PAYMENT_HISTORY: PaymentHistoryItem[] = [
  { id: '1', date: '2026-07-01', description: 'Pro Plan - July 2026', amount: 5000, status: 'success' },
  { id: '2', date: '2026-06-01', description: 'Pro Plan - June 2026', amount: 5000, status: 'success' },
  { id: '3', date: '2026-05-01', description: 'Pro Plan - May 2026', amount: 5000, status: 'success' },
  { id: '4', date: '2026-04-01', description: 'Free Plan Activation', amount: 0, status: 'success' },
];

export default function BillingPage() {
  const [currentTier] = useState<'free' | 'pro' | 'business'>('free');
  const currentPlan = SUBSCRIPTION_TIERS[currentTier];

  /* Mock usage stats */
  const usage = {
    productsUsed: 3,
    productsMax: currentPlan.maxProducts,
  };

  const usagePercent =
    currentPlan.maxProducts === Infinity
      ? 0
      : Math.min((usage.productsUsed / usage.productsMax) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-text-primary">Billing</h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage your subscription and payment history
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-gold-400/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  {currentPlan.name} Plan
                </h3>
                <p className="text-sm text-text-secondary">
                  {currentPlan.priceMonthly === 0
                    ? 'Free forever'
                    : `${formatPrice(currentPlan.priceMonthly)}/month`}
                </p>
              </div>
            </div>
          </div>

          {/* Usage meter */}
          <div className="w-full md:w-64">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted">Products used</span>
              <span className="text-xs font-medium text-text-primary">
                {usage.productsUsed}/{currentPlan.maxProducts === Infinity ? '∞' : usage.productsMax}
              </span>
            </div>
            <div className="h-2 rounded-full bg-navy-800 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  usagePercent >= 80
                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                    : 'bg-gradient-to-r from-green-400 to-green-500'
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(SUBSCRIPTION_TIERS) as Array<'free' | 'pro' | 'business'>).map((tierId) => {
          const tier = SUBSCRIPTION_TIERS[tierId];
          const display = TIER_DISPLAY[tierId];
          const TierIcon = display.icon;
          const isCurrent = currentTier === tierId;

          return (
            <div
              key={tierId}
              className={cn(
                'relative glass-card overflow-hidden transition-all hover:scale-[1.02] duration-300',
                display.borderGlow,
                display.popular && 'ring-1 ring-green-400/20'
              )}
            >
              {/* Popular badge */}
              {display.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className={cn('p-6 bg-gradient-to-br', display.gradient)}>
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center',
                      tierId === 'free'
                        ? 'bg-white/10'
                        : tierId === 'pro'
                          ? 'bg-green-400/20'
                          : 'bg-gold-400/20'
                    )}
                  >
                    <TierIcon
                      className={cn(
                        'w-5 h-5',
                        tierId === 'free'
                          ? 'text-text-secondary'
                          : tierId === 'pro'
                            ? 'text-green-400'
                            : 'text-gold-400'
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {tier.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold text-text-primary">
                      {tier.priceMonthly === 0 ? '₦0' : formatPrice(tier.priceMonthly)}
                    </span>
                    <span className="text-sm text-text-muted">/mo</span>
                  </div>
                </div>

                {/* CTA Button */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium text-text-secondary">
                    Current Plan
                  </div>
                ) : (
                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all">
                    {tierId === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => {
                    const FeatureIcon = FEATURE_ICONS[feature] || Check;
                    return (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <FeatureIcon className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* Feature limits */}
                <div className="mt-4 pt-4 border-t border-white/6 space-y-2">
                  {Object.entries(tier.limits).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      {value ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span className={cn(value ? 'text-text-secondary' : 'text-text-muted')}>
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (s) => s.toUpperCase())
                          .trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment History */}
      <div className="glass-card p-6">
        <h3 className="font-heading text-lg font-semibold text-text-primary mb-5">
          Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-left border-b border-white/6">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {PAYMENT_HISTORY.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 text-text-muted">
                    {new Date(payment.date).toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 text-text-primary">{payment.description}</td>
                  <td className="py-3 text-text-primary font-medium">
                    {payment.amount === 0 ? 'Free' : formatPrice(payment.amount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        payment.status === 'success' && 'bg-green-500/10 text-green-400',
                        payment.status === 'pending' && 'bg-yellow-500/10 text-yellow-400',
                        payment.status === 'failed' && 'bg-red-500/10 text-red-400'
                      )}
                    >
                      {payment.status === 'success' && <Check className="w-3 h-3" />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
