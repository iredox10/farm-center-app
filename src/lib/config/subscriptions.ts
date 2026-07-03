import type { SubscriptionTier, Shop } from '@/types';

// ─── Tier Definitions ───

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier['id'], SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    currency: 'NGN',
    maxProducts: 10,
    maxImagesPerProduct: 5,
    maxVideosPerProduct: 0,
    features: [
      'Up to 10 product listings',
      '5 images per product',
      'Basic storefront customization',
      'Paystack payment integration',
      'WhatsApp order support',
    ],
    limits: {
      customStorefront: false,
      analytics: false,
      advancedAnalytics: false,
      prioritySupport: false,
      featuredPlacement: false,
      videoUpload: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 5000,
    currency: 'NGN',
    maxProducts: 50,
    maxImagesPerProduct: 8,
    maxVideosPerProduct: 1,
    features: [
      'Up to 50 product listings',
      '8 images per product',
      '1 video per product',
      'Full storefront customization',
      'Sales analytics dashboard',
      'Paystack payment integration',
      'WhatsApp order support',
    ],
    limits: {
      customStorefront: true,
      analytics: true,
      advancedAnalytics: false,
      prioritySupport: false,
      featuredPlacement: false,
      videoUpload: true,
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    priceMonthly: 15000,
    currency: 'NGN',
    maxProducts: Infinity,
    maxImagesPerProduct: 8,
    maxVideosPerProduct: 2,
    features: [
      'Unlimited product listings',
      '8 images + 2 videos per product',
      'Full storefront customization',
      'Advanced analytics & reports',
      'Priority customer support',
      'Featured shop placement',
      'Paystack payment integration',
      'WhatsApp order support',
    ],
    limits: {
      customStorefront: true,
      analytics: true,
      advancedAnalytics: true,
      prioritySupport: true,
      featuredPlacement: true,
      videoUpload: true,
    },
  },
};

// ─── Helper Functions ───

/**
 * Get the full tier configuration for a subscription level.
 */
export function getTierLimits(tier: SubscriptionTier['id']): SubscriptionTier {
  return SUBSCRIPTION_TIERS[tier];
}

/**
 * Check whether a shop can add more products based on its tier limits.
 */
export function canUploadMore(shop: Shop): boolean {
  const tier = SUBSCRIPTION_TIERS[shop.subscriptionTier];
  return shop.productCount < tier.maxProducts;
}

/**
 * Check whether a specific feature is available for a given tier.
 */
export function getFeatureAccess(
  tier: SubscriptionTier['id'],
  feature: keyof SubscriptionTier['limits']
): boolean {
  return SUBSCRIPTION_TIERS[tier].limits[feature];
}
