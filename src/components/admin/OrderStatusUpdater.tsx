'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  trackingNumber: string;
}

export function OrderStatusUpdater({ orderId, currentStatus, currentPaymentStatus, trackingNumber: initialTracking }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking_number: tracking }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order updated');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Update Order</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking Number</label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="input-field"
            placeholder="Courier tracking number"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-forest text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
