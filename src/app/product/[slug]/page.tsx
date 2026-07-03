import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/product/ProductPageClient';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, PRODUCTS_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 60; // Cache for 60s

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const { databases } = createAdminClient();

    // Fetch product by slug
    const productRes = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('slug', params.slug), Query.limit(1)]
    );

    if (productRes.documents.length === 0) {
      return notFound();
    }

    const doc = productRes.documents[0];
    const product = {
      id: doc.$id,
      shopId: doc.shopId,
      name: doc.name,
      slug: doc.slug,
      description: doc.description || '',
      price: doc.price || 0,
      discountPrice: doc.discountPrice || 0,
      currency: doc.currency || 'NGN',
      stockQuantity: doc.stockQuantity || 0,
      condition: doc.condition || 'new',
      isActive: doc.isActive,
      viewCount: doc.viewCount || 0,
      categoryIds: doc.categoryIds || [],
      certificationStatus: doc.certificationStatus || 'none',
      batteryHealth: doc.batteryHealth,
      testingWarrantyDays: doc.testingWarrantyDays,
    };

    // Fetch shop details
    const shopRes = await databases.listDocuments(
      DATABASE_ID,
      SHOPS_COLLECTION,
      [Query.equal('$id', product.shopId), Query.limit(1)]
    );
    
    let shop = null;
    if (shopRes.documents.length > 0) {
      const sDoc = shopRes.documents[0];
      shop = {
        id: sDoc.$id,
        name: sDoc.name,
        slug: sDoc.slug,
        description: sDoc.description,
        location: sDoc.location,
        isVerified: sDoc.isVerified,
        ratingAverage: sDoc.ratingAverage,
        reviewCount: sDoc.reviewCount,
        phone: sDoc.phone,
        whatsapp: sDoc.whatsapp,
        allowPayOnDelivery: sDoc.allowPayOnDelivery,
        physicalAuditDate: sDoc.physicalAuditDate,
      };
      
      (product as any).shopName = shop.name; // Add shopName to product
    }

    // Fetch related products from same shop (excluding current)
    const relatedRes = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [
        Query.equal('shopId', product.shopId),
        Query.notEqual('$id', product.id),
        Query.equal('isActive', true),
        Query.limit(4)
      ]
    );

    const relatedProducts = relatedRes.documents.map((p) => ({
      id: p.$id,
      shopId: p.shopId,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discountPrice: p.discountPrice,
      stockQuantity: p.stockQuantity,
      condition: p.condition || 'new',
      shopName: shop ? shop.name : 'Unknown Shop',
    }));

    return (
      <ProductPageClient
        product={product}
        shop={shop}
        relatedProducts={relatedProducts}
      />
    );
  } catch (error) {
    console.error('Failed to fetch product:', error);
    // If DB fails, fallback to passing undefined (which uses mock data in client)
    return <ProductPageClient />;
  }
}
