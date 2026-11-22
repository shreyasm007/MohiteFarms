import { Metadata } from 'next';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Order } from '@/lib/types';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'My Orders' };

async function getOrders(): Promise<Order[]> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/orders');

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-8 md:py-10">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">My Orders</h1>
          <p className="text-cream/60 text-sm mt-1">{orders.length} orders</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom max-w-3xl">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-earth-light" />
              </div>
              <h2 className="text-xl font-heading font-bold text-forest-dark mb-3">
                No orders yet
              </h2>
              <p className="text-earth-light mb-6">Start shopping to see your orders here.</p>
              <Link href="/products" className="btn-primary px-8">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order-confirmation/${order.order_number}`}
                  className="block bg-white rounded-xl border border-sand/50 p-5 hover:border-gold/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gold-dark" />
                        <span className="font-semibold text-forest-dark text-sm">
                          {order.order_number}
                        </span>
                      </div>
                      <p className="text-xs text-earth-light mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge text-[0.65rem] ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`badge text-[0.65rem] ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-earth-light space-y-0.5">
                    {order.items?.slice(0, 3).map((item) => (
                      <p key={item.id}>
                        {item.product_name} ({item.variant_name}) × {item.quantity}
                      </p>
                    ))}
                    {(order.items?.length || 0) > 3 && (
                      <p className="text-earth">+{(order.items?.length || 0) - 3} more items</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand/50">
                    <span className="text-sm font-bold text-forest">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-xs text-forest font-medium flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
