'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Heart, Share2, Copy, Check, ChevronLeft, ChevronRight,
  MapPin, CheckCircle, Minus, Plus, MessageCircle, Store, Tag, Star,
  ChevronDown, ChevronUp, Zap, ExternalLink, Package
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import type { Product } from '@/types';

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
};

const mockShop = {
  name: "King's Gadgets",
  slug: 'kings-gadgets',
  location: 'Shop 13, Albarka Plaza, Farm Center',
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

const conditionConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Brand New', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  'uk-used': { label: 'UK-Used', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  refurbished: { label: 'Refurbished', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
};

export default function ProductDetailPage() {
  const product = mockProduct;
  const shop = mockShop;
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
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

  const descriptionLines = product.description.split('\n');
  const shortDesc = descriptionLines.slice(0, 3).join('\n');
  const isLongDesc = descriptionLines.length > 3;

  return (
    <main className="min-h-screen bg-navy-950 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories/phones-tablets" className="hover:text-green-400 transition-colors">Phones</Link>
          <span>/</span>
          <span className="text-text-secondary truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="glass-card rounded-3xl overflow-hidden aspect-square relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-700/30 to-navy-900/50 flex items-center justify-center">
                <Zap className="w-20 h-20 text-navy-700/40" />
              </div>
              {mockImages[currentImage] && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-lg">
                  Product Image {currentImage + 1}
                </div>
              )}

              {/* Nav Arrows */}
              {mockImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : mockImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-950/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p < mockImages.length - 1 ? p + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-950/80"
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
                      ? 'border-green-400 shadow-lg shadow-green-400/20'
                      : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                  } bg-navy-800/50`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Condition Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${cond.bg} ${cond.color}`}>
              <Tag className="w-4 h-4" />
              {cond.label}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {product.name}
            </h1>

            {/* Views */}
            <p className="text-text-muted text-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold-400" />
              {product.viewCount.toLocaleString()} views
            </p>

            {/* Price */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-green-400">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-text-muted text-xl line-through">{formatPrice(product.price)}</span>
                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${inStock ? (lowStock ? 'bg-yellow-400 animate-pulse' : 'bg-green-400') : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${inStock ? (lowStock ? 'text-yellow-400' : 'text-green-400') : 'text-red-400'}`}>
                  {!inStock ? 'Out of Stock' : lowStock ? `Only ${product.stockQuantity} left` : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-2">Description</h3>
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {descExpanded || !isLongDesc ? product.description : shortDesc + '...'}
              </div>
              {isLongDesc && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-2 text-green-400 text-sm font-medium flex items-center gap-1 hover:text-green-300 transition-colors"
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
                <span className="text-text-secondary text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-0 bg-navy-800/60 rounded-xl border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-green-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-text-primary font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-green-400 transition-colors"
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
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-navy-950 hover:shadow-lg hover:shadow-green-500/25 active:scale-95'
                      : 'bg-navy-800/50 text-text-muted cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-navy-800/40 text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* WhatsApp Order */}
              {shop.allowWhatsappOrder && inStock && (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-green-500/30 text-green-400 font-semibold hover:bg-green-500/10 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
              )}

              {/* Share */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-green-400 hover:border-green-400/30 transition-all text-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Link Copied!' : 'Copy Product Link'}
                </button>
                <button
                  onClick={() => {
                    const msg = `Check out ${product.name} on Farm Center Market!\n${window.location.href}`;
                    window.open(getWhatsAppLink('', msg), '_blank');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-green-400 hover:border-green-400/30 transition-all text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Shop Info Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-navy-800/80 border border-white/10 flex items-center justify-center">
                  <span className="font-heading text-xl font-bold text-green-400">
                    {shop.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-text-primary truncate">{shop.name}</h3>
                    {shop.isVerified && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                  </div>
                  <p className="text-text-muted text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{shop.location}</span>
                  </p>
                  <p className="text-text-muted text-xs flex items-center gap-1 mt-0.5">
                    <Package className="w-3 h-3" />
                    {shop.productCount} products
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/shop/${shop.slug}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-800/60 border border-white/10 text-text-secondary hover:text-green-400 hover:border-green-400/30 transition-all text-sm font-medium"
                >
                  <Store className="w-4 h-4" />
                  Visit Shop
                </Link>
                <button
                  onClick={() => window.open(getWhatsAppLink(shop.whatsapp, 'Hi! I have a question about a product.'), '_blank')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              More from {shop.name}
            </h2>
            <Link
              href={`/shop/${shop.slug}`}
              className="text-green-400 text-sm font-medium flex items-center gap-1 hover:text-green-300 transition-colors"
            >
              View All <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockRelated.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30">
                  <div className="aspect-square bg-navy-800/50 flex items-center justify-center relative overflow-hidden">
                    <Zap className="w-10 h-10 text-navy-700/40" />
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      p.condition === 'new' ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : p.condition === 'uk-used' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {p.condition === 'new' ? 'New' : p.condition === 'uk-used' ? 'UK-Used' : 'Refurbished'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-green-400 transition-colors">
                      {p.name}
                    </h3>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-bold text-green-400">
                        {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                      </span>
                      {p.discountPrice > 0 && p.discountPrice < p.price && (
                        <span className="text-text-muted text-xs line-through">{formatPrice(p.price)}</span>
                      )}
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
