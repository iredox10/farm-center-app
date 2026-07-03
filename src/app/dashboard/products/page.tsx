'use client';

import { useState, useEffect } from 'react';
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
import type { ProductCondition, Product } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/appwrite/api';
import { toast } from 'react-hot-toast';

const CONDITION_STYLES: Record<ProductCondition, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-green-500/10', text: 'text-green-600', label: 'New' },
  'uk-used': { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'UK-Used' },
  refurbished: { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Refurbished' },
};

export default function ProductsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  useEffect(() => {
    async function loadProducts() {
      if (!user) return;
      setIsLoading(true);
      try {
        const shop = await api.getShopByOwnerId(user.$id);
        if (shop) {
          const shopProducts = await api.getShopProducts((shop as any).$id);
          setProducts(shopProducts);
        }
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [user]);

  const tier = SUBSCRIPTION_TIERS['free'];
  const productCount = products.length;
  const maxProducts = tier.maxProducts;
  const usagePercent = Math.min((productCount / maxProducts) * 100, 100);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function toggleActive(product: Product) {
    try {
      const updated = await api.updateProduct((product as any).$id, { isActive: !product.isActive });
      setProducts((prev) =>
        prev.map((p) => ((p as any).$id === (product as any).$id ? { ...p, isActive: updated.isActive } : p))
      );
      toast.success(updated.isActive ? 'Product activated' : 'Product deactivated');
    } catch (error) {
      toast.error('Failed to update product');
    }
  }

  async function deleteProduct(id: string) {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => (p as any).$id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setMenuOpenId(null);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-on-surface-variant">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">My Products</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Manage your product listings
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-label font-bold hover:opacity-90 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Plan Usage Card */}
      <div className="bg-white border border-outline-variant/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-on-surface">Product Usage</h3>
            <span className="text-sm font-label font-bold text-on-surface">
              {productCount} / {maxProducts}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                usagePercent > 90 ? 'bg-red-500' : 'bg-primary'
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-body text-on-surface-variant">
            You have used {usagePercent.toFixed(1)}% of your free plan limit. Upgrade for more.
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow text-sm font-body text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 bg-surface-container/50 p-1 rounded-xl">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              view === 'grid'
                ? 'bg-white text-primary shadow-[0_2px_8px_rgba(4,22,39,0.05)]'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              view === 'list'
                ? 'bg-white text-primary shadow-[0_2px_8px_rgba(4,22,39,0.05)]'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product List/Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const condStyle = CONDITION_STYLES[product.condition] || CONDITION_STYLES['new'];
            return (
              <div
                key={(product as any).$id}
                className="bg-white border border-outline-variant/50 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(4,22,39,0.02)] hover:shadow-lg transition-shadow group flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="relative aspect-[4/3] bg-surface-container flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <Package className="w-6 h-6 text-on-surface-variant/50" />
                  </div>
                  {/* Condition badge */}
                  <span
                    className={cn(
                      'absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-label font-bold',
                      condStyle.bg,
                      condStyle.text
                    )}
                  >
                    {condStyle.label}
                  </span>
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(product)}
                    className={cn(
                      'absolute top-3 right-3 w-10 h-5 rounded-full transition-colors',
                      product.isActive ? 'bg-primary' : 'bg-surface-container-highest'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white shadow-[0_4px_12px_rgba(4,22,39,0.02)] transition-transform',
                        product.isActive ? 'translate-x-5.5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                  {/* Stock warning */}
                  {product.stockQuantity === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs text-center py-1 font-label font-bold flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Out of Stock
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-heading text-sm font-semibold text-on-surface mb-1 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-primary">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice > 0 && (
                      <span className="text-xs font-body text-on-surface-variant line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs font-body text-on-surface-variant mt-auto">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {product.viewCount || 0} views
                    </span>
                    <span>{product.stockQuantity} in stock</span>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/50">
                    <Link
                      href={`/dashboard/products/${(product as any).$id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-container/50 hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-label font-medium transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === (product as any).$id ? null : (product as any).$id)}
                        className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpenId === (product as any).$id && (
                        <div className="absolute right-0 bottom-full mb-1 w-36 bg-white p-1.5 rounded-xl border border-outline-variant/50 shadow-lg z-20">
                          <button
                            onClick={() => deleteProduct((product as any).$id)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-label font-medium text-red-500 hover:bg-red-50 transition-colors"
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
            const condStyle = CONDITION_STYLES[product.condition] || CONDITION_STYLES['new'];
            return (
              <div
                key={(product as any).$id}
                className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-4 flex items-center gap-4 hover:scale-[1.005] transition-transform"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <Package className="w-7 h-7 text-on-surface-variant/30" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-heading text-sm font-semibold text-on-surface truncate">
                      {truncateText(product.name, 40)}
                    </h4>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-label font-bold shrink-0',
                        condStyle.bg,
                        condStyle.text
                      )}
                    >
                      {condStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-body text-on-surface-variant">
                    <span className="font-semibold text-primary text-sm">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    <span>·</span>
                    <span>{product.stockQuantity} in stock</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {product.viewCount || 0}
                    </span>
                  </div>
                </div>
                {/* Active toggle */}
                <button
                  onClick={() => toggleActive(product)}
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors shrink-0',
                    product.isActive ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full bg-white shadow-[0_4px_12px_rgba(4,22,39,0.02)] transition-transform',
                      product.isActive ? 'translate-x-5.5' : 'translate-x-0.5'
                    )}
                  />
                </button>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/dashboard/products/${(product as any).$id}/edit`}
                    className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteProduct((product as any).$id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
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
