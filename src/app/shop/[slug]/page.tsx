'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, CheckCircle, Phone, MessageCircle, Share2, ShoppingCart, ExternalLink,
  Star, Plus, Smartphone, Laptop, Clock, Award, ShieldCheck, Mail, Wrench, Check, Shield
} from 'lucide-react';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';

// --- MOCK DATA SIMULATING DATABASE WITH TRUST METRICS ---
const shop = {
  name: "TechHub Electronics",
  slug: "techhub-electronics",
  whatsapp: "+2348091234567",
  phone: "+2348091234567",
  isVerified: true,
  physicalAuditDate: '2023-10-15',
  ratingAverage: 4.9,
  reviewCount: 1245,
  createdAt: '2018-04-12T00:00:00Z',
  location: "Shop 42, Block B, FarmCenter GSM Market, Kano State, Nigeria."
};

const mockProducts = [
  {
    id: 'p1', name: 'iPhone 15 Pro Max', category: 'phone', price: 1450000, discountPrice: 1550000,
    specs: '256GB, Natural Titanium.', tag: 'NEW RELEASE', tagType: 'bg-[#006875]',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
    certificationStatus: 'certified', batteryHealth: 100, testingWarrantyDays: 30,
    isFeatured: true
  },
  {
    id: 'p2', name: 'iPhone 14', category: 'phone', price: 620000, discountPrice: null,
    specs: '128GB, Midnight, Refurbished Grade A.', tag: 'SAVE 15%', tagType: 'bg-[#00e5ff] text-[#041627]',
    image: 'https://images.unsplash.com/photo-1663465374413-83eb009efa03?auto=format&fit=crop&q=80&w=400',
    certificationStatus: 'certified', batteryHealth: 92, testingWarrantyDays: 7,
    isFeatured: false
  },
  {
    id: 'l1', name: 'ROG Zephyrus G14', category: 'laptop', price: 2100000,
    specs: 'Ryzen 9, 32GB RAM, 1TB SSD. High-Tech Cooling.', tag: 'RTX 4070', tagColor: 'bg-orange-100 text-orange-700',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400',
    certificationStatus: 'none', testingWarrantyDays: 7
  },
  {
    id: 'l2', name: 'Alienware m15 R7', category: 'laptop', price: 1550000,
    specs: 'Core i7, 16GB RAM, 512GB SSD, RGB Per-Key.', tag: 'RTX 3060', tagColor: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400',
    certificationStatus: 'certified', testingWarrantyDays: 14
  },
  {
    id: 'l3', name: 'Razer Blade 15', category: 'laptop', price: 2850000,
    specs: 'Core i9, 32GB RAM, 1TB SSD. QHD Display.', tag: '240HZ', tagColor: 'bg-amber-100 text-amber-700',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400',
    certificationStatus: 'certified', batteryHealth: 98, testingWarrantyDays: 30
  }
];

