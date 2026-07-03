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
  new: { label: 'New', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'uk-used': { label: 'UK-Used', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  refurbished: { label: 'Refurbished', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
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
        className={`glass-card overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30 ${
          compact ? 'rounded-xl' : 'rounded-2xl'
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden bg-navy-800/50 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-navy-700/40 to-navy-900/60 flex items-center justify-center">
            <Zap className="w-12 h-12 text-navy-700/60" />
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Condition Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${condition.color}`}>
            {condition.label}
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Quick View</span>
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-navy-950/70 flex items-center justify-center">
              <span className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={compact ? 'p-3' : 'p-4'}>
          {/* Shop Name */}
          {product.shopName && (
            <p className="text-text-muted text-xs mb-1 truncate flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {product.shopName}
            </p>
          )}

          {/* Product Name */}
          <h3
            className={`font-heading font-semibold text-text-primary line-clamp-2 group-hover:text-green-400 transition-colors ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className={`font-bold text-green-400 ${compact ? 'text-base' : 'text-lg'}`}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-text-muted text-sm line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Stock Warning */}
          {lowStock && (
            <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              Only {product.stockQuantity} left
            </p>
          )}

          {/* Add to Cart */}
          {!compact && (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                inStock
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-navy-950 hover:shadow-lg hover:shadow-green-500/25 active:scale-95'
                  : 'bg-navy-800/50 text-text-muted cursor-not-allowed'
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
