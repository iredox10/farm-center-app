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
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useRef } from 'react';

/* ── Mock Data ─────────────────────────────────────────────────────── */

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    price: 980000,
    image: null,
    condition: 'new' as const,
    shop: 'TechHub Electronics',
    shopId: 'shop-1',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 850000,
    image: null,
    condition: 'new' as const,
    shop: 'PhoneCity Kano',
    shopId: 'shop-2',
    rating: 4.7,
  },
  {
    id: '3',
    name: 'MacBook Air M3 15-inch',
    price: 1250000,
    image: null,
    condition: 'new' as const,
    shop: 'CompuLand',
    shopId: 'shop-3',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'HP EliteBook 840 G7',
    price: 320000,
    image: null,
    condition: 'uk-used' as const,
    shop: 'UK Laptops Hub',
    shopId: 'shop-4',
    rating: 4.5,
  },
  {
    id: '5',
    name: 'AirPods Pro 2nd Gen',
    price: 185000,
    image: null,
    condition: 'new' as const,
    shop: 'TechHub Electronics',
    shopId: 'shop-1',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Anker PowerBank 20000mAh',
    price: 28000,
    image: null,
    condition: 'new' as const,
    shop: 'Gadget Zone',
    shopId: 'shop-5',
    rating: 4.6,
  },
  {
    id: '7',
    name: 'Google Pixel 8 Pro',
    price: 620000,
    image: null,
    condition: 'uk-used' as const,
    shop: 'PhoneCity Kano',
    shopId: 'shop-2',
    rating: 4.4,
  },
  {
    id: '8',
    name: 'Dell XPS 13 Plus',
    price: 750000,
    image: null,
    condition: 'new' as const,
    shop: 'CompuLand',
    shopId: 'shop-3',
    rating: 4.7,
  },
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

