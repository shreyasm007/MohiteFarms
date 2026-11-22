'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminShippingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  const [config, setConfig] = useState({
    name: 'Standard Shipping',
    description: '',
    base_charge: 60,
    free_shipping_threshold: 999,
    per_kg_charge: 15,
    cod_extra_charge: 40,
    is_cod_available: true,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('shipping_config')
      .select('*')
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        if (data) {
          setConfigId(data.id);
          setConfig({
            name: data.name,
            description: data.description || '',
            base_charge: data.base_charge,
            free_shipping_threshold: data.free_shipping_threshold || 0,
            per_kg_charge: data.per_kg_charge,
            cod_extra_charge: data.cod_extra_charge,
            is_cod_available: data.is_cod_available,
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: configId, ...config }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Shipping config saved');
        if (data.data?.id) setConfigId(data.data.id);
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Configuration</h1>
        <div className="skeleton w-full h-96" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Configuration</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Shipping & COD Settings</h2>
        </div>

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Base Shipping Charge (₹)</label>
              <input
                type="number"
                value={config.base_charge}
                onChange={(e) => setConfig({ ...config, base_charge: Number(e.target.value) })}
                className="input-field"
                step="0.01"
              />
              <p className="text-[0.65rem] text-gray-400 mt-1">Fixed charge applied to every order</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Per Kg Charge (₹)</label>
              <input
                type="number"
                value={config.per_kg_charge}
                onChange={(e) => setConfig({ ...config, per_kg_charge: Number(e.target.value) })}
                className="input-field"
                step="0.01"
              />
              <p className="text-[0.65rem] text-gray-400 mt-1">Additional charge per kg of order weight</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={config.free_shipping_threshold}
              onChange={(e) => setConfig({ ...config, free_shipping_threshold: Number(e.target.value) })}
              className="input-field"
              step="0.01"
            />
            <p className="text-[0.65rem] text-gray-400 mt-1">Orders above this amount get free shipping. Set to 0 to disable.</p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={config.is_cod_available}
                onChange={(e) => setConfig({ ...config, is_cod_available: e.target.checked })}
                className="w-4 h-4 text-forest rounded"
              />
              <span className="text-sm font-medium text-gray-700">Enable Cash on Delivery</span>
            </label>

            {config.is_cod_available && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">COD Extra Charge (₹)</label>
                <input
                  type="number"
                  value={config.cod_extra_charge}
                  onChange={(e) => setConfig({ ...config, cod_extra_charge: Number(e.target.value) })}
                  className="input-field max-w-xs"
                  step="0.01"
                />
                <p className="text-[0.65rem] text-gray-400 mt-1">Additional charge for COD orders</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
