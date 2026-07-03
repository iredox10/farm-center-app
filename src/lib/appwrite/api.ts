import { databases } from './client';
import { DATABASE_ID, SHOPS_COLLECTION, PRODUCTS_COLLECTION } from './config';
import { Query } from 'appwrite';
import { Shop, Product } from '@/types';

export const api = {
  getShopBySlug: async (slug: string): Promise<Shop | null> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SHOPS_COLLECTION,
        [Query.equal('slug', slug)]
      );
      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as Shop;
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      return null;
    }
  },

  getShopProducts: async (shopId: string): Promise<Product[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        [Query.equal('shopId', shopId)]
      );
      return response.documents as unknown as Product[];
    } catch (error) {
      console.error('Failed to fetch shop products:', error);
      return [];
    }
  }
};
