import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import { Package } from 'lucide-react';

async function getOrders() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {orders.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order: { id: string; order_number: string; created_at: string; customer_name: string; customer_phone: string; items?: { length: number }[]; payment_status: string; payment_method: string; status: string; total: number }) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize w-fit ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                        <span className="text-[0.6rem] text-gray-400 uppercase">{order.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-forest text-xs font-medium hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      )}
    </div>
  );
}
