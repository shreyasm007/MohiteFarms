import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';

async function verifyAdmin(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// CREATE product
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { variants, ...productData } = body;

    const supabase = createServiceRoleClient();

    // Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug: productData.slug,
        category_id: productData.category_id || null,
        description: productData.description,
        short_description: productData.short_description,
        images: productData.images || [],
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        sort_order: productData.sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Create variants
    if (variants?.length) {
      const variantData = variants.map((v: Record<string, unknown>) => ({
        product_id: product.id,
        sku: v.sku || null,
        pack_size: v.pack_size,
        pack_size_grams: v.pack_size_grams,
        price: v.price,
        compare_at_price: v.compare_at_price || null,
        stock: v.stock || 0,
        is_active: v.is_active ?? true,
      }));

      await supabase.from('product_variants').insert(variantData);
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
