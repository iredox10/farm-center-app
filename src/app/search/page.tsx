'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search as SearchIcon, SlidersHorizontal, Grid3X3, List, X,
  ChevronDown, Package, Zap, ShoppingCart, Tag
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';

const allMockProducts: (Product & { shopName: string })[] = [
  { id: 'p1', shopId: 's1', name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256gb', description: 'Latest Apple flagship', price: 1250000, discountPrice: 1150000, currency: 'NGN', stockQuantity: 3, condition: 'uk-used', categoryIds: ['phones'], isActive: true, viewCount: 1842, createdAt: '2026-06-15', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p2', shopId: 's1', name: 'Samsung Galaxy S24 Ultra 512GB', slug: 'samsung-s24-ultra', description: 'Samsung flagship phone', price: 980000, discountPrice: 0, currency: 'NGN', stockQuantity: 5, condition: 'new', categoryIds: ['phones'], isActive: true, viewCount: 1205, createdAt: '2026-06-20', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p3', shopId: 's2', name: 'HP EliteBook 840 G8 Core i7', slug: 'hp-elitebook-840-g8', description: 'Business laptop', price: 420000, discountPrice: 380000, currency: 'NGN', stockQuantity: 2, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 890, createdAt: '2026-06-10', updatedAt: '', shopName: "Tech Palace" },
  { id: 'p4', shopId: 's2', name: 'Oraimo FreePods 4 ANC', slug: 'oraimo-freepods-4', description: 'Wireless earbuds', price: 28000, discountPrice: 22000, currency: 'NGN', stockQuantity: 15, condition: 'new', categoryIds: ['audio'], isActive: true, viewCount: 650, createdAt: '2026-06-25', updatedAt: '', shopName: "Tech Palace" },
  { id: 'p5', shopId: 's3', name: 'MacBook Air M2 256GB', slug: 'macbook-air-m2', description: 'Apple laptop', price: 850000, discountPrice: 0, currency: 'NGN', stockQuantity: 1, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 1100, createdAt: '2026-06-18', updatedAt: '', shopName: "Gadget Zone" },
  { id: 'p6', shopId: 's3', name: 'Anker PowerCore 20000mAh', slug: 'anker-powercore-20000', description: 'Power bank', price: 32000, discountPrice: 28000, currency: 'NGN', stockQuantity: 10, condition: 'new', categoryIds: ['power'], isActive: true, viewCount: 430, createdAt: '2026-06-22', updatedAt: '', shopName: "Gadget Zone" },
  { id: 'p7', shopId: 's1', name: 'Dell Latitude 5520 Core i5', slug: 'dell-latitude-5520', description: 'Business laptop Dell', price: 350000, discountPrice: 0, currency: 'NGN', stockQuantity: 4, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 560, createdAt: '2026-06-12', updatedAt: '', shopName: "King's Gadgets" },
  { id: 'p8', shopId: 's2', name: 'TECNO Spark 20 Pro+', slug: 'tecno-spark-20-pro', description: 'Budget phone', price: 145000, discountPrice: 130000, currency: 'NGN', stockQuantity: 12, condition: 'new', categoryIds: ['phones'], isActive: true, viewCount: 780, createdAt: '2026-06-28', updatedAt: '', shopName: "Tech Palace" },
  { id: 'p9', shopId: 's3', name: 'JBL Flip 6 Portable Speaker', slug: 'jbl-flip-6', description: 'Bluetooth speaker', price: 85000, discountPrice: 0, currency: 'NGN', stockQuantity: 7, condition: 'new', categoryIds: ['audio'], isActive: true, viewCount: 340, createdAt: '2026-06-30', updatedAt: '', shopName: "Gadget Zone" },
  { id: 'p10', shopId: 's1', name: 'Lenovo ThinkPad X1 Carbon Gen 10', slug: 'thinkpad-x1-carbon', description: 'Premium business laptop', price: 680000, discountPrice: 620000, currency: 'NGN', stockQuantity: 2, condition: 'uk-used', categoryIds: ['laptops'], isActive: true, viewCount: 910, createdAt: '2026-07-01', updatedAt: '', shopName: "King's Gadgets" },
];

const categoryOptions = ['Phones', 'Laptops', 'Audio', 'Power', 'Accessories', 'Networking', 'Gaming', 'Wearables'];
const conditionOptions = [
  { value: 'new', label: 'Brand New' },
  { value: 'uk-used', label: 'UK-Used' },
  { value: 'refurbished', label: 'Refurbished' },
];
const conditionBadge: Record<string, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-primary/20 text-primary border-primary/30' },
  'uk-used': { label: 'UK-Used', cls: 'bg-secondary/20 text-secondary border-secondary/30' },
  refurbished: { label: 'Refurbished', cls: 'bg-tertiary/20 text-tertiary border-tertiary/30' },
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = useMemo(() => {
    return allMockProducts
      .filter((p) => {
        if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.description.toLowerCase().includes(query.toLowerCase())) return false;
        if (selectedCategories.length > 0 && !p.categoryIds.some((c) => selectedCategories.map((sc) => sc.toLowerCase()).includes(c))) return false;
        if (selectedConditions.length > 0 && !selectedConditions.includes(p.condition)) return false;
        const price = p.discountPrice > 0 ? p.discountPrice : p.price;
        if (minPrice && price < Number(minPrice)) return false;
        if (maxPrice && price > Number(maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        const pa = a.discountPrice > 0 ? a.discountPrice : a.price;
        const pb = b.discountPrice > 0 ? b.discountPrice : b.price;
        switch (sortBy) {
          case 'price-low': return pa - pb;
          case 'price-high': return pb - pa;
          case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popular': return b.viewCount - a.viewCount;
          default: return query ? (b.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0) - (a.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0) : 0;
        }
      });
  }, [query, selectedCategories, selectedConditions, minPrice, maxPrice, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };
  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) => prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]);
  };
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setMinPrice('');
    setMaxPrice('');
  };
  const hasFilters = selectedCategories.length > 0 || selectedConditions.length > 0 || minPrice || maxPrice;

  return (
    <main className="min-h-screen bg-[#fafafa] pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phones, laptops, accessories..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface text-lg placeholder:text-outline focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
            />
          </div>
          <p className="text-outline text-sm mt-3">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar (Desktop) */}
          <aside className={`w-64 flex-shrink-0 space-y-6 ${showFilters ? 'fixed inset-0 z-50 bg-[#fafafa]/95 backdrop-blur-sm p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:backdrop-blur-none lg:p-0' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-heading text-lg font-bold text-on-surface">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-outline hover:text-on-surface"><X className="w-5 h-5" /></button>
            </div>

            {hasFilters && (
              <button onClick={clearAllFilters} className="text-red-400 text-sm hover:text-red-300 transition-colors">Clear all filters</button>
            )}

            {/* Categories */}
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-5">
              <h4 className="font-heading font-semibold text-on-surface mb-3">Categories</h4>
              <div className="space-y-2">
                {categoryOptions.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedCategories.includes(cat) ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-outline'
                    }`}>
                      {selectedCategories.includes(cat) && <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-on-surface-variant text-sm group-hover:text-on-surface transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-5">
              <h4 className="font-heading font-semibold text-on-surface mb-3">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#f3f4f6] border border-outline-variant/50 text-on-surface text-sm focus:outline-none focus:border-primary/50" />
                <span className="text-outline self-center">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#f3f4f6] border border-outline-variant/50 text-on-surface text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            {/* Condition */}
            <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-5">
              <h4 className="font-heading font-semibold text-on-surface mb-3">Condition</h4>
              <div className="space-y-2">
                {conditionOptions.map((cond) => (
                  <label key={cond.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedConditions.includes(cond.value) ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-outline'
                    }`}>
                      {selectedConditions.includes(cond.value) && <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-on-surface-variant text-sm group-hover:text-on-surface transition-colors">{cond.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface-variant text-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilters && <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">{selectedCategories.length + selectedConditions.length}</span>}
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl bg-[#f3f4f6] border border-outline-variant/50 text-on-surface-variant text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer pr-8">
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                </select>
                <div className="flex bg-[#f3f4f6] rounded-xl border border-outline-variant/50 overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-outline'}`}><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'text-primary bg-primary/10' : 'text-outline'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-12 text-center">
                <SearchIcon className="w-16 h-16 text-outline mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-on-surface mb-2">No results found</h3>
                <p className="text-outline mb-4">Try different keywords or adjust your filters.</p>
                {hasFilters && <button onClick={clearAllFilters} className="text-primary font-medium hover:text-primary/80 transition-colors">Clear all filters</button>}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => {
                  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
                  const price = hasDiscount ? product.discountPrice : product.price;
                  const badge = conditionBadge[product.condition] || conditionBadge['new'];

                  if (viewMode === 'list') {
                    return (
                      <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                        <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-4 flex gap-4 transition-all group-hover:border-primary/30">
                          <div className="w-24 h-24 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0"><Zap className="w-8 h-8 text-outline-variant" /></div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold font-label border mb-1 ${badge.cls}`}>{badge.label}</div>
                              <h3 className="font-heading font-semibold text-on-surface group-hover:text-[#0f172a] transition-colors line-clamp-1">{product.name}</h3>
                              <p className="text-outline text-xs mt-0.5">{product.shopName}</p>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-on-surface text-lg">{formatPrice(price)}</span>
                                {hasDiscount && <span className="text-outline text-sm line-through">{formatPrice(product.price)}</span>}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault(); e.stopPropagation();
                                  addItem({ productId: product.id, name: product.name, price, imageUrl: '', shopId: product.shopId, shopName: product.shopName, slug: product.slug, quantity: 1 });
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
                  }

                  return (
                    <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                      <div className="bg-white border border-outline-variant/50 overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_4px_12px_rgba(4,22,39,0.02)] group-hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] group-hover:border-primary/30">
                        <div className="aspect-square bg-[#f3f4f6] flex items-center justify-center relative">
                          <Zap className="w-10 h-10 text-outline-variant" />
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold font-label border ${badge.cls}`}>{badge.label}</div>
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-outline text-xs truncate flex items-center gap-1"><Tag className="w-3 h-3" />{product.shopName}</p>
                          <h3 className="font-heading font-semibold text-on-surface text-sm line-clamp-2 mt-0.5 group-hover:text-[#0f172a] transition-colors mb-3">{product.name}</h3>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-on-surface">{formatPrice(price)}</span>
                              {hasDiscount && <span className="text-outline text-xs line-through hidden sm:inline">{formatPrice(product.price)}</span>}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                addItem({ productId: product.id, name: product.name, price, imageUrl: '', shopId: product.shopId, shopName: product.shopName, slug: product.slug, quantity: 1 });
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
