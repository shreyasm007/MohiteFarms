import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { Plus, Edit, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

async function getProducts() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name), variants:product_variants(*)')
      .order('sort_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Variants</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product: { id: string; name: string; slug: string; is_active: boolean; category?: { name: string } | null; variants?: { stock: number; price: number }[] }) => {
                  const totalStock = product.variants?.reduce((sum: number, v: { stock: number }) => sum + v.stock, 0) || 0;
                  const priceRange = product.variants?.length
                    ? `${formatPrice(Math.min(...product.variants.map((v: { price: number }) => v.price)))} – ${formatPrice(Math.max(...product.variants.map((v: { price: number }) => v.price)))}`
                    : 'No variants';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{priceRange}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.category?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{product.variants?.length || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${totalStock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-gray-400 hover:text-forest hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No products yet. Add your first product to get started.</p>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
