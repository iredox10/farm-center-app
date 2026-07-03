import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock';
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify signature
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    
    if (hash !== signature) {
      // Return 400 or 200 depending on Paystack rules (usually 200 so it doesn't keep retrying incorrectly)
      console.error('Invalid Paystack signature');
      return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amount = data.amount / 100; // Convert kobo to Naira
      
      console.log(`[Webhook] Payment successful: ${reference} for ${amount} NGN`);
      
      // Here we would interact with Appwrite using the Server SDK:
      // const serverClient = createAdminClient();
      // const databases = new Databases(serverClient);
      
      // 1. Find the pending order(s) by payment_reference
      // 2. Update order status to 'paid'
      // 3. Create a payment_log entry
      // 4. Update shop subscription status if it was a product upload fee
      
      // Mock successful handling
    }

    // Acknowledge receipt
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
