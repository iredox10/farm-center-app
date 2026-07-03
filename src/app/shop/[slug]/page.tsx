'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, CheckCircle, Phone, MessageCircle, Share2, Copy, Check,
  Search, SlidersHorizontal, Grid3X3, List, Package, Calendar,
  Megaphone, Zap, Tag, ShoppingCart, ExternalLink, ChevronDown
} from 'lucide-react';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';

/* ── Mock Data ── */
const mockShop = {
  id: 'shop-1',
  name: "King's Gadgets",
  slug: 'kings-gadgets',
  description: 'Your trusted source for premium smartphones, laptops, and accessories in Farm Center, Kano. We stock both brand new and quality UK-used devices at unbeatable prices. With over 5 years in the business, we guarantee authenticity and after-sales support.',
  location: 'Shop 13, Albarka Plaza, Farm Center',
  phone: '+2348012345678',
  whatsapp: '+2348012345678',
  isVerified: true,
  productCount: 47,
  primaryColor: '#00f5a0',
  announcementText: '🔥 Flash Sale: 15% OFF all phone accessories this week!',
  createdAt: '2024-03-15T00:00:00Z',
  allowWhatsappOrder: true,
};

const categories = ['All', 'Phones', 'Laptops', 'Accessories', 'Audio', 'Power Banks'];

