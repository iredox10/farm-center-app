import Link from 'next/link';
import {
  Smartphone, Laptop, Headphones, Battery, Shield, HardDrive,
  Wifi, Gamepad2, Watch, Wrench
} from 'lucide-react';

const categories = [
  { name: 'Phones & Tablets', slug: 'phones-tablets', icon: Smartphone, count: 234, subs: ['Android Phones', 'iPhones', 'Tablets', 'Feature Phones'] },
  { name: 'Laptops & Computers', slug: 'laptops-computers', icon: Laptop, count: 156, subs: ['HP', 'Dell', 'Lenovo', 'Apple MacBook', 'Desktops'] },
  { name: 'Audio', slug: 'audio', icon: Headphones, count: 89, subs: ['Earbuds', 'Headphones', 'Speakers', 'Microphones'] },
  { name: 'Power', slug: 'power', icon: Battery, count: 67, subs: ['Power Banks', 'Adapters', 'Solar Chargers'] },
  { name: 'Phone Accessories', slug: 'accessories', icon: Shield, count: 312, subs: ['Cases', 'Screen Guards', 'Chargers', 'Cables'] },
  { name: 'Storage', slug: 'storage', icon: HardDrive, count: 45, subs: ['Memory Cards', 'Flash Drives', 'SSDs', 'HDDs'] },
  { name: 'Networking', slug: 'networking', icon: Wifi, count: 34, subs: ['Routers', 'MiFi', 'Ethernet Cables'] },
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2, count: 28, subs: ['Controllers', 'Consoles', 'Gaming Accessories'] },
  { name: 'Wearables', slug: 'wearables', icon: Watch, count: 52, subs: ['Smart Watches', 'Fitness Trackers'] },
  { name: 'Repair Parts & Tools', slug: 'repair-parts', icon: Wrench, count: 76, subs: ['Screens', 'Batteries', 'Screwdriver Kits'] },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-on-surface">Browse Categories</h1>
          <p className="text-on-surface-variant mt-2">Find exactly what you need from Farm Center Market</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group block">
                <div className="bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_4px_12px_rgba(4,22,39,0.02)] group-hover:shadow-[0_8px_24px_rgba(4,22,39,0.06)] group-hover:border-primary/30 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-outline text-sm mt-0.5">{cat.count} products</p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.subs.map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 rounded-full text-xs bg-[#f3f4f6] text-on-surface-variant border border-outline-variant/50 group-hover:border-outline transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
