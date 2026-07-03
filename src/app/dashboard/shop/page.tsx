'use client';

import { useState, useEffect } from 'react';
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
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/appwrite/api';
import { toast } from 'react-hot-toast';
import type { Shop } from '@/types';

export default function ShopSettingsPage() {
  const { user } = useAuthStore();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ─── Form State ─── */
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [payOnDelivery, setPayOnDelivery] = useState(true);
  const [whatsappOrders, setWhatsappOrders] = useState(true);
  
  useEffect(() => {
    async function fetchShop() {
      if (!user) return;
      try {
        const fetchedShop = await api.getShopByOwnerId(user.$id);
        if (fetchedShop) {
          setShop(fetchedShop);
          setShopName(fetchedShop.name || '');
          setShopDescription(fetchedShop.description || '');
          setShopPhone(fetchedShop.phone || '');
          setWhatsapp(fetchedShop.whatsapp || '');
          setLocation(fetchedShop.location || '');
          setPayOnDelivery(fetchedShop.allowPayOnDelivery ?? true);
          setWhatsappOrders(fetchedShop.allowWhatsappOrder ?? true);
        }
      } catch (error) {
        toast.error('Failed to load shop settings');
      } finally {
        setIsLoading(false);
      }
    }
    fetchShop();
  }, [user]);

  const shopSlug = shop?.slug || '';
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
    if (!shop) return;
    setSaving(true);
    try {
      await api.updateShop((shop as any).$id, {
        name: shopName,
        description: shopDescription,
        phone: shopPhone,
        whatsapp: whatsapp,
        location: location,
        allowPayOnDelivery: payOnDelivery,
        allowWhatsappOrder: whatsappOrders,
      });
      toast.success('Shop settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-on-surface-variant">Loading shop settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Shop Settings</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Manage your store profile and business details
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-label font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      {/* Share Link */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-label font-medium text-on-surface-variant mb-1">
            Your Shop URL
          </p>
          <p className="text-base font-heading font-bold text-on-surface">{shopUrl}</p>
        </div>
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-xl text-sm font-label font-bold text-on-surface hover:bg-surface-container transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Link
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/50">
              <Store className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-on-surface">Basic Info</h3>
            </div>

            <div>
              <label className={labelClass}>Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={inputClass}
                placeholder="e.g. TechVille Store"
              />
            </div>

            <div>
              <label className={labelClass}>Shop Description</label>
              <textarea
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                rows={4}
                className={cn(inputClass, 'resize-none')}
                placeholder="Tell customers about your business..."
              />
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/50">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-on-surface">Contact Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="tel"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="+234..."
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                    placeholder="+234..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 w-4 h-4 text-on-surface-variant/50" />
                <textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  rows={2}
                  className={cn(inputClass, 'pl-10 resize-none')}
                  placeholder="Where is your shop located?"
                />
              </div>
            </div>
          </section>

          {/* Business Preferences */}
          <section className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/50">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-on-surface">Preferences</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-outline-variant/50 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors">
                <div>
                  <p className="font-heading font-semibold text-sm text-on-surface mb-0.5">
                    Pay on Delivery
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    Allow customers to pay when they receive the item
                  </p>
                </div>
                <div
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative shrink-0',
                    payOnDelivery ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      payOnDelivery ? 'left-7' : 'left-1'
                    )}
                  />
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={payOnDelivery}
                  onChange={(e) => setPayOnDelivery(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-outline-variant/50 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors">
                <div>
                  <p className="font-heading font-semibold text-sm text-on-surface mb-0.5">
                    WhatsApp Orders
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    Allow customers to send order details directly to your WhatsApp
                  </p>
                </div>
                <div
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative shrink-0',
                    whatsappOrders ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      whatsappOrders ? 'left-7' : 'left-1'
                    )}
                  />
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={whatsappOrders}
                  onChange={(e) => setWhatsappOrders(e.target.checked)}
                />
              </label>
            </div>
          </section>
        </div>

        {/* Sidebar/Media */}
        <div className="space-y-6">
          <section className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
            <h3 className="font-heading text-lg font-bold text-on-surface mb-4">Shop Logo</h3>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-on-surface-variant/30" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-label font-bold hover:bg-surface-container-highest transition-colors w-full justify-center">
                <Upload className="w-4 h-4" />
                Upload Logo
              </button>
              <p className="text-[10px] font-body text-on-surface-variant mt-3">
                Recommended: 512x512px (JPG, PNG) Max: 2MB
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
