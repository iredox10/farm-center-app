'use client';

import Link from 'next/link';
import {
  Search,
  Smartphone,
  Laptop,
  Headphones,
  Battery,
  Cable,
  Monitor,
  ShoppingCart,
  Star,
  ArrowRight,
  Sparkles,
  CreditCard,
  Package,
  Store,
  Zap,
  Upload,
  Users,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Watch,
  Camera,
  SlidersHorizontal,
  Heart,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useRef } from 'react';

/* ── Mock Data ─────────────────────────────────────────────────────── */

const mockProducts = [
  {
    id: '1',
    name: 'Aero Phone 14 Ultra - 256GB...',
    price: 899000,
    image: null,
    condition: 'new' as const,
    shop: 'TechHaven',
    shopId: 'shop-1',
    rating: 4.8,
    reviews: 120,
    badge: 'wishlist',
  },
  {
    id: '2',
    name: 'ProType Mechanical Keyboard',
    price: 120000,
    image: null,
    condition: 'new' as const,
    shop: 'GamerGear',
    shopId: 'shop-2',
    rating: 4.9,
    reviews: 340,
    badge: 'bestseller',
  },
  {
    id: '3',
    name: 'Lumina Mirrorless Camera Body Only',
    price: 1050000,
    image: null,
    condition: 'new' as const,
    shop: 'PhotoPro',
    shopId: 'shop-3',
    rating: 4.6,
    reviews: 85,
    badge: 'wishlist',
  },
  {
    id: '4',
    name: 'UltraFast Portable SSD 2TB',
    price: 189000,
    image: null,
    condition: 'new' as const,
    shop: 'DataStore',
    shopId: 'shop-4',
    rating: 4.7,
    reviews: 210,
    badge: 'wishlist',
  },
];

const mockFlashSales = [
  {
    id: 'fs-1',
    name: 'Noise Cancelling Earbuds Pro',
    price: 139000,
    discount: '-30%',
    image: null,
  },
  {
    id: 'fs-2',
    name: 'SmartWatch Series 5',
    price: 249000,
    discount: '-15%',
    image: null,
  },
];

const mobileCategories = [
  { name: 'All Tech', icon: null, active: true },
  { name: 'Phones', icon: Smartphone, active: false },
  { name: 'Laptops', icon: Laptop, active: false },
  { name: 'Audio', icon: Headphones, active: false },
];

const mockCategories = [
  { name: 'Phones', icon: Smartphone, href: '/categories/phones', count: 1240 },
  { name: 'Laptops', icon: Laptop, href: '/categories/laptops', count: 856 },
  { name: 'Audio', icon: Headphones, href: '/categories/audio', count: 432 },
  { name: 'Power Banks', icon: Battery, href: '/categories/power-banks', count: 268 },
  { name: 'Accessories', icon: Cable, href: '/categories/accessories', count: 1085 },
  { name: 'Monitors', icon: Monitor, href: '/categories/monitors', count: 194 },
  { name: 'Gaming', icon: Gamepad2, href: '/categories/gaming', count: 312 },
  { name: 'Watches', icon: Watch, href: '/categories/watches', count: 176 },
  { name: 'Cameras', icon: Camera, href: '/categories/cameras', count: 98 },
  { name: 'Tablets', icon: Monitor, href: '/categories/tablets', count: 245 },
];

