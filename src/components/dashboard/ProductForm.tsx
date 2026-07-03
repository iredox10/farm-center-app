'use client';

import { useState, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Upload,
  X,
  Star,
  Image as ImageIcon,
  Video,
  Sparkles,
  PackageCheck,
  RefreshCw,
  ChevronDown,
  Check,
  Link as LinkIcon,
  Copy,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductCondition } from '@/types';
import { SUBSCRIPTION_TIERS } from '@/lib/config/subscriptions';

/* ─── Schema ─── */

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
  condition: z.enum(['new', 'uk-used', 'refurbished'] as const),
  price: z.number({ error: 'Enter a valid price' }).positive('Price must be greater than 0'),
  discountPrice: z.number().min(0).optional(),
  stockQuantity: z.number({ error: 'Enter stock quantity' }).int().min(0, 'Stock cannot be negative'),
});

type ProductFormData = z.infer<typeof productSchema>;

/* ─── Categories ─── */

const CATEGORIES = [
  { id: 'phones', name: 'Phones & Tablets' },
  { id: 'laptops', name: 'Laptops & Computers' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'audio', name: 'Audio & Sound' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'cameras', name: 'Cameras & Photography' },
  { id: 'networking', name: 'Networking & Storage' },
];

/* ─── Condition Cards ─── */

const CONDITIONS: {
  value: ProductCondition;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}[] = [
  {
    value: 'new',
    label: 'Brand New',
    description: 'Factory sealed, unused',
    icon: Sparkles,
    gradient: 'from-green-400/20 to-green-600/10',
  },
  {
    value: 'uk-used',
    label: 'UK-Used',
    description: 'Pre-owned, good condition',
    icon: PackageCheck,
    gradient: 'from-blue-400/20 to-blue-600/10',
  },
  {
    value: 'refurbished',
    label: 'Refurbished',
    description: 'Restored to working order',
    icon: RefreshCw,
    gradient: 'from-gold-400/20 to-gold-500/10',
  },
];

/* ─── Media Item Type ─── */

interface MediaItem {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
  type: 'image' | 'video';
  progress: number;
}

