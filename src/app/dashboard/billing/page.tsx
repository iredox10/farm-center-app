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
    gradient: 'from-surface-container to-surface-container-lowest',
    borderGlow: 'border-outline-variant/50',
    popular: false,
  },
  pro: {
    icon: Zap,
    gradient: 'from-primary/10 to-primary/5',
    borderGlow: 'border-primary/30',
    popular: true,
  },
  business: {
    icon: Building2,
    gradient: 'from-amber-500/10 to-amber-500/5',
    borderGlow: 'border-amber-500/30',
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
        <h2 className="font-heading text-2xl font-bold text-on-surface">Billing</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Manage your subscription and payment history
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-label text-sm text-on-surface-variant mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-on-surface">
                  {currentPlan.name} Plan
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
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
              <span className="font-body text-xs text-on-surface-variant">Products used</span>
              <span className="font-body text-xs font-medium text-on-surface">
                {usage.productsUsed}/{currentPlan.maxProducts === Infinity ? '∞' : usage.productsMax}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-container overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  usagePercent >= 80
                    ? 'bg-red-500'
                    : 'bg-primary'
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
                'relative bg-white border rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] overflow-hidden transition-all hover:scale-[1.02] duration-300',
                display.borderGlow,
                display.popular && 'ring-1 ring-primary/20'
              )}
            >
              {/* Popular badge */}
              {display.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-secondary-container text-on-secondary-container text-xs font-label font-bold">
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
                        ? 'bg-surface-container'
                        : tierId === 'pro'
                          ? 'bg-primary/20'
                          : 'bg-amber-500/20'
                    )}
                  >
                    <TierIcon
                      className={cn(
                        'w-5 h-5',
                        tierId === 'free'
                          ? 'text-on-surface-variant'
                          : tierId === 'pro'
                            ? 'text-primary'
                            : 'text-amber-600'
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-on-surface">
                      {tier.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold text-on-surface">
                      {tier.priceMonthly === 0 ? '₦0' : formatPrice(tier.priceMonthly)}
                    </span>
                    <span className="font-body text-sm text-on-surface-variant">/mo</span>
                  </div>
                </div>

                {/* CTA Button */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-center text-sm font-label font-medium text-on-surface-variant">
                    Current Plan
                  </div>
                ) : (
                  <button className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-sm font-label font-bold hover:opacity-90 hover:scale-[1.02] transition-all">
                    {tierId === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => {
                    const FeatureIcon = FEATURE_ICONS[feature] || Check;
                    return (
                      <li key={feature} className="flex items-start gap-2.5 text-sm font-body">
                        <FeatureIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-on-surface-variant">{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* Feature limits */}
                <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-2">
                  {Object.entries(tier.limits).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-xs font-body">
                      {value ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-on-surface-variant" />
                      )}
                      <span className={cn(value ? 'text-on-surface-variant' : 'text-on-surface-variant')}>
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
      <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
        <h3 className="font-heading text-lg font-semibold text-on-surface mb-5">
          Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-on-surface-variant text-left font-label border-b border-outline-variant/50">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {PAYMENT_HISTORY.map((payment) => (
                <tr key={payment.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 font-body text-on-surface-variant">
                    {new Date(payment.date).toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 font-body text-on-surface">{payment.description}</td>
                  <td className="py-3 text-on-surface font-medium">
                    {payment.amount === 0 ? 'Free' : formatPrice(payment.amount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-label font-bold',
                        payment.status === 'success' && 'bg-green-50 text-green-600',
                        payment.status === 'pending' && 'bg-yellow-50 text-yellow-600',
                        payment.status === 'failed' && 'bg-red-50 text-red-600'
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
