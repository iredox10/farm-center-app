'use client';

import { useState, useMemo } from 'react';
import {
  Palette,
  Type,
  LayoutGrid,
  List,
  Columns3,
  Save,
  Monitor,
  ToggleLeft,
  ToggleRight,
  Megaphone,
  Package,
  Star,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Color Presets ─── */

const COLOR_PRESETS = [
  '#00f5a0',
  '#00d68f',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
];

const SECONDARY_PRESETS = [
  '#f5c842',
  '#f5a623',
  '#a78bfa',
  '#fb923c',
  '#34d399',
  '#60a5fa',
  '#f472b6',
  '#fbbf24',
  '#818cf8',
  '#2dd4bf',
];

/* ─── Font Choices ─── */

const FONT_CHOICES = [
  { id: 'inter', name: 'Inter', sample: 'Modern & Clean', family: 'Inter, sans-serif' },
  { id: 'dm-sans', name: 'DM Sans', sample: 'Friendly & Readable', family: '"DM Sans", sans-serif' },
  { id: 'poppins', name: 'Poppins', sample: 'Bold & Geometric', family: 'Poppins, sans-serif' },
  { id: 'playfair', name: 'Playfair Display', sample: 'Elegant & Classic', family: '"Playfair Display", serif' },
];

/* ─── Layout Styles ─── */

const LAYOUT_STYLES = [
  {
    id: 'grid',
    name: 'Grid',
    icon: LayoutGrid,
    description: 'Classic card grid',
  },
  {
    id: 'list',
    name: 'List',
    icon: List,
    description: 'Horizontal rows',
  },
  {
    id: 'masonry',
    name: 'Masonry',
    icon: Columns3,
    description: 'Pinterest-style',
  },
];

export default function CustomizePage() {
  const [primaryColor, setPrimaryColor] = useState('#00f5a0');
  const [secondaryColor, setSecondaryColor] = useState('#f5c842');
  const [fontChoice, setFontChoice] = useState('inter');
  const [layoutStyle, setLayoutStyle] = useState('grid');
  const [announcementText, setAnnouncementText] = useState('🔥 Free delivery on orders above ₦50,000!');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedFont = useMemo(
    () => FONT_CHOICES.find((f) => f.id === fontChoice) || FONT_CHOICES[0],
    [fontChoice]
  );

  async function handleSave() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  }

  const inputClass =
    'w-full bg-navy-900/60 border border-white/8 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-text-primary">Customize Shop</h2>
        <p className="text-sm text-text-secondary mt-1">
          Personalize how your storefront looks to customers
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Settings Panel */}
        <div className="xl:col-span-3 space-y-6">
          {/* Colors */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Palette className="w-5 h-5 text-green-400" />
              Colors
            </h3>
            <div className="space-y-5">
              {/* Primary Color */}
              <div>
                <p className="text-sm font-medium text-text-secondary mb-3">Primary Color</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={cn(
                        'w-9 h-9 rounded-xl transition-all hover:scale-110',
                        primaryColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-navy-900'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <label className="relative w-9 h-9 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden">
                    <span className="text-xs text-text-muted">+</span>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <p className="text-sm font-medium text-text-secondary mb-3">Secondary Color</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {SECONDARY_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSecondaryColor(color)}
                      className={cn(
                        'w-9 h-9 rounded-xl transition-all hover:scale-110',
                        secondaryColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-navy-900'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <label className="relative w-9 h-9 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden">
                    <span className="text-xs text-text-muted">+</span>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Font */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Type className="w-5 h-5 text-green-400" />
              Font
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FONT_CHOICES.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontChoice(font.id)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all hover:scale-[1.02]',
                    fontChoice === font.id
                      ? 'bg-green-400/10 border-green-400/30'
                      : 'bg-white/3 border-white/6 hover:border-white/12'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-lg font-semibold text-text-primary"
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                    </p>
                    {fontChoice === font.id && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p
                    className="text-xs text-text-muted"
                    style={{ fontFamily: font.family }}
                  >
                    {font.sample}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-green-400" />
              Product Layout
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {LAYOUT_STYLES.map((layout) => {
                const Icon = layout.icon;
                return (
                  <button
                    key={layout.id}
                    onClick={() => setLayoutStyle(layout.id)}
                    className={cn(
                      'p-4 rounded-xl border text-center transition-all hover:scale-[1.02]',
                      layoutStyle === layout.id
                        ? 'bg-green-400/10 border-green-400/30'
                        : 'bg-white/3 border-white/6 hover:border-white/12'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-7 h-7 mx-auto mb-2',
                        layoutStyle === layout.id ? 'text-green-400' : 'text-text-muted'
                      )}
                    />
                    <p
                      className={cn(
                        'text-sm font-medium',
                        layoutStyle === layout.id ? 'text-text-primary' : 'text-text-secondary'
                      )}
                    >
                      {layout.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{layout.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Announcement */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-base font-semibold text-text-primary flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-green-400" />
                Announcement Banner
              </h3>
              <button
                onClick={() => setAnnouncementEnabled(!announcementEnabled)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {announcementEnabled ? (
                  <ToggleRight className="w-8 h-8 text-green-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className={cn(inputClass, !announcementEnabled && 'opacity-50')}
              placeholder="e.g., Free delivery on orders above ₦50,000!"
              disabled={!announcementEnabled}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Theme'}
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-2">
          <div className="sticky top-6">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/6 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-text-primary">Live Preview</span>
              </div>

              <div className="p-4">
                {/* Mini storefront preview */}
                <div
                  className="rounded-xl overflow-hidden border border-white/6"
                  style={{ fontFamily: selectedFont.family }}
                >
                  {/* Announcement */}
                  {announcementEnabled && announcementText && (
                    <div
                      className="px-3 py-1.5 text-center text-xs font-medium text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {announcementText}
                    </div>
                  )}

                  {/* Store header */}
                  <div className="p-4 bg-navy-800">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        TV
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">TechVille Store</p>
                        <p className="text-xs text-text-muted">Premium gadgets</p>
                      </div>
                    </div>
                  </div>

                  {/* Products preview */}
                  <div className="p-3 bg-navy-900/80">
                    {layoutStyle === 'grid' && (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="rounded-lg bg-navy-800 overflow-hidden border border-white/4">
                            <div className="aspect-square bg-navy-700 flex items-center justify-center">
                              <Package className="w-6 h-6 text-text-muted/30" />
                            </div>
                            <div className="p-2">
                              <div className="h-2 w-16 bg-white/10 rounded mb-1.5" />
                              <div
                                className="h-2 w-10 rounded"
                                style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                              />
                              <div className="flex items-center gap-0.5 mt-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className="w-2 h-2"
                                    style={{ color: secondaryColor }}
                                    fill={s <= 4 ? secondaryColor : 'none'}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {layoutStyle === 'list' && (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-2 p-2 rounded-lg bg-navy-800 border border-white/4">
                            <div className="w-12 h-12 rounded bg-navy-700 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-text-muted/30" />
                            </div>
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-white/10 rounded mb-1.5" />
                              <div
                                className="h-2 w-12 rounded"
                                style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {layoutStyle === 'masonry' && (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-navy-800 overflow-hidden border border-white/4"
                            style={{ height: i % 2 === 0 ? '120px' : '90px' }}
                          >
                            <div
                              className="w-full bg-navy-700 flex items-center justify-center"
                              style={{ height: i % 2 === 0 ? '80px' : '50px' }}
                            >
                              <Package className="w-5 h-5 text-text-muted/30" />
                            </div>
                            <div className="p-2">
                              <div className="h-1.5 w-12 bg-white/10 rounded mb-1" />
                              <div
                                className="h-1.5 w-8 rounded"
                                style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer preview */}
                  <div
                    className="p-2 text-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <p className="text-[10px] text-text-muted">
                      Powered by Farm Center Market
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
