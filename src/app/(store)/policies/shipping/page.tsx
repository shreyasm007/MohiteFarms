import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Mohite Farms shipping policy — delivery timelines, charges, and coverage.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Shipping Policy</h1>
          <p className="text-cream/70 mt-2">Last updated: October 2026</p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-xl border border-sand/50 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Delivery Coverage</h2>
              <p className="text-sm text-earth leading-relaxed">
                We deliver across India. All our products are shipped from our farm in Tondoli, 
                Kadegaon, Maharashtra.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Shipping Charges</h2>
              <ul className="text-sm text-earth space-y-2 list-disc pl-5">
                <li><strong>Free shipping</strong> on orders above ₹999.</li>
                <li>For orders below ₹999, a standard shipping fee applies based on order weight.</li>
                <li>Shipping charges are calculated and displayed at checkout before payment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Delivery Timeline</h2>
              <ul className="text-sm text-earth space-y-2 list-disc pl-5">
                <li><strong>Maharashtra:</strong> 3–5 business days</li>
                <li><strong>Rest of India:</strong> 5–7 business days</li>
                <li>Delivery times may vary during festivals, holidays, or unforeseen circumstances.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Cash on Delivery</h2>
              <p className="text-sm text-earth leading-relaxed">
                COD is available for most locations with a small additional charge (displayed at checkout). 
                COD availability may vary by pincode.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Order Processing</h2>
              <p className="text-sm text-earth leading-relaxed">
                Orders are processed within 1–2 business days. You will receive tracking information 
                once your order has been shipped.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Questions?</h2>
              <p className="text-sm text-earth">
                Contact us at{' '}
                <a href="https://wa.me/919XXXXXXXXX" className="text-forest font-semibold hover:underline">
                  WhatsApp
                </a>{' '}
                or{' '}
                <a href="mailto:contact@mohitefarms.com" className="text-forest font-semibold hover:underline">
                  contact@mohitefarms.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
