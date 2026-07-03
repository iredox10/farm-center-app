'use client';

import Link from 'next/link';
import { ShoppingCart, Eye, Tag, Zap } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product & { shopName?: string; imageUrl?: string };
  compact?: boolean;
}

const conditionConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-primary-container text-on-primary-container border-primary-container/30' },
  'uk-used': { label: 'UK-Used', color: 'bg-secondary-container text-on-secondary-container border-secondary-container/30' },
  refurbished: { label: 'Refurbished', color: 'bg-surface-container-highest text-on-surface border-outline-variant' },
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const condition = conditionConfig[product.condition] || conditionConfig['new'];
  const inStock = product.stockQuantity > 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      imageUrl: product.imageUrl || '/placeholder.jpg',
      shopName: product.shopName || 'Farm Center Shop',
      slug: product.slug,
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        className={`bg-surface-container-lowest border border-outline-variant overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(4,22,39,0.08)] group-hover:border-secondary/30 ${
          compact ? 'rounded-xl' : 'rounded-2xl'
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden bg-surface-container-high border-b border-outline-variant/30 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-12 h-12 text-outline-variant" />
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Condition Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-label font-bold uppercase tracking-wider border ${condition.color}`}>
            {condition.label}
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-error text-on-error px-2.5 py-1 rounded text-[10px] font-label font-bold uppercase tracking-wider">
              -{discountPercent}%
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-label font-semibold">Quick View</span>
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-surface-container-highest/80 flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-error text-on-error px-4 py-2 rounded-full text-sm font-label font-bold shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={compact ? 'p-4 flex flex-col h-full' : 'p-5 flex flex-col h-full'}>
          {/* Shop Name */}
          {product.shopName && (
            <p className="text-outline font-label text-xs mb-1.5 truncate flex items-center gap-1 uppercase tracking-wider font-semibold">
              <Tag className="w-3 h-3" />
              {product.shopName}
            </p>
          )}

          {/* Product Name */}
          <h3
            className={`font-heading font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-3 mb-1 flex items-baseline gap-2 flex-wrap">
            <span className={`font-heading font-black text-primary ${compact ? 'text-base' : 'text-lg'}`}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-on-surface-variant font-label text-sm line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Stock Warning */}
          {lowStock && (
            <p className="text-error font-label text-xs mt-1 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
              Only {product.stockQuantity} left
            </p>
          )}

          {/* Add to Cart */}
          {!compact && (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-label font-bold transition-all duration-300 ${
                inStock
                  ? 'bg-secondary text-on-secondary hover:bg-secondary/90 hover:shadow-md active:scale-[0.98]'
                  : 'bg-surface-container text-outline cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
