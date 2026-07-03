'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/dashboard/ProductForm';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/appwrite/api';
import { PRODUCT_MEDIA_BUCKET, PRODUCT_MEDIA_COLLECTION, DATABASE_ID } from '@/lib/appwrite/config';
import { databases } from '@/lib/appwrite/client';
import { ID } from 'appwrite';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/products"
          className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Add New Product</h2>
          <p className="font-body text-sm text-on-surface-variant mt-0.5">
            Fill in the details to list your product
          </p>
        </div>
      </div>

      <ProductForm
        onSubmit={async (data, media) => {
          if (!user) {
            toast.error('You must be logged in');
            return;
          }

          try {
            const shop = await api.getShopByOwnerId(user.$id);
            if (!shop) {
              toast.error('Shop not found');
              return;
            }

            // 1. Create Product
            const product = await api.createProduct({
              shopId: (shop as any).$id || shop.id,
              name: data.name,
              slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: data.description,
              price: data.price,
              discountPrice: data.discountPrice || 0,
              currency: 'NGN',
              stockQuantity: data.stockQuantity,
              condition: data.condition,
              categoryIds: data.categoryIds,
              isActive: true,
              viewCount: 0,
            });

            // 2. Upload Media
            if (media && media.length > 0) {
              let sortOrder = 0;
              for (const m of media) {
                const fileId = await api.uploadFile(PRODUCT_MEDIA_BUCKET, m.file);
                
                await databases.createDocument(DATABASE_ID, PRODUCT_MEDIA_COLLECTION, ID.unique(), {
                  productId: (product as any).$id,
                  fileId: fileId,
                  type: m.type,
                  sortOrder: sortOrder++,
                  isPrimary: m.isPrimary
                });
              }
            }

            toast.success('Product created successfully');
            router.push('/dashboard/products');
          } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
            throw error; // Rethrow so ProductForm knows it failed
          }
        }}
      />
    </div>
  );
}
