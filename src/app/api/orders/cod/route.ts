import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { items, address } = body;

    if (!items?.length || !address) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Fetch and validate variants
    const variantIds = items.map((i: { variant_id: string }) => i.variant_id);
    const { data: variants, error: variantError } = await supabase
      .from('product_variants')
      .select('*, product:products(*)')
      .in('id', variantIds);

    if (variantError || !variants?.length) {
      return NextResponse.json({ success: false, error: 'Products not found' }, { status: 400 });
    }

    let subtotal = 0;
    let totalWeightGrams = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = variants.find((v: { id: string }) => v.id === item.variant_id);
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for ${variant?.product?.name || 'product'}`,
        }, { status: 400 });
      }
      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;
      totalWeightGrams += variant.pack_size_grams * item.quantity;
      orderItems.push({
        product_id: variant.product_id,
        variant_id: variant.id,
        product_name: variant.product.name,
        variant_name: variant.pack_size,
        quantity: item.quantity,
        unit_price: variant.price,
        total_price: lineTotal,
      });
    }

    // Shipping
    const { data: shippingConf } = await supabase
      .from('shipping_config')
      .select('*')
      .eq('is_active', true)
      .single();

    let shippingCharge = 60;
    let codCharge = 0;

    if (shippingConf) {
      if (shippingConf.free_shipping_threshold && subtotal >= shippingConf.free_shipping_threshold) {
        shippingCharge = 0;
      } else {
        const weightKg = Math.ceil(totalWeightGrams / 1000);
        shippingCharge = shippingConf.base_charge + weightKg * shippingConf.per_kg_charge;
      }
      codCharge = shippingConf.cod_extra_charge || 0;
    }

    const total = subtotal + shippingCharge + codCharge;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: address.name,
        customer_email: address.email || user.email || '',
        customer_phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        subtotal,
        shipping_charge: shippingCharge,
        cod_charge: codCharge,
        total,
        payment_method: 'cod',
        payment_status: 'pending',
        status: 'confirmed',
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }

    // Insert items
    await supabase.from('order_items').insert(
      orderItems.map((item) => ({ ...item, order_id: order.id }))
    );

    // Deduct stock
    for (const item of orderItems) {
      const variant = variants.find((v: { id: string }) => v.id === item.variant_id);
      if (variant) {
        await supabase
          .from('product_variants')
          .update({ stock: Math.max(0, variant.stock - item.quantity) })
          .eq('id', item.variant_id);
      }
    }

    return NextResponse.json({
      success: true,
      data: { order_id: order.id, order_number: order.order_number },
    });
  } catch (error) {
    console.error('COD order error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
