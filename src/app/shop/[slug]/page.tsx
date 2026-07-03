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
  new: { label: 'New', cls: 'bg-primary/20 text-primary border-primary/30' },
  'uk-used': { label: 'UK-Used', cls: 'bg-secondary/20 text-secondary border-secondary/30' },
  refurbished: { label: 'Refurbished', cls: 'bg-tertiary/20 text-tertiary border-tertiary/30' },
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
    <main className="min-h-screen bg-[#fafafa]">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container-lowest to-secondary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Shop Header */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white border border-outline-variant/50 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#f3f4f6] border-2 border-primary/30 flex items-center justify-center shadow-[0_4px_12px_rgba(4,22,39,0.02)] shadow-[0_8px_24px_rgba(4,22,39,0.06)] flex-shrink-0">
              <span className="font-heading text-4xl font-bold text-primary">
                {shop.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
                      {shop.name}
                    </h1>
                    {shop.isVerified && (
                      <span className="flex items-center gap-1 bg-primary/15 text-primary px-2.5 py-1 rounded-full text-xs font-semibold font-label border border-primary/30">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-outline mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" /> {shop.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-sm">
                    <span className="flex items-center gap-1"><Package className="w-4 h-4" />{shop.productCount} products</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Since {memberSince}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <button
                    onClick={() => window.open(getWhatsAppLink(shop.whatsapp, `Hi ${shop.name}! I found your shop on Farm Center Market.`), '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    onClick={handleCopyShopLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-on-surface-variant text-sm mt-4 line-clamp-2">{shop.description}</p>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        {shop.announcementText && (
          <div className="mt-4 bg-gradient-to-r from-gold-500/15 to-primary/15 border border-gold-500/20 rounded-2xl px-5 py-3 flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <p className="text-gold-400 text-sm font-medium">{shop.announcementText}</p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-8 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all text-sm"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface-variant hover:border-primary/30 transition-all text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} />
                </button>
                {showSort && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#f3f4f6] border border-outline-variant/50 rounded-xl shadow-xl z-20 overflow-hidden">
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
                          sortBy === opt.value ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-[#f3f4f6]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex bg-[#f3f4f6] rounded-xl border border-outline-variant/50 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition-colors ${viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-outline hover:text-on-surface-variant'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition-colors ${viewMode === 'list' ? 'text-primary bg-primary/10' : 'text-outline hover:text-on-surface-variant'}`}
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
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'bg-[#f3f4f6]/40 text-on-surface-variant border-outline-variant/50 hover:border-outline-variant hover:text-on-surface'
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
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-outline mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-on-surface mb-2">No products found</h3>
              <p className="text-outline">Try adjusting your search or filter.</p>
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
                    <div className="bg-white border border-outline-variant/50 overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_4px_12px_rgba(4,22,39,0.02)] group-hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] group-hover:border-primary/30">
                      <div className="aspect-square bg-[#f3f4f6] flex items-center justify-center relative overflow-hidden">
                        <Zap className="w-10 h-10 text-outline-variant" />
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold font-label border ${badge.cls}`}>{badge.label}</div>
                        {hasDiscount && (
                          <div className="absolute top-2 right-2 bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{discPct}%</div>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="font-heading font-semibold text-on-surface text-sm line-clamp-2 group-hover:text-[#0f172a] transition-colors mb-3">{product.name}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-on-surface">{formatPrice(price)}</span>
                            {hasDiscount && <span className="text-outline text-xs line-through hidden sm:inline">{formatPrice(product.price)}</span>}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
                    <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-4 flex gap-4 transition-all duration-300 group-hover:border-primary/30">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Zap className="w-8 h-8 text-outline-variant" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold font-label border mb-1 ${badge.cls}`}>{badge.label}</div>
                          <h3 className="font-heading font-semibold text-on-surface group-hover:text-[#0f172a] transition-colors line-clamp-1">{product.name}</h3>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <span className="font-bold text-on-surface text-lg">{formatPrice(price)}</span>
                            {hasDiscount && <span className="text-outline text-sm line-through">{formatPrice(product.price)}</span>}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black flex-shrink-0 ml-2"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
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
