export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';

interface Props {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.order_number}</h1>
          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" /> Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: { id: string; product_name: string; variant_name: string; quantity: number; unit_price: number; total_price: number }) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{item.variant_name} × {item.quantity} @ {formatPrice(item.unit_price)}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.total_price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shipping_charge === 0 ? 'FREE' : formatPrice(order.shipping_charge)}</span></div>
              {order.cod_charge > 0 && <div className="flex justify-between"><span className="text-gray-500">COD Charge</span><span>{formatPrice(order.cod_charge)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" /> Delivery Address
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              {order.customer_email && <p>{order.customer_email}</p>}
              <p className="mt-2">
                {order.address_line1}<br />
                {order.address_line2 && <>{order.address_line2}<br /></>}
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.payment_status}
            trackingNumber={order.tracking_number || ''}
          />

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" /> Payment
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status}
                </span>
              </div>
              {order.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Razorpay ID</span>
                  <span className="text-xs font-mono text-gray-600">{order.razorpay_payment_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
