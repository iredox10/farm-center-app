'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/dashboard/ProductForm';
import { api } from '@/lib/appwrite/api';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, PRODUCT_MEDIA_COLLECTION, PRODUCT_MEDIA_BUCKET } from '@/lib/appwrite/config';
import { Query, ID } from 'appwrite';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prod = await api.getProduct(id);
        if (!prod) {
          setIsLoading(false);
          return;
        }
        setProduct(prod);

        // Fetch media
        const mediaDocs = await databases.listDocuments(DATABASE_ID, PRODUCT_MEDIA_COLLECTION, [
          Query.equal('productId', id)
        ]);
        
        const urls = mediaDocs.documents.map(doc => api.getFileUrl(PRODUCT_MEDIA_BUCKET, doc.fileId));
        setMediaUrls(urls);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-on-surface-variant">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="bg-white border border-outline-variant/50 rounded-2xl shadow-[0_4px_12px_rgba(4,22,39,0.02)] p-12 text-center">
        <h3 className="font-heading text-xl font-bold text-on-surface mb-2">
          Product Not Found
        </h3>
        <p className="font-body text-sm text-on-surface-variant mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-label font-bold hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

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
          <h2 className="font-heading text-2xl font-bold text-on-surface">Edit Product</h2>
          <p className="font-body text-sm text-on-surface-variant mt-0.5">
            Update "{product.name}"
          </p>
        </div>
      </div>

      <ProductForm
        initialData={{ ...product, mediaUrls }}
        isEditing
        onSubmit={async (data, media) => {
          try {
            await api.updateProduct(id, {
              name: data.name,
              slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: data.description,
              price: data.price,
              discountPrice: data.discountPrice || 0,
              stockQuantity: data.stockQuantity,
              condition: data.condition,
              categoryIds: data.categoryIds,
            });

            // Note: In a real app we'd need to delete old media documents and their files
            // and upload new ones if they changed. For now we append new ones.
            if (media && media.length > 0) {
              const newMedia = media.filter(m => m.file); // Assuming only new media has a file
              let sortOrder = mediaUrls.length;
              for (const m of newMedia) {
                const fileId = await api.uploadFile(PRODUCT_MEDIA_BUCKET, m.file);
                await databases.createDocument(DATABASE_ID, PRODUCT_MEDIA_COLLECTION, ID.unique(), {
                  productId: id,
                  fileId: fileId,
                  type: m.type,
                  sortOrder: sortOrder++,
                  isPrimary: m.isPrimary
                });
              }
            }

            toast.success('Product updated');
            router.push('/dashboard/products');
          } catch (error) {
            toast.error('Failed to update product');
            throw error;
          }
        }}
      />
    </div>
  );
}
