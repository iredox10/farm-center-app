'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight, Grid3X3, List, Zap, Tag, ShoppingCart,
  Smartphone, Laptop, Headphones, Battery, Shield, HardDrive,
  Wifi, Gamepad2, Watch, Wrench, Package
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';

const categoryMeta: Record<string, { name: string; icon: typeof Smartphone; subs: string[] }> = {
  'phones-tablets': { name: 'Phones & Tablets', icon: Smartphone, subs: ['Android Phones', 'iPhones', 'Tablets', 'Feature Phones'] },
  'laptops-computers': { name: 'Laptops & Computers', icon: Laptop, subs: ['HP', 'Dell', 'Lenovo', 'Apple MacBook', 'Desktops'] },
  'audio': { name: 'Audio', icon: Headphones, subs: ['Earbuds', 'Headphones', 'Speakers', 'Microphones'] },
  'power': { name: 'Power', icon: Battery, subs: ['Power Banks', 'Adapters', 'Solar Chargers'] },
  'accessories': { name: 'Phone Accessories', icon: Shield, subs: ['Cases', 'Screen Guards', 'Chargers', 'Cables'] },
  'storage': { name: 'Storage', icon: HardDrive, subs: ['Memory Cards', 'Flash Drives', 'SSDs', 'HDDs'] },
  'networking': { name: 'Networking', icon: Wifi, subs: ['Routers', 'MiFi', 'Ethernet Cables'] },
  'gaming': { name: 'Gaming', icon: Gamepad2, subs: ['Controllers', 'Consoles', 'Gaming Accessories'] },
  'wearables': { name: 'Wearables', icon: Watch, subs: ['Smart Watches', 'Fitness Trackers'] },
  'repair-parts': { name: 'Repair Parts & Tools', icon: Wrench, subs: ['Screens', 'Batteries', 'Screwdriver Kits'] },
};

