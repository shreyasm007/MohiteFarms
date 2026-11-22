'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Loader2, ArrowLeft, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Product, ProductVariant, Category } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isNew?: boolean;
}

interface VariantForm {
  id?: string;
  sku: string;
  pack_size: string;
  pack_size_grams: number;
  price: number;
  compare_at_price: number;
  stock: number;
  is_active: boolean;
}

export function ProductForm({ product, categories, isNew = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order: product?.sort_order ?? 0,
    images: product?.images || ([] as string[]),
  });

  const [variants, setVariants] = useState<VariantForm[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      sku: v.sku || '',
      pack_size: v.pack_size,
      pack_size_grams: v.pack_size_grams,
      price: v.price,
      compare_at_price: v.compare_at_price || 0,
      stock: v.stock,
      is_active: v.is_active,
    })) || []
  );

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: isNew ? generateSlug(name) : f.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const supabase = createClient();

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
      toast.success('Images uploaded');
    } catch (err) {
      toast.error('Failed to upload images');
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { sku: '', pack_size: '', pack_size_grams: 0, price: 0, compare_at_price: 0, stock: 0, is_active: true },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string | number | boolean) => {
    const updated = [...variants];
    (updated[index] as unknown as Record<string, unknown>)[field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error('Name and slug are required');
      return;
    }
    if (variants.length === 0) {
      toast.error('Add at least one pack size variant');
      return;
    }

    setLoading(true);
    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, variants }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isNew ? 'Product created!' : 'Product updated!');
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Add Product' : 'Edit Product'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Create Product' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="input-field"
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="input-field"
                  placeholder="One-line description"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[120px] resize-y"
                  placeholder="Detailed product description"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <Image src={img} alt="" fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-forest/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-[0.65rem] text-gray-400">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-[0.65rem] text-gray-400">
              Upload images to Supabase Storage. First image is the main product image.
            </p>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Pack Sizes & Pricing</h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 text-sm text-forest font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                No variants yet. Add a pack size to set pricing and stock.
              </p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500">Variant {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">SKU</label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                          className="input-field text-sm py-2"
                          placeholder="KWG-1KG"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">Pack Size *</label>
                        <input
                          type="text"
                          value={variant.pack_size}
                          onChange={(e) => updateVariant(i, 'pack_size', e.target.value)}
                          className="input-field text-sm py-2"
                          placeholder="1 kg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">Weight (grams) *</label>
                        <input
                          type="number"
                          value={variant.pack_size_grams || ''}
                          onChange={(e) => updateVariant(i, 'pack_size_grams', Number(e.target.value))}
                          className="input-field text-sm py-2"
                          placeholder="1000"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">Price (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price || ''}
                          onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                          className="input-field text-sm py-2"
                          placeholder="120"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">Compare Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.compare_at_price || ''}
                          onChange={(e) => updateVariant(i, 'compare_at_price', Number(e.target.value))}
                          className="input-field text-sm py-2"
                          placeholder="150"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 mb-0.5">Stock *</label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                          className="input-field text-sm py-2"
                          placeholder="50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 text-forest rounded"
              />
              <span className="text-sm text-gray-700">Active (visible in store)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 text-forest rounded"
              />
              <span className="text-sm text-gray-700">Featured on homepage</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Sort Order</h2>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="input-field"
              placeholder="0"
            />
            <p className="text-[0.65rem] text-gray-400 mt-1">Lower numbers appear first</p>
          </div>
        </div>
      </div>
    </form>
  );
}