const mockShops = [
  {
    id: 'shop-1',
    name: 'TechHub Electronics',
    products: 245,
    rating: 4.8,
    description: 'Premium phones & accessories',
  },
  {
    id: 'shop-2',
    name: 'PhoneCity Kano',
    products: 189,
    rating: 4.7,
    description: 'New & UK-used smartphones',
  },
  {
    id: 'shop-3',
    name: 'CompuLand',
    products: 312,
    rating: 4.9,
    description: 'Laptops & computing solutions',
  },
  {
    id: 'shop-4',
    name: 'UK Laptops Hub',
    products: 156,
    rating: 4.5,
    description: 'Quality UK-used laptops',
  },
  {
    id: 'shop-5',
    name: 'Gadget Zone',
    products: 423,
    rating: 4.6,
    description: 'All gadgets, one place',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Browse Products',
    description:
      'Explore thousands of electronics from trusted sellers across Farm Center, Kano.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Add to Cart',
    description:
      'Compare prices, read reviews, and add your favorites to your cart.',
    icon: ShoppingCart,
  },
  {
    step: 3,
    title: 'Checkout & Enjoy',
    description:
      'Securely pay and get your products delivered or pick up from the store.',
    icon: Package,
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);

/* ── Component ─────────────────────────────────────────────────────── */

export default function HomePage({ products = mockProducts, shops = mockShops }: { products?: any[], shops?: any[] }) {
  const { addItem } = useCartStore();
  const shopsScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="overflow-hidden bg-[#fafafa]">
      
      {/* ═══════════ Mobile Search & Categories ═══════════ */}
      <section className="px-4 pt-4 lg:hidden bg-surface-container-lowest pb-4">
        {/* Search Bar */}
        <div className="flex items-center rounded-full border border-outline-variant/50 bg-white p-1 pl-4 shadow-sm">
          <Search className="h-5 w-5 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search gadgets, phones, laptops..."
            className="w-full bg-transparent border-none focus:ring-0 font-body text-[15px] text-on-surface placeholder:text-on-surface-variant p-2 outline-none"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f0ff] shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {mobileCategories.map((cat) => (
            <button
              key={cat.name}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-label text-sm font-medium transition-colors border ${
                cat.active
                  ? 'bg-[#1a202c] text-white border-[#1a202c]'
                  : 'bg-white text-on-surface-variant border-outline-variant hover:border-outline'
              }`}
            >
              {cat.icon && <cat.icon className="h-4 w-4" />}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════ Desktop Hero Section ═══════════ */}
      <section className="hidden lg:flex relative min-h-[500px] items-center justify-center px-4 py-16 overflow-hidden bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
             <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 shadow-sm">
              <Zap className="h-4 w-4 text-secondary fill-secondary" />
              <span className="text-xs font-label font-bold text-secondary uppercase tracking-wider">
                Weekend Flash Sale
              </span>
            </div>
            <h1 className="font-heading text-5xl font-black leading-[1.1] tracking-tight lg:text-6xl text-on-surface">
              Discover Premium <span className="text-primary">Tech Gear</span>
            </h1>
            <p className="max-w-lg text-lg text-on-surface-variant font-body">
              Shop the latest phones, laptops, and accessories with unbeatable prices and fast delivery.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <button className="rounded-full bg-secondary text-on-secondary px-8 py-3.5 font-label font-bold tracking-wide transition-opacity hover:opacity-90 shadow-md">
                Shop Flash Sale
              </button>
              <button className="rounded-full bg-surface-container text-on-surface px-8 py-3.5 font-label font-bold tracking-wide transition-colors hover:bg-surface-container-high border border-outline-variant shadow-sm">
                View Categories
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] rounded-3xl bg-surface-container-low border border-outline-variant overflow-hidden relative shadow-lg">
              {/* Mock desktop hero image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low to-surface-container flex items-center justify-center">
                <Laptop className="h-32 w-32 text-outline/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Flash Sales ═══════════ */}
      <section className="py-6 sm:py-12 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold text-on-surface flex items-center gap-2 sm:text-2xl">
              <Zap className="h-5 w-5 text-error fill-error" />
              Flash Sales
            </h2>
            <Link href="/sales" className="text-sm font-label font-semibold text-primary hover:text-primary/80">
              View all
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Hero Flash Sale Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0b1320] lg:w-2/3 h-[240px] sm:h-[300px]">
              {/* Background styling to mock an image */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-surface-container-high/20" />
              
              <div className="relative z-20 p-5 sm:p-8 flex flex-col h-full justify-between">
                <div className="inline-block bg-secondary text-on-secondary text-xs font-label font-bold px-3 py-1.5 rounded w-max">
                  Ends in 2h 14m
                </div>
                
                <div className="mt-auto">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                    Quantum V
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-heading text-2xl font-bold text-secondary">
                      {formatPrice(1299000)}
                    </span>
                    <span className="font-heading text-base text-white/50 line-through">
                      {formatPrice(1599000)}
                    </span>
                  </div>
                  <button className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label font-bold text-sm hover:bg-secondary/90 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Side Flash Sales List */}
            <div className="flex flex-col gap-4 lg:w-1/3">
              {mockFlashSales.map((item) => (
                <div key={item.id} className="flex bg-white rounded-2xl border border-outline-variant/50 p-4 shadow-sm items-center justify-between h-full">
                  <div className="flex flex-col justify-between h-full py-1 w-1/2 pr-2">
                    <div className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-2">
                      {item.discount}
                    </div>
                    <h4 className="font-heading text-sm font-bold text-on-surface line-clamp-2 leading-snug mb-2">
                      {item.name}
                    </h4>
                    <p className="font-heading text-base font-bold text-on-surface">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="w-1/2 h-[90px] bg-[#e6ecef] rounded-xl flex items-center justify-center overflow-hidden">
                    {/* Placeholder for the image */}
                    {item.name.includes('Earbud') ? (
                      <Headphones className="h-8 w-8 text-outline" />
                    ) : (
                      <Watch className="h-8 w-8 text-outline" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Trending Now ═══════════ */}
      <section className="py-6 sm:py-12 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-bold text-on-surface sm:text-2xl">
              Trending Now
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl border border-outline-variant/60 bg-white overflow-hidden shadow-[0_4px_12px_rgba(4,22,39,0.03)] hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] transition-shadow"
              >
                {/* Image Area */}
                <div className="relative aspect-square w-full bg-[#f3f4f6] flex items-center justify-center p-6">
                  {/* Badge Area */}
                  {product.badge === 'bestseller' ? (
                    <div className="absolute top-3 left-3 bg-[#0f172a] text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      Bestseller
                    </div>
                  ) : null}
                  
                  {product.badge === 'wishlist' ? (
                    <button className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Heart className="h-3.5 w-3.5 text-on-surface-variant" />
                    </button>
                  ) : null}

                  {/* Icon placeholder based on product name */}
                  {product.name.includes('Phone') ? <Smartphone className="w-16 h-16 text-outline" /> :
                   product.name.includes('Keyboard') ? <Laptop className="w-16 h-16 text-outline" /> :
                   product.name.includes('Camera') ? <Camera className="w-16 h-16 text-outline" /> :
                   <Monitor className="w-16 h-16 text-outline" />}
                </div>

                {/* Info Area */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-[11px] font-label font-bold text-on-surface">
                      {product.rating}
                    </span>
                    <span className="text-[11px] font-label text-on-surface-variant">
                      ({product.reviews})
                    </span>
                    <span className="text-[11px] font-label text-on-surface-variant ml-1 truncate flex items-center gap-0.5">
                      {product.shop}
                      <svg className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-sm font-semibold text-on-surface line-clamp-2 leading-tight mb-3">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-on-surface">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          imageUrl: '',
                          shopId: product.shopId,
                          shopName: product.shop,
                          slug: product.id,
                          quantity: 1,
                        })
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Categories Grid ═══════════ */}
      <section className="py-12 sm:py-20 bg-white border-t border-outline-variant/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-xl font-bold text-on-surface sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant max-w-2xl mx-auto">
              Find exactly what you&apos;re looking for across our diverse range of technical categories
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {mockCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-outline-variant/50 bg-[#fafafa] p-6 transition-all duration-300 hover:border-secondary/30 hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-300 group-hover:bg-[#e6f0ff]">
                  <cat.icon className="h-6 w-6 text-on-surface-variant transition-colors group-hover:text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-heading text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-1 text-[11px] font-label text-on-surface-variant">
                    {cat.count.toLocaleString()} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Popular Shops ═══════════ */}
      <section className="py-12 sm:py-20 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-xl font-bold text-on-surface sm:text-3xl">
                Popular Shops
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Trusted sellers running their businesses on Farm Center
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scroll(shopsScrollRef, 'left')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary active:scale-95 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll(shopsScrollRef, 'right')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary active:scale-95 shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={shopsScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col p-4 sm:p-5 overflow-hidden rounded-2xl border border-outline-variant/60 bg-white shadow-[0_4px_12px_rgba(4,22,39,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)]"
              >
                {/* Shop banner area */}
                <div className="relative mb-5 h-24 w-full rounded-xl bg-[#e6ecef] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e6ecef] to-secondary/10" />
                  <div className="flex h-full w-full items-center justify-center relative z-10">
                    <Store className="h-8 w-8 text-outline/50" />
                  </div>
                </div>

                {/* Shop logo */}
                <div className="absolute top-[72px] left-8 z-20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-white bg-[#fafafa] shadow-sm">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="mt-2 px-1">
                  <h3 className="font-heading text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {shop.name}
                  </h3>
                  <p className="mt-1 text-xs text-on-surface-variant line-clamp-1">
                    {shop.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-outline-variant/40 pt-3">
                    <span className="text-[11px] font-label font-semibold text-on-surface-variant px-2 py-1 bg-[#fafafa] rounded border border-outline-variant/30">
                      {shop.products} products
                    </span>
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="h-3 w-3 fill-secondary" />
                      <span className="text-xs font-label font-bold text-on-surface">{shop.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ How It Works ═══════════ */}
      <section className="py-12 sm:py-20 bg-white border-t border-outline-variant/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-xl font-bold text-on-surface sm:text-3xl">
              Shopping Made Simple
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant max-w-xl mx-auto">
              Follow these three simple steps to get your hands on the best tech in town.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 relative">
            {/* Connecting Line */}
            <div className="hidden sm:block absolute top-[50px] left-[15%] right-[15%] h-0.5 border-dashed border-b border-outline-variant/50 z-0" />

            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="group relative z-10 flex flex-col items-center text-center"
              >
                {/* Icon Circle */}
                <div className="relative mb-5 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(4,22,39,0.06)] transition-transform duration-300 group-hover:-translate-y-2 border border-outline-variant/20">
                  {/* Step number badge */}
                  <div className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#e6f0ff] text-[10px] font-label font-bold text-primary shadow-sm border border-white">
                    {item.step}
                  </div>
                  <item.icon className="h-8 w-8 text-on-surface transition-colors group-hover:text-primary" />
                </div>

                <h3 className="font-heading text-lg font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant max-w-[260px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA: Start Selling ═══════════ */}
      <section className="py-12 sm:py-20 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary shadow-lg">
            {/* Background effects */}
            <div className="absolute inset-0">
              <div className="absolute -top-[150px] -right-[150px] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[80px]" />
              <div className="absolute -bottom-[150px] -left-[150px] h-[400px] w-[400px] rounded-full bg-white/10 blur-[80px]" />
            </div>

            <div className="relative z-10 px-6 py-16 text-center sm:px-12 sm:py-20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <Store className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-label font-bold text-white uppercase tracking-wider">
                  For Sellers
                </span>
              </div>

              <h2 className="mx-auto max-w-2xl font-heading text-2xl font-black text-white sm:text-4xl leading-tight">
                Grow Your Business Online
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] text-white/80 sm:text-base">
                Join hundreds of sellers at Farm Center Market. Reach thousands of buyers, manage orders easily, and scale your sales.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-label text-white">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-secondary" />
                  Free Starter Plan
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                  <Upload className="h-3.5 w-3.5 text-secondary" />
                  Easy Upload
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-secondary" />
                  Reach Buyers
                </div>
              </div>

              <Link
                href="/register"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-label text-sm font-bold text-primary transition-all hover:bg-secondary hover:text-on-secondary hover:-translate-y-1 shadow-md active:scale-[0.98]"
              >
                Open Your Shop — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
