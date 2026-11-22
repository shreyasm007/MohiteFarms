'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What is Khapli wheat?',
    a: 'Khapli wheat (also called Emmer wheat) is an ancient grain variety that has been cultivated in the Deccan Plateau for centuries. It is known for its nutty flavour and is considered a traditional heritage wheat. It is different from the common wheat varieties available in the market.',
  },
  {
    q: 'What is Shalu jowar?',
    a: 'Shalu is a traditional variety of jowar (sorghum) native to western Maharashtra. It is a hardy, rain-fed crop with white-cream coloured grains. Shalu jowar is naturally gluten-free and has been a dietary staple in the region for generations.',
  },
  {
    q: 'Are your products organic?',
    a: 'We grow our crops without chemical pesticides or synthetic fertilizers, following natural farming practices. However, we do not currently hold a formal organic certification. We believe in transparency — feel free to ask us anything about how we farm.',
  },
  {
    q: 'How is the atta (flour) made?',
    a: 'Our flour is stone-ground in small batches, close to our farm. This traditional method preserves the natural nutrients, bran, and germ of the grain, giving the flour its wholesome quality and earthy aroma.',
  },
  {
    q: 'Do you ship across India?',
    a: 'Yes, we deliver across India. Shipping is free on orders above ₹999. Standard delivery usually takes 5–7 business days depending on your location.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods via Razorpay — UPI, credit/debit cards, net banking, and popular wallets. We also offer Cash on Delivery (COD) with a small additional charge.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photos. We will arrange a replacement or refund. Due to the nature of food products, we cannot accept returns for change of mind.',
  },
  {
    q: 'How should I store the products?',
    a: 'Store grains and flour in a cool, dry place in an airtight container. Flour is best consumed within 30–45 days of opening for optimal freshness. Whole grains can last several months when stored properly.',
  },
  {
    q: 'Where is your farm located?',
    a: 'Our farm is in Tondoli village, Kadegaon taluka, Sangli district, Maharashtra, India — in the Deccan Plateau region.',
  },
  {
    q: 'How can I contact you?',
    a: 'The easiest way to reach us is via WhatsApp. You can also email us at contact@mohitefarms.com. We typically respond within a few hours.',
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-sand/50 rounded-xl overflow-hidden transition-all hover:border-gold/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-forest-dark text-sm md:text-base pr-4">
          {faq.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-earth-light shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-slide-down">
          <p className="text-sm text-earth leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Support</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-cream/70 mt-2 max-w-lg">
            Everything you need to know about our products, shipping, and more.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>

          <div className="mt-12 text-center bg-cream-dark rounded-xl p-8">
            <HelpCircle className="w-8 h-8 text-gold mx-auto mb-3" />
            <h2 className="font-heading font-semibold text-forest-dark text-lg mb-2">
              Still have questions?
            </h2>
            <p className="text-sm text-earth-light mb-4">
              We&apos;re happy to help. Reach out to us anytime.
            </p>
            <a
              href="https://wa.me/919XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
