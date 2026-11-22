import { HomeContent } from '@/components/home/HomeContent';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Featured products are fetched server-side but HomeContent handles display
  // The client component HomeContent uses translations from context
  return <HomeContent />;
}
