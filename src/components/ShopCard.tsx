import Link from 'next/link';
import { MapPin, CheckCircle, Package, Zap, Store } from 'lucide-react';

interface ShopCardData {
  id: string;
  name: string;
  slug: string;
  location: string;
  productCount: number;
  isVerified: boolean;
  bannerUrl?: string;
  logoUrl?: string;
  description?: string;
  physicalAuditDate?: string;
}

interface ShopCardProps {
  shop: ShopCardData;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shop/${shop.slug}`} className="group block">
      <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(4,22,39,0.08)] group-hover:border-secondary/30">
        {/* Banner */}
        <div className="relative h-28 overflow-hidden bg-primary-container">
          {shop.bannerUrl ? (
            <img
              src={shop.bannerUrl}
              alt={`${shop.name} banner`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container to-secondary/20 flex items-center justify-center">
              <Store className="w-10 h-10 text-on-primary-container/30" />
            </div>
          )}

          {/* Verified Badge */}
          {shop.isVerified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container px-2.5 py-1 rounded text-[10px] font-label font-bold uppercase tracking-wider shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>

        {/* Logo + Info */}
        <div className="relative px-5 pb-5">
          {/* Logo */}
          <div className="-mt-8 mb-3 relative z-10">
            <div className="w-16 h-16 rounded-xl border-4 border-surface-container-lowest bg-surface-container overflow-hidden shadow-sm flex items-center justify-center">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold font-heading text-primary">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Shop Name */}
          <h3 className="font-heading font-bold text-on-surface text-lg group-hover:text-primary transition-colors truncate">
            {shop.name}
          </h3>

          {/* Description */}
          {shop.description && (
             <p className="mt-1 text-sm text-on-surface-variant line-clamp-1">
               {shop.description}
             </p>
          )}

          {/* Location & Product Count */}
          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-outline-variant/30">
            <p className="text-on-surface-variant text-sm font-label flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 flex-shrink-0 text-outline" />
              {shop.location}
            </p>
            
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-label justify-between">
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-outline" />
                <span>{shop.productCount} products</span>
              </div>
              {shop.physicalAuditDate && (
                <span className="text-[10px] font-label font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Audited
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
