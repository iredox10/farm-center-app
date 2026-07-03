'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, CheckCircle, Package, Zap, SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const mockShops = [
  { id: 's1', name: "King's Gadgets", slug: 'kings-gadgets', location: 'Shop 13, Albarka Plaza', productCount: 47, isVerified: true, description: 'Premium smartphones and laptops' },
  { id: 's2', name: 'Tech Palace', slug: 'tech-palace', location: 'Shop 5, Dan Sulaika Plaza', productCount: 82, isVerified: true, description: 'Largest accessory collection in Farm Center' },
  { id: 's3', name: 'Gadget Zone', slug: 'gadget-zone', location: 'Shop 21, Albarka Plaza', productCount: 35, isVerified: false, description: 'Quality UK-used laptops at best prices' },
  { id: 's4', name: 'Mobile Hub Nigeria', slug: 'mobile-hub', location: 'Shop 8, Farm Center Road', productCount: 63, isVerified: true, description: 'Official dealer for TECNO, Infinix & Itel' },
  { id: 's5', name: 'PowerTech Accessories', slug: 'powertech', location: 'Shop 3, Dan Sulaika Plaza', productCount: 120, isVerified: true, description: 'Chargers, cables, power banks & more' },
  { id: 's6', name: 'Kano Laptops Store', slug: 'kano-laptops', location: 'Shop 15, Farm Center Road', productCount: 28, isVerified: false, description: 'Refurbished business-class laptops' },
  { id: 's7', name: 'iDevice Kano', slug: 'idevice-kano', location: 'Shop 7, Albarka Plaza', productCount: 41, isVerified: true, description: 'Apple specialist — iPhones, iPads, MacBooks' },
  { id: 's8', name: 'Sound City Audio', slug: 'sound-city', location: 'Shop 11, Dan Sulaika Plaza', productCount: 56, isVerified: false, description: 'Speakers, earbuds, headphones & studio gear' },
];

type SortOption = 'name' | 'products' | 'newest';

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('products');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = mockShops
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((s) => !verifiedOnly || s.isVerified)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'products': return b.productCount - a.productCount;
        default: return 0;
      }
    });

  return (
    <main className="min-h-screen bg-navy-950 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">Browse Shops</h1>
          <p className="text-text-secondary mt-2">Discover trusted sellers in Farm Center Market, Kano</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search shops by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-800/60 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/25 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                verifiedOnly
                  ? 'bg-green-400/15 text-green-400 border-green-400/30'
                  : 'bg-navy-800/60 text-text-secondary border-white/10 hover:border-white/20'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Verified Only
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-xl bg-navy-800/60 border border-white/10 text-text-secondary text-sm focus:outline-none focus:border-green-400/50 appearance-none cursor-pointer pr-10"
            >
              <option value="products">Most Products</option>
              <option value="name">Name A-Z</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Shops Grid */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">No shops found</h3>
            <p className="text-text-muted">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.slug}`} className="group block">
                <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-green-400/10 group-hover:border-green-400/30 h-full">
                  {/* Banner */}
                  <div className="relative h-28 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-500/20 via-navy-800 to-gold-500/20 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-green-400/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                    {shop.isVerified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm text-green-400 px-2 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="relative px-4 pb-5">
                    <div className="-mt-7 mb-3">
                      <div className="w-14 h-14 rounded-xl border-2 border-surface bg-navy-800 flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold font-heading text-green-400">{shop.name.charAt(0)}</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-text-primary group-hover:text-green-400 transition-colors truncate">
                      {shop.name}
                    </h3>
                    <p className="text-text-muted text-sm mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{shop.location}
                    </p>
                    <p className="text-text-secondary text-xs mt-2 line-clamp-2">{shop.description}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-text-secondary text-sm">
                      <Package className="w-3.5 h-3.5" />
                      <span>{shop.productCount} products</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