export default function ShopStorefrontPage() {
  const [copied, setCopied] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleCopyShopLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shop/${shop.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinedYear = new Date(shop.createdAt).getFullYear();
  const latestIphones = mockProducts.filter(p => p.category === 'phone');
  const featuredPhone = latestIphones.find(p => p.isFeatured) || latestIphones[0];
  const regularPhones = latestIphones.filter(p => p.id !== featuredPhone?.id);
  const gamingLaptops = mockProducts.filter(p => p.category === 'laptop');

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Hero Banner Area */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-[#041627] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&q=80&w=2070" alt="Shop Background" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041627] via-[#041627]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041627]/90 via-[#041627]/40 to-transparent" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end w-full">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2">
               <div className="w-full h-full border-2 border-primary/20 rounded-lg flex flex-col items-center justify-center text-center p-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                     <span className="font-heading text-lg sm:text-xl font-bold text-primary">T</span>
                  </div>
                  <span className="font-heading text-[10px] sm:text-xs font-bold text-primary leading-none mb-0.5">TECHHUB</span>
                  <span className="text-[7px] sm:text-[8px] text-outline font-bold leading-none tracking-wider">ELECTRONICS</span>
               </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-white pb-1">
               <div className="flex items-center gap-2 mb-1.5">
                 <h1 className="font-heading text-2xl sm:text-3xl font-bold">{shop.name}</h1>
                 {shop.isVerified && (
                   <span title="Verified Seller" className="flex items-center">
                     <CheckCircle className="w-5 h-5 text-[#00e5ff] fill-[#041627]" />
                   </span>
                 )}
               </div>
               <p className="text-sm text-gray-300 mb-3 sm:mb-4">Premium Gadget Retailer since {joinedYear} • Kano FarmCenter</p>
               <div className="flex flex-wrap gap-2 sm:gap-3">
                 <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm border border-white/20 flex items-center gap-1.5 shadow-sm">
                   <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" /> {shop.ratingAverage} ({(shop.reviewCount / 1000).toFixed(1)}k Reviews)
                 </span>
                 <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm border border-white/20 flex items-center gap-1.5 shadow-sm">
                   <MessageCircle className="w-3.5 h-3.5 text-blue-200" /> Fast Response
                 </span>
               </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full md:w-auto pb-1 mt-2 md:mt-0">
              <button className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[#00e5ff] text-[#041627] font-bold flex items-center justify-center gap-2 hover:bg-[#00cce6] transition-all shadow-[0_4px_14px_rgba(0,229,255,0.3)]">
                <Plus className="w-4 h-4" /> Follow Shop
              </button>
              <button 
                onClick={handleCopyShopLink}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 font-medium"
              >
                {copied ? <Check className="w-4 h-4 text-[#00e5ff]" /> : <Share2 className="w-4 h-4" />} 
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="flex-1 space-y-12 min-w-0">
            
            {/* Latest iPhones Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-[#00e5ff] rounded-full inline-block"></span>
                  Latest iPhones
                </h2>
                <Link href="#" className="text-[#006875] font-semibold text-sm hover:underline">View All</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {/* Featured iPhone (Spans 2 cols) */}
                {featuredPhone && (
                  <div className="md:col-span-2 bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-[0_4px_20px_rgba(4,22,39,0.03)] flex flex-col group">
                     <div className="bg-[#f8f9fa] p-6 sm:p-8 flex-1 relative flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                          <span className={`px-3 py-1 ${featuredPhone.tagType || 'bg-[#006875]'} text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wide`}>
                            {featuredPhone.tag}
                          </span>
                          {featuredPhone.certificationStatus === 'certified' && (
                            <span className="px-3 py-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wide flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3.5 h-3.5" /> CERTIFIED
                            </span>
                          )}
                        </div>
                        {/* iPhone Image */}
                        <div className="w-56 h-64 relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl">
                           <img src={featuredPhone.image} alt={featuredPhone.name} className="object-contain h-full w-full rounded-2xl border-4 border-white/50 mix-blend-multiply" />
                        </div>
                     </div>
                     <div className="p-6 sm:p-8 border-t border-outline-variant/30">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">{featuredPhone.name}</h3>
                          <div className="text-left sm:text-right">
                            <p className="font-heading font-bold text-primary text-xl sm:text-2xl">{formatPrice(featuredPhone.price)}</p>
                            {featuredPhone.discountPrice && (
                              <p className="text-sm font-semibold text-outline line-through mt-0.5">{formatPrice(featuredPhone.discountPrice)}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm sm:text-base mb-4 max-w-md">{featuredPhone.specs}</p>
                        
                        {/* Trust Details */}
                        <div className="flex gap-2 mb-6 sm:mb-8">
                          {featuredPhone.batteryHealth && (
                             <span className="px-3 py-1.5 bg-[#e5eeff] text-[#006875] text-xs font-bold rounded-lg border border-[#dce9ff]">
                               Battery: {featuredPhone.batteryHealth}%
                             </span>
                          )}
                          {featuredPhone.testingWarrantyDays > 0 && (
                             <span className="px-3 py-1.5 bg-[#e5eeff] text-[#006875] text-xs font-bold rounded-lg border border-[#dce9ff]">
                               {featuredPhone.testingWarrantyDays}-Day Warranty
                             </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <button 
                            onClick={() => addItem({ productId: featuredPhone.id, shopId: 'shop-1', name: featuredPhone.name, price: featuredPhone.price, quantity: 1, imageUrl: '', shopName: shop.name, slug: featuredPhone.id })}
                            className="flex-1 bg-primary text-white py-3.5 sm:py-4 rounded-xl font-bold hover:bg-[#006875] transition-colors shadow-md text-sm sm:text-base"
                          >
                            Add to Cart
                          </button>
                          <button className="px-8 py-3.5 sm:py-4 rounded-xl border-2 border-outline-variant text-primary font-bold hover:bg-[#fafafa] transition-colors text-sm sm:text-base">
                            Details
                          </button>
                        </div>
                     </div>
                  </div>
                )}
                
                {/* Regular Phones */}
                {regularPhones.map((phone) => (
                  <div key={phone.id} className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-[0_4px_20px_rgba(4,22,39,0.03)] flex flex-col group hover:border-outline/50 transition-colors">
                    <div className="bg-[#f1f5f9] p-6 flex-1 relative flex items-center justify-center min-h-[220px]">
                       <div className={`absolute top-4 right-4 px-2.5 py-1 ${phone.tagType || 'bg-[#00e5ff] text-[#041627]'} text-[10px] font-bold rounded-lg shadow-sm z-10`}>
                         {phone.tag}
                       </div>
                       <div className="w-36 h-48 relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 drop-shadow-xl">
                           <img src={phone.image} alt={phone.name} className="object-contain h-full w-full rounded-2xl border-4 border-white/50 mix-blend-multiply" />
                       </div>
                    </div>
                    <div className="p-5 sm:p-6 border-t border-outline-variant/30 flex flex-col flex-1">
                       <h3 className="font-heading text-lg font-bold text-primary mb-1.5">{phone.name}</h3>
                       <p className="text-on-surface-variant text-xs sm:text-sm mb-3 leading-relaxed flex-1">{phone.specs}</p>
                       
                       {/* Trust Details */}
                       <div className="flex flex-wrap gap-1.5 mb-4">
                         {phone.certificationStatus === 'certified' && (
                           <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded border border-green-200 flex items-center gap-1">
                             <ShieldCheck className="w-3 h-3" /> Certified
                           </span>
                         )}
                         {phone.testingWarrantyDays > 0 && (
                           <span className="px-2 py-1 bg-[#f8f9fa] text-[#006875] text-[10px] font-bold rounded border border-outline-variant/50">
                             {phone.testingWarrantyDays}-Day Wty
                           </span>
                         )}
                       </div>

                       <p className="font-heading font-bold text-[#006875] text-xl mb-4">{formatPrice(phone.price)}</p>
                       <button 
                          onClick={() => addItem({ productId: phone.id, shopId: 'shop-1', name: phone.name, price: phone.price, quantity: 1, imageUrl: '', shopName: shop.name, slug: phone.id })}
                          className="w-full bg-[#e5eeff] text-[#006875] py-3 rounded-xl font-bold text-sm hover:bg-[#dce9ff] transition-colors mt-auto"
                        >
                          Quick Add
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gaming Laptops Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-[#00e5ff] rounded-full inline-block opacity-75"></span>
                  Gaming Laptops
                </h2>
                <Link href="#" className="text-[#006875] font-semibold text-sm hover:underline">View All</Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                 {gamingLaptops.map((laptop) => (
                   <div key={laptop.id} className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden shadow-[0_4px_16px_rgba(4,22,39,0.02)] flex flex-col group hover:border-outline transition-colors">
                     <div className="bg-[#f8f9fa] h-44 sm:h-48 flex items-center justify-center p-4 relative">
                        <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                          {laptop.certificationStatus === 'certified' && (
                            <span className="px-2 py-1 bg-green-600 text-white text-[9px] font-bold rounded-lg shadow-sm">
                              <ShieldCheck className="w-3 h-3 inline-block mr-0.5" /> CERTIFIED
                            </span>
                          )}
                        </div>
                        <div className="w-full h-full relative transform group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-xl">
                          <img src={laptop.image} alt={laptop.name} className="object-contain h-full w-full mix-blend-multiply" />
                        </div>
                     </div>
                     <div className="p-5 flex flex-col flex-1 border-t border-outline-variant/30">
                       <div className="mb-3">
                         <span className={`px-2.5 py-1 ${laptop.tagColor} text-[10px] font-bold rounded uppercase tracking-wider`}>{laptop.tag}</span>
                       </div>
                       <h3 className="font-heading text-sm sm:text-base font-bold text-primary mb-1.5 group-hover:text-[#006875] transition-colors">{laptop.name}</h3>
                       <p className="text-on-surface-variant text-xs mb-3 flex-1 leading-relaxed">{laptop.specs}</p>
                       
                       {/* Trust Details */}
                       {laptop.testingWarrantyDays > 0 && (
                         <div className="mb-4">
                           <span className="px-2 py-1 bg-[#e5eeff] text-[#006875] text-[10px] font-bold rounded border border-[#dce9ff]">
                             {laptop.testingWarrantyDays}-Day Warranty
                           </span>
                         </div>
                       )}

                       <div className="flex items-center justify-between mt-auto">
                         <p className="font-heading font-bold text-primary text-base">{formatPrice(laptop.price)}</p>
                         <button 
                           onClick={() => addItem({ productId: laptop.id, shopId: 'shop-1', name: laptop.name, price: laptop.price, quantity: 1, imageUrl: '', shopName: shop.name, slug: laptop.id })}
                           className="w-9 h-9 rounded-full bg-[#00e5ff] text-[#041627] flex items-center justify-center hover:bg-[#00cce6] transition-colors shadow-sm"
                         >
                           <ShoppingCart className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            </section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
             
             {/* About Shop Card */}
             <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-[0_4px_20px_rgba(4,22,39,0.03)] p-6 sm:p-7">
                <h3 className="font-heading text-lg font-bold text-primary mb-6">About Shop</h3>
                
                <div className="space-y-6">
                   {/* Location */}
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#006875]" />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-primary mb-1.5">Location</p>
                         <p className="text-sm text-on-surface-variant leading-relaxed">{shop.location}</p>
                         <Link href="#" className="text-[#006875] text-[11px] font-bold mt-2 inline-flex items-center gap-1 hover:underline">
                            View on Map <ExternalLink className="w-3 h-3" />
                         </Link>
                      </div>
                   </div>

                   {/* Physical Audit Date */}
                   {shop.physicalAuditDate && (
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                           <p className="font-bold text-sm text-primary mb-1.5">Audited by Platform</p>
                           <p className="text-sm text-on-surface-variant font-medium">Verified in-person on {new Date(shop.physicalAuditDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                   )}

                   {/* Working Hours */}
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[#006875]" />
                      </div>
                      <div className="w-full">
                         <p className="font-bold text-sm text-primary mb-2.5">Working Hours</p>
                         <div className="space-y-2 text-xs text-on-surface-variant w-full">
                            <div className="flex justify-between items-center">
                               <span className="font-medium">Mon - Fri</span> 
                               <span className="font-bold text-primary bg-[#e5eeff] px-2 py-0.5 rounded">09:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="font-medium">Saturday</span> 
                               <span className="font-bold text-primary bg-[#e5eeff] px-2 py-0.5 rounded">10:00 - 16:00</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="font-medium">Sunday</span> 
                               <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">Closed</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Contact Details */}
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-[#006875]" />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-primary mb-1.5">Contact Details</p>
                         <p className="text-sm text-on-surface-variant font-medium">{shop.phone}</p>
                         <p className="text-sm text-[#006875] hover:underline cursor-pointer mt-0.5">sales@techhubkano.com</p>
                      </div>
                   </div>
                </div>
                
                <div className="my-6 sm:my-7 border-t border-outline-variant/40"></div>
                
                {/* Shop Certifications */}
                <div className="mb-7">
                   <p className="font-bold text-sm text-primary mb-3.5">Shop Certifications</p>
                   <div className="flex flex-col gap-2.5">
                      <div className="px-3 py-2.5 bg-[#f8f9fa] text-primary text-xs font-bold rounded-xl flex items-center gap-3 border border-outline-variant/50">
                        <Award className="w-4 h-4 text-[#006875]" /> 
                        <span>Apple Reseller</span>
                      </div>
                      <div className="px-3 py-2.5 bg-[#f8f9fa] text-primary text-xs font-bold rounded-xl flex items-center gap-3 border border-outline-variant/50">
                        <ShieldCheck className="w-4 h-4 text-[#006875]" /> 
                        <span>Certified Tech</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => window.open(getWhatsAppLink(shop.whatsapp, `Hi ${shop.name}! I found your shop on Farm Center Market.`), '_blank')}
                  className="w-full bg-[#e5eeff] text-[#006875] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#dce9ff] transition-colors shadow-sm"
                >
                   <Mail className="w-4 h-4" /> Contact Seller
                </button>
             </div>

             {/* Need a Repair Banner */}
             <div className="bg-[#041627] rounded-2xl p-6 relative overflow-hidden shadow-[0_8px_24px_rgba(4,22,39,0.15)] group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#041627] to-[#1a2b3c]" />
                <div className="relative z-10">
                   <h4 className="font-heading text-[#00e5ff] text-lg font-bold mb-2">Need a Repair?</h4>
                   <p className="text-[#8192a7] text-xs leading-relaxed mb-5 max-w-[85%]">We offer screen replacements and battery swaps with 90-day warranty.</p>
                   <Link href="#" className="inline-flex items-center text-white text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/10">
                      Book Repair Now
                   </Link>
                </div>
                {/* Decorative Wrench */}
                <Wrench className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
             </div>

          </div>
        </div>
      </div>
    </main>
  );
}
