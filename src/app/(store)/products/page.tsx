import { Metadata } from 'next';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductsFilter } from '@/components/products/ProductsFilter';
import type { Product, Category } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Shop naturally grown Khapli wheat grain, Khapli wheat atta, Shalu jowar grain, and Shalu jowar flour from Mohite Farms.',
};

async function getProducts(): Promise<Product[]> {
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
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">
            Our Products
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            Farm-Fresh Grains & Flour
          </h1>
          <p className="text-cream/70 max-w-lg">
            Naturally grown on our farm in Tondoli, Kadegaon. Each product is harvested, 
            processed, and packed with care.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 md:py-16">
        <div className="container-custom">
          <ProductsFilter categories={categories} products={products} />
        </div>
      </section>
    </div>
  );
}
