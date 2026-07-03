'use client';

import { useState } from 'react';
import {
  Store,
  Phone,
  MessageCircle,
  MapPin,
  Upload,
  Copy,
  Check,
  CreditCard,
  Globe,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ─── Form State ─── */
  const [shopName, setShopName] = useState('TechVille Store');
  const [shopDescription, setShopDescription] = useState(
    'Your one-stop shop for premium gadgets and electronics in Lagos. We sell brand new and UK-used devices.'
  );
  const [shopPhone, setShopPhone] = useState('+2348012345678');
  const [whatsapp, setWhatsapp] = useState('+2348012345678');
  const [location, setLocation] = useState('Shop 13, Albarka Plaza, Computer Village, Ikeja');
  const [payOnDelivery, setPayOnDelivery] = useState(true);
  const [whatsappOrders, setWhatsappOrders] = useState(true);

  const shopSlug = 'techville-store';
  const shopUrl = `farmcentermarket.com/shop/${shopSlug}`;

  const inputClass =
    'w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface font-body placeholder:text-on-surface-variant text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-[0_4px_12px_rgba(4,22,39,0.02)]';
  const labelClass = 'block text-sm font-label font-medium text-on-surface-variant mb-2';

  function handleCopyUrl() {
    navigator.clipboard.writeText(`https://${shopUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-on-surface">Shop Settings</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Manage your shop profile and preferences
        </p>
      </div>

      {/* Shop URL Display */}
      <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-label text-xs text-on-surface-variant">Your Shop URL</p>
            <p className="font-body text-sm font-medium text-on-surface">{shopUrl}</p>
          </div>
        </div>
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/50 text-sm font-label text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Info */}
        <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
          <h3 className="font-heading text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            Shop Information
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="shopName" className={labelClass}>Shop Name</label>
              <input
                id="shopName"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={inputClass}
                placeholder="Your shop name"
              />
            </div>
            <div>
              <label htmlFor="shopDescription" className={labelClass}>Description</label>
              <textarea
                id="shopDescription"
                rows={4}
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                className={cn(inputClass, 'resize-none')}
                placeholder="Tell customers about your shop..."
              />
            </div>
            <div>
              <label htmlFor="shopPhone" className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </span>
              </label>
              <input
                id="shopPhone"
                type="tel"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className={inputClass}
                placeholder="+234..."
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Number
                </span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={inputClass}
                placeholder="+234..."
              />
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
                placeholder="e.g., Shop 13, Albarka Plaza"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Logo & Banner Uploads */}
          <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Branding
            </h3>
            <div className="space-y-5">
              {/* Logo */}
              <div>
                <p className={labelClass}>Shop Logo</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-surface-container border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-on-primary">TV</span>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/50 text-sm font-label font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
                    >
                      Change Logo
                    </button>
                    <p className="font-body text-xs text-on-surface-variant mt-1.5">
                      Recommended: 200×200px, PNG/JPG
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div>
                <p className={labelClass}>Shop Banner</p>
                <div
                  className="relative h-32 rounded-xl bg-surface-container border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-outline-variant transition-colors group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10" />
                  <div className="relative text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-on-surface-variant group-hover:text-on-surface transition-colors" />
                    <p className="font-body text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Click to upload banner (1200×400px)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Options
            </h3>
            <div className="space-y-4">
              {/* Pay on Delivery */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <div>
                  <p className="font-body text-sm font-medium text-on-surface">Accept Pay on Delivery</p>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    Allow customers to pay when they receive their order
                  </p>
                </div>
                <button
                  onClick={() => setPayOnDelivery(!payOnDelivery)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5',
                    payOnDelivery ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full bg-white shadow-[0_4px_12px_rgba(4,22,39,0.02)] transition-transform',
                      payOnDelivery ? 'translate-x-5.5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* WhatsApp Orders */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/50">
                <div>
                  <p className="font-body text-sm font-medium text-on-surface">Accept WhatsApp Orders</p>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    Let customers place orders directly via WhatsApp
                  </p>
                </div>
                <button
                  onClick={() => setWhatsappOrders(!whatsappOrders)}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5',
                    whatsappOrders ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full bg-white shadow-[0_4px_12px_rgba(4,22,39,0.02)] transition-transform',
                      whatsappOrders ? 'translate-x-5.5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-on-primary text-sm font-label font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