const mockProducts: (Product & { shopName: string })[] = [
  { id: 'p1', shopId: 'shop-1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256gb', description: '', price: 1250000, discountPrice: 1150000, currency: 'NGN', stockQuantity: 3, condition: 'uk-used', categoryIds: ['phones'], isActive: true, viewCount: 1842, createdAt: '2026-06-15', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p2', shopId: 'shop-1', name: 'Samsung Galaxy S24 Ultra 512GB', slug: 'samsung-s24-ultra', description: '', price: 980000, discountPrice: 0, currency: 'NGN', stockQuantity: 5, condition: 'new', categoryIds: ['phones'], isActive: true, viewCount: 1205, createdAt: '2026-06-20', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p3', shopId: 'shop-1', name: 'HP EliteBook 840 G8 Core i7', slug: 'hp-elitebook-840-g8', description: '', price: 420000, discountPrice: 380000, currency: 'NGN', stockQuantity: 2, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 890, createdAt: '2026-06-10', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p4', shopId: 'shop-1', name: 'Oraimo FreePods 4 ANC', slug: 'oraimo-freepods-4', description: '', price: 28000, discountPrice: 22000, currency: 'NGN', stockQuantity: 15, condition: 'new', categoryIds: ['audio'], isActive: true, viewCount: 650, createdAt: '2026-06-25', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p5', shopId: 'shop-1', name: 'MacBook Air M2 256GB', slug: 'macbook-air-m2', description: '', price: 850000, discountPrice: 0, currency: 'NGN', stockQuantity: 1, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 1100, createdAt: '2026-06-18', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p6', shopId: 'shop-1', name: 'Anker PowerCore 20000mAh', slug: 'anker-powercore-20000', description: '', price: 32000, discountPrice: 28000, currency: 'NGN', stockQuantity: 10, condition: 'new', categoryIds: ['power'], isActive: true, viewCount: 430, createdAt: '2026-06-22', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p7', shopId: 'shop-1', name: 'Dell Latitude 5520 Core i5', slug: 'dell-latitude-5520', description: '', price: 350000, discountPrice: 0, currency: 'NGN', stockQuantity: 4, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 560, createdAt: '2026-06-12', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p8', shopId: 'shop-1', name: 'iPhone 15 Clear Case MagSafe', slug: 'iphone-15-case-magsafe', description: '', price: 15000, discountPrice: 12000, currency: 'NGN', stockQuantity: 25, condition: 'new', categoryIds: ['accessories'], isActive: true, viewCount: 320, createdAt: '2026-06-28', updatedAt: '', shopName: "King's Gadgets" },
];

const conditionBadge: Record<string, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'uk-used': { label: 'UK-Used', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  refurbished: { label: 'Refurbished', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function ShopStorefrontPage() {
  const shop = mockShop;
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = mockProducts
    .filter((p) => activeCategory === 'All' || p.categoryIds.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase())))
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high': return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'popular': return b.viewCount - a.viewCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleCopyShopLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shop/${shop.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberSince = new Date(shop.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-navy-950">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-navy-800 to-gold-500/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
      </div>

      {/* Shop Header */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-navy-800 border-2 border-green-400/30 flex items-center justify-center shadow-lg shadow-green-400/10 flex-shrink-0">
              <span className="font-heading text-4xl font-bold text-green-400">
                {shop.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                      {shop.name}
                    </h1>
                    {shop.isVerified && (
                      <span className="flex items-center gap-1 bg-green-500/15 text-green-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-text-muted mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" /> {shop.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-text-secondary text-sm">
                    <span className="flex items-center gap-1"><Package className="w-4 h-4" />{shop.productCount} products</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Since {memberSince}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-green-400 hover:border-green-400/30 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <button
                    onClick={() => window.open(getWhatsAppLink(shop.whatsapp, `Hi ${shop.name}! I found your shop on Farm Center Market.`), '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    onClick={handleCopyShopLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-green-400 hover:border-green-400/30 transition-all text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm mt-4 line-clamp-2">{shop.description}</p>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        {shop.announcementText && (
          <div className="mt-4 bg-gradient-to-r from-gold-500/15 to-green-500/15 border border-gold-500/20 rounded-2xl px-5 py-3 flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <p className="text-gold-400 text-sm font-medium">{shop.announcementText}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-8 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-800/60 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/25 transition-all text-sm"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navy-800/60 border border-white/10 text-text-secondary hover:border-green-400/30 transition-all text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} />
                </button>
                {showSort && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-navy-800 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                    {[
                      { value: 'newest' as SortOption, label: 'Newest First' },
                      { value: 'price-low' as SortOption, label: 'Price: Low → High' },
                      { value: 'price-high' as SortOption, label: 'Price: High → Low' },
                      { value: 'popular' as SortOption, label: 'Most Popular' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortBy === opt.value ? 'text-green-400 bg-green-400/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex bg-navy-800/60 rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition-colors ${viewMode === 'grid' ? 'text-green-400 bg-green-400/10' : 'text-text-muted hover:text-text-secondary'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition-colors ${viewMode === 'list' ? 'text-green-400 bg-green-400/10' : 'text-text-muted hover:text-text-secondary'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? 'bg-green-400/15 text-green-400 border-green-400/30'
                    : 'bg-navy-800/40 text-text-secondary border-white/10 hover:border-white/20 hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-6 pb-16">
          {filteredProducts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">No products found</h3>
              <p className="text-text-muted">Try adjusting your search or filter.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
                const price = hasDiscount ? product.discountPrice : product.price;
                const discPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                const badge = conditionBadge[product.condition] || conditionBadge['new'];

                return (
                  <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                    <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30">
                      <div className="aspect-square bg-navy-800/50 flex items-center justify-center relative overflow-hidden">
                        <Zap className="w-10 h-10 text-navy-700/40" />
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.cls}`}>{badge.label}</div>
                        {hasDiscount && (
                          <div className="absolute top-2 right-2 bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{discPct}%</div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-heading font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-green-400 transition-colors">{product.name}</h3>
                        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                          <span className="font-bold text-green-400">{formatPrice(price)}</span>
                          {hasDiscount && <span className="text-text-muted text-xs line-through">{formatPrice(product.price)}</span>}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-navy-950 transition-all active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
                const price = hasDiscount ? product.discountPrice : product.price;
                const badge = conditionBadge[product.condition] || conditionBadge['new'];

                return (
                  <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                    <div className="glass-card rounded-2xl p-4 flex gap-4 transition-all duration-300 group-hover:border-green-400/30">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-navy-800/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Zap className="w-8 h-8 text-navy-700/40" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border mb-1 ${badge.cls}`}>{badge.label}</div>
                          <h3 className="font-heading font-semibold text-text-primary group-hover:text-green-400 transition-colors line-clamp-1">{product.name}</h3>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-bold text-green-400 text-lg">{formatPrice(price)}</span>
                            {hasDiscount && <span className="text-text-muted text-sm line-through">{formatPrice(product.price)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs ${product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                        }}
                        className="self-center flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-navy-950 transition-all active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
