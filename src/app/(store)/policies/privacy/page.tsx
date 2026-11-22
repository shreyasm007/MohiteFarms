import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy' };
export default function PrivacyPolicyPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Privacy Policy</h1>
          <p className="text-cream/70 mt-2">Last updated: October 2026</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-xl border border-sand/50 p-6 md:p-8 space-y-6 text-sm text-earth leading-relaxed">
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Information We Collect</h2>
              <p>When you place an order or create an account, we collect your name, phone number, email address, and delivery address. Payment information is processed securely by Razorpay and is never stored on our servers.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To process and deliver your orders</li>
                <li>To communicate about your orders and shipments</li>
                <li>To respond to your queries and support requests</li>
                <li>To improve our products and services</li>
              </ul>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Data Security</h2>
              <p>We use Supabase for secure data storage with row-level security policies. Payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway. We do not store card details.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Third-Party Services</h2>
              <p>We use Supabase (database & auth), Razorpay (payments), and courier partners for order fulfillment. Each of these services has their own privacy policies.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Your Rights</h2>
              <p>You can request access to, correction of, or deletion of your personal data by contacting us at contact@mohitefarms.com.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Contact</h2>
              <p>For privacy-related queries, email us at <a href="mailto:contact@mohitefarms.com" className="text-forest font-semibold hover:underline">contact@mohitefarms.com</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
