import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/components/products/ProductDetail';
import type { Product } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.short_description || product.description || `Buy ${product.name} from Mohite Farms`,
    openGraph: {
      title: `${product.name} | Mohite Farms`,
      description: product.short_description || '',
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-enter">
      <ProductDetail product={product} />
    </div>
  );
}
