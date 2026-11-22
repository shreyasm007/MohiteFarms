import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Mohite Farms. Reach us via WhatsApp, phone, or email.',
};

export default function ContactPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Get in Touch</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Contact Us</h1>
          <p className="text-cream/70 mt-2 max-w-lg">
            Have a question about our products or your order? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-xl mb-6">
                Reach Out to Us
              </h2>

              <div className="space-y-5">
                <a
                  href="https://wa.me/919XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-dark">WhatsApp (Preferred)</p>
                    <p className="text-sm text-earth-light mt-0.5">Fastest way to reach us</p>
                    <p className="text-sm text-green-700 font-medium mt-1">+91 9XXX XXX XXX</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-sand/50">
                  <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-dark">Phone</p>
                    <a href="tel:+919XXXXXXXXX" className="text-sm text-earth hover:text-forest transition-colors">
                      +91 9XXX XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-sand/50">
                  <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-dark">Email</p>
                    <a href="mailto:contact@mohitefarms.com" className="text-sm text-earth hover:text-forest transition-colors">
                      contact@mohitefarms.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-sand/50">
                  <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-dark">Farm Address</p>
                    <p className="text-sm text-earth-light">
                      Tondoli, Kadegaon Taluka,<br />
                      Sangli District, Maharashtra,<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-sand/50">
                  <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-dark">Response Time</p>
                    <p className="text-sm text-earth-light">
                      We typically respond within a few hours on WhatsApp.
                      Email responses may take up to 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-xl mb-6">
                Send a Message
              </h2>
              <form className="bg-white rounded-xl border border-sand/50 p-6 space-y-4">
                <div>
                  <label className="input-label">Your Name</label>
                  <input type="text" className="input-field" placeholder="Full name" />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="input-label">Email (optional)</label>
                  <input type="email" className="input-field" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="input-label">Message</label>
                  <textarea
                    className="input-field min-h-[120px] resize-y"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3">
                  Send Message
                </button>
                <p className="text-[0.65rem] text-earth-light text-center">
                  Or reach out directly via WhatsApp for faster response.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
