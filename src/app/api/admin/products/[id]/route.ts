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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// UPDATE product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { variants, ...productData } = body;
    const supabase = createServiceRoleClient();

    // Update product
    const { error } = await supabase
      .from('products')
      .update({
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
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Handle variants: upsert existing, create new, delete removed
    if (variants) {
      const existingIds = variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id);

      // Delete removed variants
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id)
        .not('id', 'in', `(${existingIds.join(',')})`);

      // Upsert variants
      for (const v of variants) {
        if (v.id) {
          await supabase
            .from('product_variants')
            .update({
              sku: v.sku || null,
              pack_size: v.pack_size,
              pack_size_grams: v.pack_size_grams,
              price: v.price,
              compare_at_price: v.compare_at_price || null,
              stock: v.stock || 0,
              is_active: v.is_active ?? true,
            })
            .eq('id', v.id);
        } else {
          await supabase
            .from('product_variants')
            .insert({
              product_id: id,
              sku: v.sku || null,
              pack_size: v.pack_size,
              pack_size_grams: v.pack_size_grams,
              price: v.price,
              compare_at_price: v.compare_at_price || null,
              stock: v.stock || 0,
              is_active: v.is_active ?? true,
            });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const supabase = createServiceRoleClient();

    // Delete variants first (cascade should handle this, but be explicit)
    await supabase.from('product_variants').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
