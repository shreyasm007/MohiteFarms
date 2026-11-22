export const dynamic = 'force-dynamic';

import { createServiceRoleClient } from '@/lib/supabase/server';
import { Package, ShoppingCart, IndianRupee, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

async function getDashboardStats() {
  try {
    const supabase = createServiceRoleClient();

    const [productsRes, ordersRes, revenueRes, lowStockRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('payment_status', 'paid'),
      supabase.from('product_variants').select('id', { count: 'exact', head: true }).lt('stock', 5).eq('is_active', true),
    ]);

    const totalRevenue = revenueRes.data?.reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0) || 0;

    return {
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalRevenue,
      lowStockItems: lowStockRes.count || 0,
    };
  } catch {
    return { totalProducts: 0, totalOrders: 0, totalRevenue: 0, lowStockItems: 0 };
  }
}

async function getRecentOrders() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders();

  const statCards = [
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-50 text-green-600' },
    { label: 'Revenue (Paid)', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: { id: string; order_number: string; customer_name: string; status: string; payment_status: string; total: number }) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer_name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No orders yet. They&apos;ll appear here once customers start ordering.</p>
          </div>
        )}
      </div>
    </div>
  );
}