const mockProducts: (Product & { shopName: string })[] = [
  { id: 'p1', shopId: 's1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max', description: '', price: 1250000, discountPrice: 1150000, currency: 'NGN', stockQuantity: 3, condition: 'uk-used', categoryIds: ['phones-tablets'], isActive: true, viewCount: 1842, createdAt: '2026-06-15', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p2', shopId: 's2', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', description: '', price: 980000, discountPrice: 0, currency: 'NGN', stockQuantity: 5, condition: 'new', categoryIds: ['phones-tablets'], isActive: true, viewCount: 1205, createdAt: '2026-06-20', updatedAt: '', shopName: "Tech Palace" },
  { id: 'p3', shopId: 's1', name: 'TECNO Spark 20 Pro+', slug: 'tecno-spark-20', description: '', price: 145000, discountPrice: 130000, currency: 'NGN', stockQuantity: 12, condition: 'new', categoryIds: ['phones-tablets'], isActive: true, viewCount: 780, createdAt: '2026-06-28', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p4', shopId: 's3', name: 'iPad Air M2 256GB', slug: 'ipad-air-m2', description: '', price: 620000, discountPrice: 0, currency: 'NGN', stockQuantity: 2, condition: 'uk-used', categoryIds: ['phones-tablets'], isActive: true, viewCount: 560, createdAt: '2026-06-12', updatedAt: '', shopName: "Gadget Zone" },
  { id: 'p5', shopId: 's2', name: 'Infinix Hot 40 Pro', slug: 'infinix-hot-40-pro', description: '', price: 125000, discountPrice: 110000, currency: 'NGN', stockQuantity: 8, condition: 'new', categoryIds: ['phones-tablets'], isActive: true, viewCount: 650, createdAt: '2026-06-25', updatedAt: '', shopName: "Tech Palace" },
  { id: 'p6', shopId: 's3', name: 'Google Pixel 8 Pro', slug: 'pixel-8-pro', description: '', price: 480000, discountPrice: 0, currency: 'NGN', stockQuantity: 1, condition: 'uk-used', categoryIds: ['phones-tablets'], isActive: true, viewCount: 430, createdAt: '2026-06-22', updatedAt: '', shopName: "Gadget Zone" },
];

const conditionBadge: Record<string, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'uk-used': { label: 'UK-Used', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  refurbished: { label: 'Refurbished', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categoryMeta[slug] || { name: slug, icon: Package, subs: [] };
  const Icon = category.icon;
  const [activeSub, setActiveSub] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const addItem = useCartStore((s) => s.addItem);

  const products = useMemo(() => {
    return mockProducts.sort((a, b) => {
      const pa = a.discountPrice > 0 ? a.discountPrice : a.price;
      const pb = b.discountPrice > 0 ? b.discountPrice : b.price;
      switch (sortBy) {
        case 'price-low': return pa - pb;
        case 'price-high': return pb - pa;
        case 'popular': return b.viewCount - a.viewCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [sortBy]);

  return (
    <main className="min-h-screen bg-navy-950 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/categories" className="hover:text-green-400 transition-colors">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-secondary">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">{category.name}</h1>
            <p className="text-text-muted mt-1">{products.length} products available</p>
          </div>
        </div>

        {/* Subcategory Chips */}
        {category.subs.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
            <button
              onClick={() => setActiveSub('All')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeSub === 'All' ? 'bg-green-400/15 text-green-400 border-green-400/30' : 'bg-navy-800/40 text-text-secondary border-white/10 hover:border-white/20'
              }`}
            >
              All
            </button>
            {category.subs.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeSub === sub ? 'bg-green-400/15 text-green-400 border-green-400/30' : 'bg-navy-800/40 text-text-secondary border-white/10 hover:border-white/20'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-muted text-sm">{products.length} products</p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-800/60 border border-white/10 text-text-secondary text-sm focus:outline-none focus:border-green-400/50 appearance-none cursor-pointer pr-8"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="flex bg-navy-800/60 rounded-xl border border-white/10 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'text-green-400 bg-green-400/10' : 'text-text-muted'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'text-green-400 bg-green-400/10' : 'text-text-muted'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'space-y-4'}>
          {products.map((product) => {
            const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
            const price = hasDiscount ? product.discountPrice : product.price;
            const discPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
            const badge = conditionBadge[product.condition] || conditionBadge['new'];

            if (viewMode === 'list') {
              return (
                <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                  <div className="glass-card rounded-2xl p-4 flex gap-4 transition-all group-hover:border-green-400/30">
                    <div className="w-24 h-24 rounded-xl bg-navy-800/50 flex items-center justify-center flex-shrink-0"><Zap className="w-8 h-8 text-navy-700/40" /></div>
                    <div className="flex-1 min-w-0">
                      <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border mb-1 ${badge.cls}`}>{badge.label}</div>
                      <h3 className="font-heading font-semibold text-text-primary group-hover:text-green-400 transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-text-muted text-xs mt-0.5">{product.shopName}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-bold text-green-400 text-lg">{formatPrice(price)}</span>
                        {hasDiscount && <span className="text-text-muted text-sm line-through">{formatPrice(product.price)}</span>}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug }); }}
                      className="self-center flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-navy-950 active:scale-95 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30">
                  <div className="aspect-square bg-navy-800/50 flex items-center justify-center relative">
                    <Zap className="w-10 h-10 text-navy-700/40" />
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.cls}`}>{badge.label}</div>
                    {hasDiscount && <div className="absolute top-2 right-2 bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{discPct}%</div>}
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-text-muted text-xs truncate flex items-center gap-1"><Tag className="w-3 h-3" />{product.shopName}</p>
                    <h3 className="font-heading font-semibold text-text-primary text-sm line-clamp-2 mt-0.5 group-hover:text-green-400 transition-colors">{product.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-green-400">{formatPrice(price)}</span>
                      {hasDiscount && <span className="text-text-muted text-xs line-through">{formatPrice(product.price)}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug }); }}
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
      </div>
    </main>
  );
}
