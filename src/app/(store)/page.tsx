import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck, Wheat, ShieldCheck, Leaf } from 'lucide-react';
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
  const products = await getFeaturedProducts();

  return (
    <div className="page-enter">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-banner.png"
            alt="Golden wheat fields at Mohite Farms"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/80 via-forest-dark/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <Leaf className="w-3.5 h-3.5 text-gold-light" />
              <span className="text-gold-light text-xs font-medium tracking-wide">
                Naturally Grown in Maharashtra
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-5 animate-slide-up">
              From Our Farm,
              <br />
              <span className="text-gold-light">To Your Table</span>
            </h1>

            <p className="text-cream/80 text-base sm:text-lg leading-relaxed mb-8 max-w-md animate-slide-up stagger-1">
              Pure Khapli wheat and Shalu jowar, grown with care on our family farm
              in Tondoli, Kadegaon. No chemicals, no shortcuts — just honest grain.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up stagger-2">
              <Link href="/products" className="btn-gold text-base px-8 py-3.5">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8 py-3.5">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="bg-forest text-white py-5 border-b border-forest-light/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Wheat, text: 'Naturally Grown', sub: 'No chemical pesticides' },
              { icon: Truck, text: 'Pan-India Delivery', sub: 'Shipped fresh to you' },
              { icon: ShieldCheck, text: 'Quality Assured', sub: 'Handpicked grains' },
              { icon: Leaf, text: 'Farm Fresh', sub: 'Straight from Tondoli' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.text}</p>
                  <p className="text-[0.65rem] text-cream/60 hidden sm:block">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-gold-dark text-sm font-semibold tracking-widest uppercase mb-2">
              Our Harvest
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-forest-dark mb-4">
              Farm-Fresh Products
            </h2>
            <p className="text-earth-light max-w-lg mx-auto">
              Each product is grown on our farm and processed with care to bring
              you the purest grains and flour.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Fallback with static cards when DB not connected */}
              {[
                { name: 'Khapli Wheat Grain', slug: 'khapli-wheat-grain', img: '/images/khapli-wheat-grain.png', price: '₹120', desc: 'Ancient emmer wheat grain' },
                { name: 'Khapli Wheat Atta', slug: 'khapli-wheat-atta', img: '/images/khapli-wheat-atta.png', price: '₹140', desc: 'Stone-ground wheat flour' },
                { name: 'Shalu Grain', slug: 'shalu-grain', img: '/images/shalu-grain.png', price: '₹90', desc: 'Traditional jowar grain' },
                { name: 'Shalu Flour', slug: 'shalu-flour', img: '/images/shalu-flour.png', price: '₹100', desc: 'Fresh jowar flour' },
              ].map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}`} className="product-card group block">
                  <div className="relative aspect-square overflow-hidden bg-cream-dark">
                    <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-forest-dark text-base mb-1">{item.name}</h3>
                    <p className="text-xs text-earth-light mb-2">{item.desc}</p>
                    <p className="text-lg font-bold text-forest">{item.price} <span className="text-xs font-normal text-earth-light">/ 1 kg</span></p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/products" className="btn-secondary text-base px-8 py-3">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section className="py-16 md:py-24 bg-forest-dark relative grain-overlay overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-5 leading-tight">
                Rooted in Tradition,
                <br />
                Grown with Love
              </h2>
              <p className="text-cream/70 leading-relaxed mb-5">
                Mohite Farms sits in Tondoli village, Kadegaon taluka, nestled in the
                fertile lands of Maharashtra&apos;s Sangli district. For generations, our
                family has cultivated ancient grain varieties — Khapli wheat and Shalu
                jowar — using time-tested, natural farming practices.
              </p>
              <p className="text-cream/70 leading-relaxed mb-8">
                We believe in bringing you grain the way it was meant to be: pure,
                unprocessed, and full of the goodness that only patient, natural farming
                can deliver.
              </p>
              <Link href="/about" className="btn-gold">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-farm.png"
                  alt="Our farm in Tondoli, Kadegaon"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-gold/20 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-gold-dark text-sm font-semibold tracking-widest uppercase mb-2">
              Why Mohite Farms
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-forest-dark">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🌾',
                title: 'Single-Origin Grains',
                desc: 'Every grain comes from our own farm in Tondoli. You know exactly where your food is grown.',
              },
              {
                icon: '🪨',
                title: 'Stone-Ground Fresh',
                desc: 'Our flour is milled in small batches using traditional stone grinding to preserve natural nutrients.',
              },
              {
                icon: '🚫',
                title: 'No Chemical Inputs',
                desc: 'We do not use chemical pesticides or synthetic fertilizers on our crops.',
              },
              {
                icon: '👨‍🌾',
                title: 'Farmer-Led Brand',
                desc: 'We are the farmers. No middlemen. What we grow is what we sell, directly to you.',
              },
              {
                icon: '📦',
                title: 'Packed Fresh',
                desc: 'Products are cleaned, processed, and packed close to harvest for maximum freshness.',
              },
              {
                icon: '🤝',
                title: 'Transparent Practices',
                desc: 'Ask us anything about how we grow our crops. We believe in open, honest farming.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-sand/50 hover:border-gold/40 hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-3xl mb-4 block group-hover:animate-float inline-block">{item.icon}</span>
                <h3 className="font-heading font-semibold text-forest-dark text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-earth-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-forest to-forest-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Taste the Difference?
          </h2>
          <p className="text-cream/70 max-w-md mx-auto mb-8">
            Experience pure, naturally grown grains delivered straight from our farm to your kitchen.
          </p>
          <Link href="/products" className="btn-gold text-base px-10 py-4">
            Shop All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
