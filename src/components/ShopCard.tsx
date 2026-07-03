import Link from 'next/link';
import { MapPin, CheckCircle, Package, Zap } from 'lucide-react';

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
}

interface ShopCardProps {
  shop: ShopCardData;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shop/${shop.slug}`} className="group block">
      <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30">
        {/* Banner */}
        <div className="relative h-32 overflow-hidden">
          {shop.bannerUrl ? (
            <img
              src={shop.bannerUrl}
              alt={`${shop.name} banner`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500/20 via-navy-800 to-gold-500/20 flex items-center justify-center">
              <Zap className="w-10 h-10 text-green-400/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />

          {/* Verified Badge */}
          {shop.isVerified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm text-green-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </div>
          )}
        </div>

        {/* Logo + Info */}
        <div className="relative px-4 pb-4">
          {/* Logo */}
          <div className="-mt-8 mb-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl border-2 border-surface bg-navy-800 overflow-hidden shadow-lg flex items-center justify-center">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold font-heading text-green-400">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Shop Name */}
          <h3 className="font-heading font-bold text-text-primary text-base group-hover:text-green-400 transition-colors truncate">
            {shop.name}
          </h3>

          {/* Location */}
          <p className="text-text-muted text-sm mt-1 flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {shop.location}
          </p>

          {/* Product Count */}
          <div className="mt-3 flex items-center gap-1.5 text-text-secondary text-sm">
            <Package className="w-3.5 h-3.5" />
            <span>{shop.productCount} products</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
