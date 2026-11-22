'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Wheat } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-dark text-cream/70 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-forest-dark font-bold font-heading">M</span>
              </div>
              <div>
                <span className="text-white font-heading font-bold text-xl">Mohite Farms</span>
                <span className="block text-gold-light text-[0.65rem] tracking-[0.2em] uppercase">{t.nav.farmToTable}</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4">{t.footer.tagline}</p>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <span>Tondoli, Kadegaon, Sangli District, Maharashtra, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products', label: t.footer.allProducts },
                { href: '/about', label: t.footer.aboutUs },
                { href: '/faq', label: t.footer.faqs },
                { href: '/contact', label: t.footer.contactUs },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-light transition-colors inline-flex items-center gap-1.5"
                  >
                    <Wheat className="w-3 h-3 text-gold/50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">{t.footer.policies}</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/policies/shipping', label: t.footer.shipping },
                { href: '/policies/returns', label: t.footer.returns },
                { href: '/policies/privacy', label: t.footer.privacy },
                { href: '/policies/terms', label: t.footer.terms },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold-light transition-colors inline-flex items-center gap-1.5"
                  >
                    <Wheat className="w-3 h-3 text-gold/50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">{t.footer.getInTouch}</h3>
            <div className="space-y-3">
              <a
                href="tel:+919XXXXXXXXX"
                className="flex items-center gap-2 text-sm hover:text-gold-light transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                +91 9XXX XXX XXX
              </a>
              <a
                href="mailto:contact@mohitefarms.com"
                className="flex items-center gap-2 text-sm hover:text-gold-light transition-colors"
              >
                <Mail className="w-4 h-4 text-gold" />
                contact@mohitefarms.com
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://wa.me/919XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t.footer.whatsapp}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/50">
            © {new Date().getFullYear()} Mohite Farms. {t.footer.copyright}
          </p>
          <p className="text-xs text-cream/40">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
