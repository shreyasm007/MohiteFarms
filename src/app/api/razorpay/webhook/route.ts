import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Disable body parsing — we need raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabase = createServiceRoleClient();

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Update order to paid + confirmed
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            razorpay_payment_id: payment.id,
          })
          .eq('razorpay_order_id', orderId)
          .eq('payment_status', 'pending'); // Only update if still pending

        // Deduct stock
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', orderId)
          .single();

        if (order) {
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('variant_id, quantity')
            .eq('order_id', order.id);

          if (orderItems) {
            for (const item of orderItems) {
              const { data: variant } = await supabase
                .from('product_variants')
                .select('stock')
                .eq('id', item.variant_id)
                .single();

              if (variant) {
                await supabase
                  .from('product_variants')
                  .update({ stock: Math.max(0, variant.stock - item.quantity) })
                  .eq('id', item.variant_id);
              }
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('razorpay_order_id', payment.order_id);
        break;
      }

      case 'refund.created': {
        const refund = event.payload.refund.entity;
        await supabase
          .from('orders')
          .update({ payment_status: 'refunded' })
          .eq('razorpay_payment_id', refund.payment_id);
        break;
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