const quickCategories = [
  { name: 'Phones', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Accessories', icon: Cable },
  { name: 'Audio', icon: Headphones },
  { name: 'Power Banks', icon: Battery },
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

export default function HomePage() {
  const { addItem } = useCartStore();
  const productsScrollRef = useRef<HTMLDivElement>(null);
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
    <div className="overflow-hidden">
      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-green-400/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-gold-400/[0.03] blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/5 h-2 w-2 rounded-full bg-green-400/30 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-gold-400/40 animate-pulse [animation-delay:1s]" />
          <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-green-400/20 animate-pulse [animation-delay:2s]" />
          <div className="absolute top-2/3 right-1/3 h-2.5 w-2.5 rounded-full bg-gold-400/20 animate-pulse [animation-delay:0.5s]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              Kano&apos;s #1 Electronics Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-text-primary">Your One-Stop</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-gold-400 bg-clip-text text-transparent">
              Electronics Market
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-text-muted sm:text-lg">
            Discover the best phones, laptops &amp; accessories from
            Kano&apos;s Farm Center. New and UK-used, all in one place.
          </p>

          {/* Hero search bar */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="group relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-green-400" />
              <input
                type="text"
                placeholder="Search phones, laptops, accessories..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-base text-text-primary placeholder:text-text-muted backdrop-blur-sm transition-all duration-300 focus:border-green-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:shadow-[0_0_40px_rgba(0,245,160,0.08)]"
              />
            </div>
          </div>

          {/* Quick category pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.name.toLowerCase().replace(' ', '-')}`}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-text-muted transition-all duration-300 hover:border-green-400/30 hover:bg-green-400/5 hover:text-green-400"
              >
                <cat.icon className="h-3.5 w-3.5 transition-colors group-hover:text-green-400" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Trending Products ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                Trending Products
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                The most popular electronics right now
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scroll(productsScrollRef, 'left')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-text-muted transition-all hover:border-white/20 hover:bg-white/5 hover:text-text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll(productsScrollRef, 'right')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-text-muted transition-all hover:border-white/20 hover:bg-white/5 hover:text-text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={productsScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="group w-[280px] shrink-0 snap-start rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-green-400/5"
              >
                {/* Image area */}
                <div className="relative h-56 overflow-hidden rounded-t-2xl bg-navy-800/50">
                  <div className="flex h-full w-full items-center justify-center">
                    <Smartphone className="h-16 w-16 text-text-muted/20 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {/* Condition badge */}
                  <div
                    className={`absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      product.condition === 'new'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-gold-400/20 text-gold-400'
                    }`}
                  >
                    {product.condition === 'uk-used' ? 'UK Used' : 'New'}
                  </div>
                  {/* Quick add button */}
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
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/90 text-navy-950 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:bg-green-400 active:scale-95"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>

                {/* Product info */}
                <div className="p-4">
                  <p className="text-xs text-text-muted">{product.shop}</p>
                  <h3 className="mt-1 truncate font-heading text-sm font-semibold text-text-primary">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-heading text-lg font-bold text-green-400">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center gap-1 text-gold-400">
                      <Star className="h-3 w-3 fill-gold-400" />
                      <span className="text-xs font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Categories Grid ═══════════ */}
      <section className="py-16 sm:py-20 bg-navy-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {mockCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-green-400/5 hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 transition-all duration-300 group-hover:bg-green-400/10 group-hover:text-green-400">
                  <cat.icon className="h-6 w-6 text-text-muted transition-colors group-hover:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-heading text-sm font-semibold text-text-primary">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {cat.count.toLocaleString()} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Popular Shops ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                Popular Shops
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Trusted sellers at Farm Center
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scroll(shopsScrollRef, 'left')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-text-muted transition-all hover:border-white/20 hover:bg-white/5 hover:text-text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll(shopsScrollRef, 'right')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-text-muted transition-all hover:border-white/20 hover:bg-white/5 hover:text-text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={shopsScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {mockShops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group w-[280px] shrink-0 snap-start rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-green-400/5"
              >
                {/* Shop banner area */}
                <div className="mb-4 h-24 overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-700">
                  <div className="flex h-full w-full items-center justify-center">
                    <Store className="h-10 w-10 text-text-muted/20" />
                  </div>
                </div>

                {/* Shop logo */}
                <div className="-mt-10 mb-3 ml-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-navy-950 bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-sm">
                    <Store className="h-6 w-6 text-green-400" />
                  </div>
                </div>

                <h3 className="font-heading text-sm font-bold text-text-primary group-hover:text-green-400 transition-colors">
                  {shop.name}
                </h3>
                <p className="mt-0.5 text-xs text-text-muted">
                  {shop.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {shop.products} products
                  </span>
                  <div className="flex items-center gap-1 text-gold-400">
                    <Star className="h-3 w-3 fill-gold-400" />
                    <span className="text-xs font-medium">{shop.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ How It Works ═══════════ */}
      <section className="py-16 sm:py-20 bg-navy-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Shopping made simple in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {howItWorks.map((item, index) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-green-400/20 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-green-400/5"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-400 text-xs font-bold text-navy-950">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-all duration-300 group-hover:bg-green-400/10">
                  <item.icon className="h-7 w-7 text-text-muted transition-colors group-hover:text-green-400" />
                </div>

                <h3 className="font-heading text-base font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.description}
                </p>

                {/* Connector line (not on last item) */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-white/10 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA: Start Selling ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-navy-900 to-gold-400/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,245,160,0.08),transparent_50%)]" />

            <div className="relative px-8 py-16 text-center sm:py-20 sm:px-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-400/10 px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                  For Sellers
                </span>
              </div>

              <h2 className="mx-auto max-w-lg font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
                Start Selling Today
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-text-muted">
                Join hundreds of sellers at Farm Center Market and reach
                thousands of buyers across Kano and beyond.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <CreditCard className="h-4 w-4 text-green-400" />
                  Free starter plan
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Upload className="h-4 w-4 text-green-400" />
                  Easy product upload
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users className="h-4 w-4 text-green-400" />
                  Reach thousands of buyers
                </div>
              </div>

              <Link
                href="/seller/register"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-8 py-4 font-heading text-base font-bold text-navy-950 transition-all hover:shadow-xl hover:shadow-green-400/25 active:scale-[0.98]"
              >
                Open Your Shop — It&apos;s Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
