import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, ORDERS_COLLECTION, ORDER_ITEMS_COLLECTION } from '@/lib/appwrite/config';
import { ID } from 'node-appwrite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyerId, buyerEmail, items, paymentMethod, paymentReference, shippingInfo, totalAmount } = body;
    
    const { databases } = createAdminClient();

    // Group items by shopId
    const itemsByShop = items.reduce((acc: any, item: any) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = [];
      }
      acc[item.shopId].push(item);
      return acc;
    }, {});

    const createdOrders = [];

    for (const shopId of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopId];
      const shopTotal = shopItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      const orderNumber = `FC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create Order
      const order = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        ID.unique(),
        {
          buyerId: buyerId || 'guest',
          shopId: shopId,
          orderNumber: orderNumber,
          totalAmount: shopTotal, // In a real app we'd add shop-specific delivery fee if needed
          commissionAmount: shopTotal * 0.05, // e.g. 5% commission
          status: paymentMethod === 'paystack' ? 'paid' : 'pending',
          paymentMethod: paymentMethod,
          paymentReference: paymentReference || '',
          buyerName: shippingInfo.fullName,
          buyerPhone: shippingInfo.phone,
          buyerEmail: buyerEmail || '',
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          createdAt: new Date().toISOString()
        }
      );

      // Create Order Items
      for (const item of shopItems) {
        await databases.createDocument(
          DATABASE_ID,
          ORDER_ITEMS_COLLECTION,
          ID.unique(),
          {
            orderId: order.$id,
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity
          }
        );
      }
      
      createdOrders.push(order);
    }

    return NextResponse.json({ 
      success: true, 
      orderIds: createdOrders.map(o => o.$id),
      orderNumber: createdOrders[0]?.orderNumber || '', // Send back one order number for tracking
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const buyerId = url.searchParams.get('buyerId');
    if (!buyerId) {
      return NextResponse.json({ success: false, message: 'buyerId required' }, { status: 400 });
    }

    const { databases } = createAdminClient();
    const { Query } = await import('node-appwrite');

    const ordersData = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION,
      [
        Query.equal('buyerId', buyerId),
        Query.orderDesc('createdAt')
      ]
    );

    return NextResponse.json({ success: true, orders: ordersData.documents });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}
