import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, ORDERS_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export async function GET() {
  try {
    const { databases } = createAdminClient();

    const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION, [
      Query.limit(100),
      Query.orderDesc('$createdAt')
    ]);

    // Fetch shop names to enrich order data
    const enrichedOrders = await Promise.all(
      ordersRes.documents.map(async (order) => {
        let shopName = 'Unknown Shop';
        try {
          const shop = await databases.getDocument(DATABASE_ID, SHOPS_COLLECTION, order.shopId);
          shopName = shop.name;
        } catch {
          // Keep default
        }

        return {
          id: order.$id, // In a real app we'd use order.orderNumber or $id
          orderNumber: order.orderNumber || order.$id,
          customer: order.buyerName || 'Unknown Customer',
          shopName,
          date: new Date(order.$createdAt).toISOString().split('T')[0],
          totalAmount: order.totalAmount || 0,
          paymentMethod: order.paymentMethod || 'unknown',
          status: order.status || 'pending',
        };
      })
    );

    return NextResponse.json({ success: true, orders: enrichedOrders });
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
