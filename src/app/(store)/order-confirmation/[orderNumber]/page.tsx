import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Phone } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/lib/types';

export const metadata: Metadata = { title: 'Order Confirmed' };

interface Props {
  params: Promise<{ orderNumber: string }>;
}

async function getOrder(orderNumber: string): Promise<Order | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', orderNumber)
      .eq('user_id', user.id)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  if (!order) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-forest-dark mb-3">Order Not Found</h1>
        <p className="text-earth-light mb-6">We couldn&apos;t find this order.</p>
        <Link href="/" className="btn-primary px-8">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container-custom py-10 md:py-16">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-forest-dark mb-2 animate-slide-up">
            Order Confirmed!
          </h1>
          <p className="text-earth-light animate-slide-up stagger-1">
            Thank you for your order. We&apos;ll start preparing it right away.
          </p>
          <p className="mt-3 text-sm animate-slide-up stagger-2">
            Order number: <span className="font-bold text-forest">{order.order_number}</span>
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-sand/50 overflow-hidden animate-slide-up stagger-3">
          {/* Order Details */}
          <div className="p-5 md:p-6 border-b border-sand/50">
            <h2 className="font-heading font-semibold text-forest-dark text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-dark" />
              Order Details
            </h2>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-forest-dark">{item.product_name}</span>
                    <span className="text-earth-light ml-2">
                      {item.variant_name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold">{formatPrice(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-sand mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-light">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-light">Shipping</span>
                <span>{order.shipping_charge === 0 ? 'FREE' : formatPrice(order.shipping_charge)}</span>
              </div>
              {order.cod_charge > 0 && (
                <div className="flex justify-between">
                  <span className="text-earth-light">COD Charge</span>
                  <span>{formatPrice(order.cod_charge)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-sand pt-2">
                <span>Total</span>
                <span className="text-forest">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-5 md:p-6 bg-cream/50">
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-forest-dark mb-1">Delivery Address</p>
                <p className="text-earth-light">
                  {order.customer_name}<br />
                  {order.address_line1}<br />
                  {order.address_line2 && <>{order.address_line2}<br /></>}
                  {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
              <div>
                <p className="font-semibold text-forest-dark mb-1">Payment</p>
                <p className="text-earth-light capitalize">
                  Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                <p className="text-earth-light capitalize">
                  Status: <span className={order.payment_status === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                    {order.payment_status}
                  </span>
                </p>
                <p className="text-earth-light mt-1">Date: {formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders" className="btn-primary px-8">
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="btn-secondary px-8">
            Continue Shopping
          </Link>
        </div>

        <div className="max-w-2xl mx-auto mt-6 text-center">
          <p className="text-xs text-earth-light">
            Questions about your order?{' '}
            <a href="https://wa.me/919XXXXXXXXX" className="text-forest font-semibold hover:underline inline-flex items-center gap-1">
              <Phone className="w-3 h-3" /> WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