/* ─── Props ─── */

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { mediaUrls?: string[] };
  onSubmit: (data: ProductFormData, media: MediaItem[]) => Promise<void>;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const tier = SUBSCRIPTION_TIERS['free'];
  const maxImages = tier.maxImagesPerProduct;
  const maxVideos = tier.maxVideosPerProduct;

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      categoryIds: initialData?.categoryIds || [],
      condition: initialData?.condition || 'new',
      price: initialData?.price || undefined,
      discountPrice: initialData?.discountPrice || undefined,
      stockQuantity: initialData?.stockQuantity ?? 1,
    },
  });

  const watchedCategories = watch('categoryIds');
  const productName = watch('name');

  const imageCount = mediaItems.filter((m) => m.type === 'image').length;
  const videoCount = mediaItems.filter((m) => m.type === 'video').length;

  /* ─── Media handlers ─── */

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      setMediaError('');

      fileArray.forEach((file) => {
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isImage && !isVideo) return;

        if (isImage && imageCount + mediaItems.filter((m) => m.type === 'image').length >= maxImages) {
          setMediaError(`Maximum ${maxImages} images allowed on your plan`);
          return;
        }

        if (isVideo && (maxVideos === 0 || videoCount >= maxVideos)) {
          setMediaError(maxVideos === 0 ? 'Upgrade to Pro for video uploads' : `Maximum ${maxVideos} video(s) allowed`);
          return;
        }

        const id = Math.random().toString(36).substring(2, 9);
        const preview = URL.createObjectURL(file);
        const isPrimary = mediaItems.length === 0 && isImage;

        setMediaItems((prev) => [
          ...prev,
          { id, file, preview, isPrimary, type: isImage ? 'image' : 'video', progress: 100 },
        ]);
      });
    },
    [imageCount, videoCount, maxImages, maxVideos, mediaItems]
  );

  function removeMedia(id: string) {
    setMediaItems((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      if (filtered.length > 0 && !filtered.some((m) => m.isPrimary)) {
        const firstImage = filtered.find((m) => m.type === 'image');
        if (firstImage) firstImage.isPrimary = true;
      }
      return [...filtered];
    });
    setMediaError('');
  }

  function setPrimary(id: string) {
    setMediaItems((prev) =>
      prev.map((m) => ({ ...m, isPrimary: m.id === id }))
    );
  }

  /* ─── Drag handlers ─── */

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  /* ─── Submit ─── */

  async function onFormSubmit(data: ProductFormData) {
    if (mediaItems.filter((m) => m.type === 'image').length === 0) {
      setMediaError('Upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data, mediaItems);
      if (!isEditing) {
        setShowSuccessModal(true);
      }
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyLink() {
    const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigator.clipboard.writeText(`https://farmcentermarket.com/products/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  /* ─── Input styles ─── */
  const inputClass =
    'w-full bg-navy-900/60 border border-white/8 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all';
  const labelClass = 'block text-sm font-medium text-text-secondary mb-2';
  const errorClass = 'text-xs text-red-400 mt-1.5';

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column — Product Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Name */}
            <div className="glass-card p-6">
              <h3 className="font-heading text-base font-semibold text-text-primary mb-4">
                Product Details
              </h3>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>Product Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g., iPhone 15 Pro Max 256GB"
                    className={cn(inputClass, errors.name && 'border-red-400/50')}
                    {...register('name')}
                  />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={labelClass}>Description</label>
                  <textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your product in detail — condition, specifications, what's included..."
                    className={cn(inputClass, 'resize-none', errors.description && 'border-red-400/50')}
                    {...register('description')}
                  />
                  {errors.description && <p className={errorClass}>{errors.description.message}</p>}
                </div>

                {/* Category */}
                <div className="relative">
                  <label className={labelClass}>Category</label>
                  <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                      <>
                        <button
                          type="button"
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          className={cn(
                            inputClass,
                            'flex items-center justify-between text-left',
                            errors.categoryIds && 'border-red-400/50'
                          )}
                        >
                          <span className={cn(field.value.length === 0 && 'text-text-muted')}>
                            {field.value.length === 0
                              ? 'Select categories'
                              : `${field.value.length} selected`}
                          </span>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-text-muted transition-transform',
                              categoryDropdownOpen && 'rotate-180'
                            )}
                          />
                        </button>

                        {/* Selected chips */}
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((catId) => {
                              const cat = CATEGORIES.find((c) => c.id === catId);
                              return (
                                <span
                                  key={catId}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 text-xs font-medium"
                                >
                                  {cat?.name}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      field.onChange(field.value.filter((v) => v !== catId))
                                    }
                                    className="hover:text-red-400 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Dropdown */}
                        {categoryDropdownOpen && (
                          <div className="absolute z-20 left-0 right-0 mt-2 glass-card p-2 rounded-xl border border-white/10 max-h-56 overflow-y-auto shadow-2xl">
                            {CATEGORIES.map((cat) => {
                              const isSelected = field.value.includes(cat.id);
                              return (
                                <button
                                  type="button"
                                  key={cat.id}
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(field.value.filter((v) => v !== cat.id));
                                    } else {
                                      field.onChange([...field.value, cat.id]);
                                    }
                                  }}
                                  className={cn(
                                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                                    isSelected
                                      ? 'bg-green-400/10 text-green-400'
                                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                  )}
                                >
                                  {cat.name}
                                  {isSelected && <Check className="w-4 h-4" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  />
                  {errors.categoryIds && <p className={errorClass}>{errors.categoryIds.message}</p>}
                </div>

                {/* Condition */}
                <div>
                  <label className={labelClass}>Condition</label>
                  <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {CONDITIONS.map((cond) => {
                          const Icon = cond.icon;
                          const isSelected = field.value === cond.value;
                          return (
                            <button
                              type="button"
                              key={cond.value}
                              onClick={() => field.onChange(cond.value)}
                              className={cn(
                                'relative p-4 rounded-xl border text-left transition-all group hover:scale-[1.02]',
                                isSelected
                                  ? `bg-gradient-to-br ${cond.gradient} border-green-400/30`
                                  : 'bg-white/3 border-white/6 hover:border-white/12'
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                              )}
                              <Icon
                                className={cn(
                                  'w-6 h-6 mb-2',
                                  isSelected ? 'text-green-400' : 'text-text-muted'
                                )}
                              />
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  isSelected ? 'text-text-primary' : 'text-text-secondary'
                                )}
                              >
                                {cond.label}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">{cond.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Pricing & Media */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing */}
            <div className="glass-card p-6">
              <h3 className="font-heading text-base font-semibold text-text-primary mb-4">
                Pricing & Stock
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className={labelClass}>Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">
                      ₦
                    </span>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={cn(inputClass, 'pl-8', errors.price && 'border-red-400/50')}
                      {...register('price', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.price && <p className={errorClass}>{errors.price.message}</p>}
                </div>

                <div>
                  <label htmlFor="discountPrice" className={labelClass}>
                    Discount Price <span className="text-text-muted">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">
                      ₦
                    </span>
                    <input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={cn(inputClass, 'pl-8')}
                      {...register('discountPrice', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stockQuantity" className={labelClass}>Stock Quantity</label>
                  <input
                    id="stockQuantity"
                    type="number"
                    placeholder="1"
                    className={cn(inputClass, errors.stockQuantity && 'border-red-400/50')}
                    {...register('stockQuantity', { valueAsNumber: true })}
                  />
                  {errors.stockQuantity && (
                    <p className={errorClass}>{errors.stockQuantity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base font-semibold text-text-primary">
                  Media
                </h3>
                <span className="text-xs text-text-muted">
                  {imageCount}/{maxImages} images
                  {maxVideos > 0 && ` · ${videoCount}/${maxVideos} videos`}
                </span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                  isDragging
                    ? 'border-green-400 bg-green-400/5'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/2'
                )}
              >
                <Upload
                  className={cn(
                    'w-10 h-10 mx-auto mb-3',
                    isDragging ? 'text-green-400' : 'text-text-muted'
                  )}
                />
                <p className="text-sm text-text-secondary mb-1">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-text-muted">PNG, JPG, WebP up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </div>

              {/* Video upload */}
              {maxVideos > 0 && (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="mt-3 w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 text-sm text-text-muted hover:text-text-secondary transition-all"
                >
                  <Video className="w-4 h-4" />
                  Upload Video
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                </button>
              )}

              {maxVideos === 0 && (
                <p className="mt-3 text-xs text-text-muted text-center">
                  🎬 Upgrade to Pro for video uploads
                </p>
              )}

              {mediaError && (
                <p className="mt-2 text-xs text-red-400 text-center">{mediaError}</p>
              )}

              {/* Uploaded media grid */}
              {mediaItems.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'relative aspect-square rounded-xl overflow-hidden border-2 group',
                        item.isPrimary ? 'border-green-400/50' : 'border-white/6'
                      )}
                    >
                      {item.type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.preview}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                          <Video className="w-8 h-8 text-text-muted" />
                        </div>
                      )}

                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {item.type === 'image' && !item.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimary(item.id)}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-gold-400/30 transition-colors"
                            title="Set as primary"
                          >
                            <Star className="w-4 h-4 text-gold-400" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(item.id)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-red-400/30 transition-colors"
                          title="Remove"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      {/* Primary badge */}
                      {item.isPrimary && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-green-400/90 text-[10px] font-bold text-navy-950">
                          PRIMARY
                        </div>
                      )}

                      {/* Progress bar */}
                      {item.progress < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-900">
                          <div
                            className="h-full bg-green-400 transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-text-secondary text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting
              ? 'Publishing...'
              : isEditing
                ? 'Update Product'
                : 'Publish Product'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative glass-card p-8 rounded-2xl max-w-md w-full border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-400/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
              Product Published! 🎉
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Your product is now live and ready for customers.
            </p>

            {/* Product Link */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900/60 border border-white/8 mb-6">
              <LinkIcon className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-xs text-text-secondary truncate flex-1 text-left">
                farmcentermarket.com/products/{productName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'product'}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-text-muted" />
                )}
              </button>
            </div>

            {/* Share buttons */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 text-green-400 text-sm font-medium hover:bg-green-600/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Twitter
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
