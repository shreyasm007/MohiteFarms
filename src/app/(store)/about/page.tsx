import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Wheat, Sun, Droplets, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Mohite Farms — a family-run farm in Tondoli, Kadegaon, Maharashtra, growing Khapli wheat and Shalu jowar naturally.',
};

export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <Image
          src="/images/about-farm.png"
          alt="Mohite Farms in Tondoli, Kadegaon"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/40 to-transparent" />
        <div className="container-custom relative z-10 pb-10">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">About Us</p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
            Our Roots Run Deep
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest-dark mb-6">
              From Tondoli, With Care
            </h2>
            <div className="prose text-earth leading-relaxed space-y-4">
              <p>
                Mohite Farms is located in <strong>Tondoli village, Kadegaon taluka, Sangli district</strong> — 
                in the heart of Maharashtra&apos;s fertile Deccan Plateau. Our family has been farming this 
                land for generations, growing ancient grain varieties the way they were always meant to be grown.
              </p>
              <p>
                We specialize in two heritage grains: <strong>Khapli wheat (Emmer wheat)</strong> and 
                <strong> Shalu jowar (Sorghum)</strong>. These are not modern hybrid varieties. They are 
                traditional seeds that have been cultivated in this region for centuries, selected for taste, 
                resilience, and nutrition — not just yield.
              </p>
              <p>
                Our farming practices are simple: we do not use chemical pesticides or synthetic fertilizers. 
                We rely on natural soil health, crop rotation, and traditional knowledge passed down through 
                our family. The result is grain that tastes the way grain should taste — wholesome, nutty, 
                and full of character.
              </p>
              <p>
                We process everything close to the farm. Our wheat atta is stone-ground in small batches, 
                and our jowar flour is freshly milled to preserve the natural aroma and nutrients. From 
                harvesting to packing, we handle every step ourselves to ensure quality and freshness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-cream-dark">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest-dark text-center mb-12">
            How We Farm
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wheat,
                title: 'Heritage Seeds',
                desc: 'We grow traditional Khapli and Shalu varieties, not modern hybrids. These ancient grains are adapted to our soil and climate.',
              },
              {
                icon: Sun,
                title: 'Natural Growing',
                desc: 'No chemical pesticides. No synthetic fertilizers. We work with nature, not against it.',
              },
              {
                icon: Droplets,
                title: 'Rain-Fed Crops',
                desc: 'Our Shalu jowar is primarily rain-fed, making it a hardy and sustainable crop for the Deccan region.',
              },
              {
                icon: MapPin,
                title: 'Local Processing',
                desc: 'All processing happens close to our farm. Stone-grinding, cleaning, and packing — we do it all ourselves.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl text-center">
                <div className="w-14 h-14 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-forest" />
                </div>
                <h3 className="font-heading font-semibold text-forest-dark text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-earth-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 md:py-20">
        <div className="container-custom text-center">
          <MapPin className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest-dark mb-3">
            Where to Find Us
          </h2>
          <p className="text-earth max-w-md mx-auto mb-6">
            Tondoli, Kadegaon Taluka, Sangli District, Maharashtra, India
          </p>
          <div className="rounded-xl overflow-hidden border border-sand max-w-3xl mx-auto h-64 md:h-80 bg-cream-dark">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30536.8!2d74.3!3d17.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc17f!2sTondoli%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mohite Farms Location"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-forest text-white text-center">
        <div className="container-custom">
          <h2 className="text-2xl font-heading font-bold mb-4">Try Our Farm-Fresh Products</h2>
          <Link href="/products" className="btn-gold text-base px-8 py-3">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
