'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Heart, Share2, Copy, Check, ChevronLeft, ChevronRight,
  MapPin, CheckCircle, Minus, Plus, MessageCircle, Store, Tag, Star,
  ChevronDown, ChevronUp, Zap, ExternalLink, Package, ShieldCheck, Award,
  User
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import type { Product, Review } from '@/types';

/* ── Mock Data ── */
const mockProduct = {
  id: 'prod-1',
  shopId: 'shop-1',
  name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
  slug: 'iphone-15-pro-max-256gb',
  description: `This iPhone 15 Pro Max features the A17 Pro chip, a 48MP Main camera with 5x Telephoto, and an aerospace-grade titanium design. Comes with USB-C connector, up to 29 hours of video playback, and the stunning Super Retina XDR display with ProMotion technology.

Key Features:
• A17 Pro chip — the most powerful chip ever in a smartphone
• 48MP Main Camera with 5x optical zoom telephoto
• Titanium design with Action button
• USB-C with USB 3 speeds
• Up to 29 hours video playback
• 6.7-inch Super Retina XDR display with ProMotion
• Emergency SOS via satellite
• Crash Detection
• iOS 17 with personalized Contact Posters

This device is in excellent condition with 98% battery health. Comes with original box, charger, and 30-day warranty from our shop.`,
  price: 1250000,
  discountPrice: 1150000,
  currency: 'NGN',
  stockQuantity: 3,
  condition: 'uk-used' as const,
  categoryIds: ['cat-phones'],
  isActive: true,
  viewCount: 1842,
  createdAt: '2026-06-15T00:00:00Z',
  updatedAt: '2026-07-01T00:00:00Z',
  certificationStatus: 'certified' as const,
  batteryHealth: 98,
  testingWarrantyDays: 30,
};

const mockShop = {
  name: "King's Gadgets",
  slug: 'kings-gadgets',
  location: 'Shop 13, Albarka Plaza, Farm Center, Kano',
  isVerified: true,
  phone: '+2348012345678',
  whatsapp: '+2348012345678',
  allowWhatsappOrder: true,
  productCount: 47,
};

const mockRelated: (Product & { shopName: string; imageUrl?: string })[] = [
  { id: 'r1', shopId: 'shop-1', name: 'iPhone 14 Pro 128GB', slug: 'iphone-14-pro-128gb', description: '', price: 680000, discountPrice: 0, currency: 'NGN', stockQuantity: 5, condition: 'uk-used', categoryIds: [], isActive: true, viewCount: 900, createdAt: '', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'r2', shopId: 'shop-1', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: '', price: 950000, discountPrice: 880000, currency: 'NGN', stockQuantity: 2, condition: 'new', categoryIds: [], isActive: true, viewCount: 1200, createdAt: '', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'r3', shopId: 'shop-1', name: 'Apple AirPods Pro 2nd Gen', slug: 'airpods-pro-2', description: '', price: 185000, discountPrice: 0, currency: 'NGN', stockQuantity: 8, condition: 'new', categoryIds: [], isActive: true, viewCount: 650, createdAt: '', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'r4', shopId: 'shop-1', name: 'iPhone 15 Pro Case MagSafe', slug: 'iphone-15-pro-case', description: '', price: 15000, discountPrice: 12000, currency: 'NGN', stockQuantity: 20, condition: 'new', categoryIds: [], isActive: true, viewCount: 300, createdAt: '', updatedAt: '', shopName: "King's Gadgets" },
];

const mockImages = [
  '/placeholder-phone-1.jpg',
  '/placeholder-phone-2.jpg',
  '/placeholder-phone-3.jpg',
  '/placeholder-phone-4.jpg',
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    shopId: 'shop-1',
    buyerId: 'user-23',
    buyerName: 'Usman Danjuma',
    rating: 5,
    comment: 'Excellent phone! Battery is great and camera works perfectly. Audited condition certificate is fully authentic.',
    isVerifiedPurchase: true,
    createdAt: '2026-06-28T14:22:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    shopId: 'shop-1',
    buyerId: 'user-45',
    buyerName: 'Fatima Yusuf',
    rating: 4,
    comment: 'Very neat UK-used device, practically brand new. Delivery to Hotoro was fast.',
    isVerifiedPurchase: true,
    createdAt: '2026-06-25T09:15:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    shopId: 'shop-1',
    buyerId: 'user-72',
    buyerName: 'Ibrahim Kano',
    rating: 5,
    comment: 'Super happy with the 30-day testing warranty offered. Real trust value compared to buy-and-go sellers.',
    isVerifiedPurchase: true,
    createdAt: '2026-06-20T18:40:00Z',
  },
];

const conditionConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Brand New', color: 'text-primary', bg: 'bg-primary/15 border-primary/30' },
  'uk-used': { label: 'UK-Used', color: 'text-secondary', bg: 'bg-blue-500/15 border-secondary/30' },
  refurbished: { label: 'Refurbished', color: 'text-tertiary', bg: 'bg-yellow-500/15 border-tertiary/30' },
};

export default function ProductDetailPage() {
  const product = mockProduct;
  const shop = mockShop;
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const inStock = product.stockQuantity > 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const cond = conditionConfig[product.condition] || conditionConfig['new'];

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      price: displayPrice,
      quantity,
      imageUrl: mockImages[0] || '',
      shopName: shop.name,
      slug: product.slug,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/product/${product.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hi! I'd like to order:\n\n📱 *${product.name}*\n💰 ${formatPrice(displayPrice)}\n📦 Qty: ${quantity}\n\nFrom Farm Center Market`;
    window.open(getWhatsAppLink(shop.whatsapp, msg), '_blank');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !newName) return;
    
    const review: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      shopId: product.shopId,
      buyerId: `user-${Math.random()}`,
      buyerName: newName,
      rating: newRating,
      comment: newComment,
      isVerifiedPurchase: true, // Mock purchase verification
      createdAt: new Date().toISOString(),
    };
    
    setReviews([review, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
  };

  const descriptionLines = product.description.split('\n');
  const shortDesc = descriptionLines.slice(0, 3).join('\n');
  const isLongDesc = descriptionLines.length > 3;

  return (
    <main className="min-h-screen bg-[#fafafa] pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-outline mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories/phones-tablets" className="hover:text-primary transition-colors">Phones</Link>
          <span>/</span>
          <span className="text-on-surface-variant truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white border border-outline-variant/50 rounded-3xl overflow-hidden aspect-square relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container/50 to-surface-container-lowest flex items-center justify-center">
                <Zap className="w-20 h-20 text-outline-variant" />
              </div>
              {mockImages[currentImage] && (
                <div className="absolute inset-0 flex items-center justify-center text-outline text-lg">
                  Product Image {currentImage + 1}
                </div>
              )}

              {/* Nav Arrows */}
              {mockImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : mockImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#fafafa]/60 backdrop-blur-sm border border-outline-variant/50 flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fafafa]/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p < mockImages.length - 1 ? p + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#fafafa]/60 backdrop-blur-sm border border-outline-variant/50 flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fafafa]/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {mockImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex items-center justify-center text-sm ${
                    i === currentImage
                      ? 'border-primary shadow-[0_4px_12px_rgba(4,22,39,0.02)]'
                      : 'border-outline-variant/50 hover:border-outline opacity-60 hover:opacity-100'
                  } bg-[#f3f4f6]`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Condition Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold font-label ${cond.bg} ${cond.color}`}>
              <Tag className="w-4 h-4" />
              {cond.label}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface leading-tight">
              {product.name}
            </h1>

            {/* Views */}
            <p className="text-outline text-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold-400" />
              {product.viewCount.toLocaleString()} views
            </p>

            {/* Price */}
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-5">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-on-surface">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-outline text-xl line-through">{formatPrice(product.price)}</span>
                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${inStock ? (lowStock ? 'bg-yellow-400 animate-pulse' : 'bg-primary') : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${inStock ? (lowStock ? 'text-tertiary' : 'text-primary') : 'text-red-400'}`}>
                  {!inStock ? 'Out of Stock' : lowStock ? `Only ${product.stockQuantity} left` : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.certificationStatus === 'certified' && (
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label text-sm font-bold text-amber-900">Certified Device</h4>
                    <p className="text-xs text-amber-700 mt-1">Technician audited. {product.batteryHealth}% Battery Health.</p>
                  </div>
                </div>
              )}
              {product.testingWarrantyDays && (
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-label text-sm font-bold text-blue-900">Warranty Included</h4>
                    <p className="text-xs text-blue-700 mt-1">{product.testingWarrantyDays}-Day Testing & Verification Warranty.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-heading font-semibold text-on-surface mb-2">Description</h3>
              <div className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                {descExpanded || !isLongDesc ? product.description : shortDesc + '...'}
              </div>
              {isLongDesc && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-2 text-primary text-sm font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
                >
                  {descExpanded ? 'Show less' : 'Read more'}
                  {descExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-on-surface-variant text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-0 bg-[#f3f4f6] rounded-xl border border-outline-variant/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-on-surface font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${
                    inStock
                      ? 'bg-[#0f172a] text-white hover:bg-black font-label font-bold active:scale-95 transition-all rounded-full'
                      : 'bg-[#f3f4f6] text-outline cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-outline-variant/50 bg-[#f3f4f6]/40 text-on-surface-variant hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* WhatsApp Order */}
              {shop.allowWhatsappOrder && inStock && (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
              )}

              {/* Share */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all text-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Link Copied!' : 'Copy Product Link'}
                </button>
                <button
                  onClick={() => {
                    const msg = `Check out ${product.name} on Farm Center Market!\n${window.location.href}`;
                    window.open(getWhatsAppLink('', msg), '_blank');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Shop Info Card */}
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#f3f4f6]/80 border border-outline-variant/50 flex items-center justify-center">
                  <span className="font-heading text-xl font-bold text-primary">
                    {shop.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-on-surface truncate">{shop.name}</h3>
                    {shop.isVerified && (
                      <svg className="w-4 h-4 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-outline text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{shop.location}</span>
                  </p>
                  <p className="text-outline text-xs flex items-center gap-1 mt-0.5">
                    <Package className="w-3 h-3" />
                    {shop.productCount} products
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/shop/${shop.slug}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all text-sm font-medium"
                >
                  <Store className="w-4 h-4" />
                  Visit Shop
                </Link>
                <button
                  onClick={() => window.open(getWhatsAppLink(shop.whatsapp, 'Hi! I have a question about a product.'), '_blank')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 border-t border-outline-variant/30 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-on-surface">
                Customer Reviews ({reviews.length})
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">Verified purchases from audited buyers.</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label font-bold text-sm hover:opacity-90 transition-all"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* New Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="bg-white border border-outline-variant/50 rounded-2xl p-6 mb-8 max-w-xl space-y-4">
              <h3 className="font-heading font-semibold text-lg text-primary">Your Review</h3>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aliyu Usman"
                  className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'text-[#eab308] fill-[#eab308]' : 'text-outline-variant'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2">Comment</label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this device and seller..."
                  className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                />
              </div>
              <button
                type="submit"
                className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-label font-bold text-sm hover:opacity-90 transition-all"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6 max-w-3xl">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-sm">
                      <User className="w-5 h-5 text-outline" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-on-surface">{rev.buyerName}</h4>
                      <p className="text-outline text-xs mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= rev.rating ? 'text-[#eab308] fill-[#eab308]' : 'text-outline-variant'}`}
                        />
                      ))}
                    </div>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] font-label font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm font-body leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-on-surface">
              More from {shop.name}
            </h2>
            <Link
              href={`/shop/${shop.slug}`}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
            >
              View All <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockRelated.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                <div className="bg-white border border-outline-variant/50 overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_4px_12px_rgba(4,22,39,0.02)] group-hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] group-hover:border-primary/30">
                  <div className="aspect-square bg-[#f3f4f6] flex items-center justify-center relative overflow-hidden">
                    <Zap className="w-10 h-10 text-outline-variant" />
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold font-label border ${
                      p.condition === 'new' ? 'bg-primary/20 text-primary border-primary/30'
                      : p.condition === 'uk-used' ? 'bg-secondary/20 text-secondary border-secondary/30'
                      : 'bg-tertiary/20 text-tertiary border-tertiary/30'
                    }`}>
                      {p.condition === 'new' ? 'New' : p.condition === 'uk-used' ? 'UK-Used' : 'Refurbished'}
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-on-surface text-sm line-clamp-2 group-hover:text-[#0f172a] transition-colors mb-3">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-on-surface">
                          {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                        </span>
                        {p.discountPrice > 0 && p.discountPrice < p.price && (
                          <span className="text-outline text-xs line-through hidden sm:inline">{formatPrice(p.price)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          useCartStore.getState().addItem({ productId: p.id, name: p.name, price: p.discountPrice > 0 ? p.discountPrice : p.price, imageUrl: '', shopId: p.shopId, shopName: shop.name, slug: p.slug, quantity: 1 });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
