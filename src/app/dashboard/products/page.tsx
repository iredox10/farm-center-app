'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
} from 'lucide-react';
import { cn, formatPrice, truncateText } from '@/lib/utils';
import { SUBSCRIPTION_TIERS } from '@/lib/config/subscriptions';
import type { ProductCondition } from '@/types';

/* ─── Mock Products ─── */

interface MockProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number;
  condition: ProductCondition;
  stockQuantity: number;
  isActive: boolean;
  viewCount: number;
  imageUrl: string;
  createdAt: string;
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    price: 950000,
    discountPrice: 0,
    condition: 'new',
    stockQuantity: 5,
    isActive: true,
    viewCount: 234,
    imageUrl: '',
    createdAt: '2026-06-15',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 780000,
    discountPrice: 720000,
    condition: 'new',
    stockQuantity: 3,
    isActive: true,
    viewCount: 187,
    imageUrl: '',
    createdAt: '2026-06-20',
  },
  {
    id: '3',
    name: 'MacBook Air M3 2024',
    slug: 'macbook-air-m3-2024',
    price: 1200000,
    discountPrice: 0,
    condition: 'uk-used',
    stockQuantity: 1,
    isActive: true,
    viewCount: 156,
    imageUrl: '',
    createdAt: '2026-06-22',
  },
  {
    id: '4',
    name: 'JBL Flip 6 Bluetooth Speaker',
    slug: 'jbl-flip-6-bluetooth-speaker',
    price: 85000,
    discountPrice: 75000,
    condition: 'refurbished',
    stockQuantity: 8,
    isActive: false,
    viewCount: 92,
    imageUrl: '',
    createdAt: '2026-06-25',
  },
  {
    id: '5',
    name: 'AirPods Pro 2nd Generation',
    slug: 'airpods-pro-2nd-generation',
    price: 185000,
    discountPrice: 0,
    condition: 'new',
    stockQuantity: 0,
    isActive: true,
    viewCount: 312,
    imageUrl: '',
    createdAt: '2026-06-28',
  },
];

const CONDITION_STYLES: Record<ProductCondition, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'New' },
  'uk-used': { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'UK-Used' },
  refurbished: { bg: 'bg-gold-400/10', text: 'text-gold-400', label: 'Refurbished' },
};

export default function ProductsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const tier = SUBSCRIPTION_TIERS['free'];
  const productCount = products.length;
  const maxProducts = tier.maxProducts;
  const usagePercent = Math.min((productCount / maxProducts) * 100, 100);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleActive(id: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setMenuOpenId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary">My Products</h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage your product listings
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Tier Banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">
              Free Plan: {productCount}/{maxProducts} products used
            </p>
            <div className="mt-1.5 h-2 rounded-full bg-navy-800 overflow-hidden">
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
        {usagePercent >= 60 && (
          <Link
            href="/dashboard/billing"
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors whitespace-nowrap"
          >
            Upgrade for more
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900/60 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900/60 border border-white/8">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              view === 'grid' ? 'bg-green-400/10 text-green-400' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              view === 'list' ? 'bg-green-400/10 text-green-400' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        /* Empty state */
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-green-400/10 flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-green-400/50" />
          </div>
          <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
            {searchQuery ? 'No products found' : 'Add your first product'}
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
            {searchQuery
              ? 'Try a different search term'
              : 'Start selling by listing your first product on Farm Center Market'}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          )}
        </div>
      ) : view === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const condStyle = CONDITION_STYLES[product.condition];
            return (
              <div
                key={product.id}
                className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-navy-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-12 h-12 text-text-muted/30" />
                  </div>
                  {/* Condition badge */}
                  <span
                    className={cn(
                      'absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium',
                      condStyle.bg,
                      condStyle.text
                    )}
                  >
                    {condStyle.label}
                  </span>
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(product.id)}
                    className={cn(
                      'absolute top-3 right-3 w-10 h-5 rounded-full transition-colors',
                      product.isActive ? 'bg-green-400' : 'bg-white/20'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                        product.isActive ? 'translate-x-5.5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                  {/* Stock warning */}
                  {product.stockQuantity === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs text-center py-1 font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Out of Stock
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-1 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-green-400">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice > 0 && (
                      <span className="text-xs text-text-muted line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {product.viewCount} views
                    </span>
                    <span>{product.stockQuantity} in stock</span>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/6">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === product.id ? null : product.id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpenId === product.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-36 glass-card p-1.5 rounded-xl border border-white/10 shadow-2xl z-20">
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const condStyle = CONDITION_STYLES[product.condition];
            return (
              <div
                key={product.id}
                className="glass-card p-4 flex items-center gap-4 hover:scale-[1.005] transition-transform"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-navy-800 flex items-center justify-center shrink-0">
                  <Package className="w-7 h-7 text-text-muted/30" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {truncateText(product.name, 40)}
                    </h4>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
                        condStyle.bg,
                        condStyle.text
                      )}
                    >
                      {condStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="font-semibold text-green-400 text-sm">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    <span>·</span>
                    <span>{product.stockQuantity} in stock</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {product.viewCount}
                    </span>
                  </div>
                </div>
                {/* Active toggle */}
                <button
                  onClick={() => toggleActive(product.id)}
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors shrink-0',
                    product.isActive ? 'bg-green-400' : 'bg-white/20'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                      product.isActive ? 'translate-x-5.5' : 'translate-x-0.5'
                    )}
                  />
                </button>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 rounded-lg hover:bg-red-400/10 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
