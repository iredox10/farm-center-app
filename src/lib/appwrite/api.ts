import { databases, storage, account } from './client';
import { DATABASE_ID, SHOPS_COLLECTION, PRODUCTS_COLLECTION, PRODUCT_MEDIA_COLLECTION, PRODUCT_MEDIA_BUCKET, ORDERS_COLLECTION, SHOP_ASSETS_BUCKET } from './config';
import { Query, ID } from 'appwrite';
import { Shop, Product, ProductMedia, Order } from '@/types';

export const api = {
  getShopBySlug: async (slug: string): Promise<Shop | null> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, SHOPS_COLLECTION, [Query.equal('slug', slug)]);
      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as Shop;
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      return null;
    }
  },

  getShopByOwnerId: async (ownerId: string): Promise<Shop | null> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, SHOPS_COLLECTION, [Query.equal('ownerId', ownerId)]);
      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as Shop;
    } catch (error) {
      console.error('Failed to fetch shop by owner:', error);
      return null;
    }
  },

  getShopProducts: async (shopId: string): Promise<Product[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [Query.equal('shopId', shopId), Query.orderDesc('$createdAt')]);
      return response.documents as unknown as Product[];
    } catch (error) {
      console.error('Failed to fetch shop products:', error);
      return [];
    }
  },

  getProduct: async (productId: string): Promise<Product | null> => {
    try {
      const doc = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION, productId);
      return doc as unknown as Product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await databases.createDocument(DATABASE_ID, PRODUCTS_COLLECTION, ID.unique(), data);
    return response as unknown as Product;
  },

  updateProduct: async (productId: string, data: Partial<Product>): Promise<Product> => {
    const response = await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, productId, data);
    return response as unknown as Product;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, productId);
  },

  uploadFile: async (bucketId: string, file: File): Promise<string> => {
    const response = await storage.createFile(bucketId, ID.unique(), file);
    return response.$id;
  },
  
  deleteFile: async (bucketId: string, fileId: string): Promise<void> => {
    await storage.deleteFile(bucketId, fileId);
  },

  getFileUrl: (bucketId: string, fileId: string): string => {
    return storage.getFileView(bucketId, fileId).toString();
  },

  getShopOrders: async (shopId: string): Promise<Order[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION, [Query.equal('shopId', shopId), Query.orderDesc('$createdAt')]);
      return response.documents as unknown as Order[];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION, orderId, { status });
  },

  updateShop: async (shopId: string, data: Partial<Shop>): Promise<Shop> => {
    const response = await databases.updateDocument(DATABASE_ID, SHOPS_COLLECTION, shopId, data);
    return response as unknown as Shop;
  }
};
