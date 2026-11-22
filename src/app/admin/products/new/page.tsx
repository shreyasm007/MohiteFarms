import { createServiceRoleClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';

async function getCategories() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  return data || [];
}

export default async function NewProductPage() {
  const categories = await getCategories();
  return <ProductForm categories={categories} isNew />;
}
