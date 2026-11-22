import { notFound } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

async function getCategories() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  return data || [];
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) notFound();

  return <ProductForm product={product} categories={categories} />;
}
