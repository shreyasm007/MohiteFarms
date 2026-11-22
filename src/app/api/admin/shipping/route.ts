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

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const supabase = createServiceRoleClient();

    const configData = {
      name: body.name || 'Standard Shipping',
      description: body.description || '',
      base_charge: body.base_charge,
      free_shipping_threshold: body.free_shipping_threshold || null,
      per_kg_charge: body.per_kg_charge,
      cod_extra_charge: body.cod_extra_charge,
      is_cod_available: body.is_cod_available,
      is_active: true,
    };

    if (body.id) {
      const { error } = await supabase
        .from('shipping_config')
        .update(configData)
        .eq('id', body.id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      return NextResponse.json({ success: true });
    } else {
      const { data, error } = await supabase
        .from('shipping_config')
        .insert(configData)
        .select()
        .single();
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('Shipping config error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
