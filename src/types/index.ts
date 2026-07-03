// ─── User & Auth ───

export interface UserProfile {
  userId: string;
  fullName: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  avatarUrl: string;
  createdAt: string;
}

// ─── Shop ───

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoFileId: string;
  bannerFileId: string;
  phone: string;
  whatsapp: string;
  location: string;
  primaryColor: string;
  secondaryColor: string;
  fontChoice: string;
  layoutStyle: string;
  announcementText: string;
  allowPayOnDelivery: boolean;
  allowWhatsappOrder: boolean;
  isVerified: boolean;
  isActive: boolean;
  productCount: number;
  subscriptionTier: 'free' | 'pro' | 'business';
  createdAt: string;
  physicalAuditDate?: string;
  ratingAverage?: number;
  reviewCount?: number;
}

export interface ShopSettings {
  id: string;
  shopId: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialTiktok: string;
  aboutText: string;
  returnPolicy: string;
  deliveryInfo: string;
}

// ─── Product ───

export type ProductCondition = 'new' | 'uk-used' | 'refurbished';

export interface Product {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  currency: string;
  stockQuantity: number;
  condition: ProductCondition;
  categoryIds: string[];
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  certificationStatus?: 'none' | 'certified';
  batteryHealth?: number;
  testingWarrantyDays?: number;
}

export interface Review {
  id: string;
  productId: string;
  shopId: string;
  buyerId: string;
  buyerName: string;
  rating: number; // 1 to 5 stars
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductMedia {
  id: string;
  productId: string;
  fileId: string;
  type: 'image' | 'video';
  sortOrder: number;
  isPrimary: boolean;
}

// ─── Category ───

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string;
}

// ─── Order ───

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'paystack' | 'pay_on_delivery' | 'whatsapp';

export interface Order {
  id: string;
  buyerId: string;
  shopId: string;
  orderNumber: string;
  totalAmount: number;
  commissionAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ─── Subscription ───

export interface SubscriptionTier {
  id: 'free' | 'pro' | 'business';
  name: string;
  priceMonthly: number;
  currency: string;
  maxProducts: number;
  maxImagesPerProduct: number;
  maxVideosPerProduct: number;
  features: string[];
  limits: {
    customStorefront: boolean;
    analytics: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    featuredPlacement: boolean;
    videoUpload: boolean;
  };
}

// ─── Payment ───

export type PaymentLogType = 'order_payment' | 'subscription' | 'refund' | 'commission';
export type PaymentLogStatus = 'pending' | 'success' | 'failed';

export interface PaymentLog {
  id: string;
  userId: string;
  orderId: string;
  type: PaymentLogType;
  amount: number;
  reference: string;
  status: PaymentLogStatus;
  createdAt: string;
}

// ─── Cart ───

export interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  shopName: string;
  slug: string;
}
