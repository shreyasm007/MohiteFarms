'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      toast.success('Product deleted');
      router.refresh();
    } else {
      toast.error(data.error || 'Failed to delete product');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
