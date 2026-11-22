import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !db_order_id) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature server-side
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature mismatch');
      // Mark order as failed
      const supabase = createServiceRoleClient();
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', db_order_id);

      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }

    // Signature verified — update order status
    const supabase = createServiceRoleClient();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('id', db_order_id)
      .eq('razorpay_order_id', razorpay_order_id) // Double-check order match
      .select()
      .single();

    if (error || !order) {
      console.error('Order update error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
    }

    // Deduct stock
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

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        order_number: order.order_number,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
