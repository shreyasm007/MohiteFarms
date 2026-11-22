'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setShowUserMenu(false);
  };

  const navLinks = [
    { href: '/products', label: t.nav.products },
    { href: '/about', label: t.nav.about },
    { href: '/faq', label: t.nav.faq },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-dark shadow-lg'
          : 'bg-forest/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-forest-dark font-bold text-sm font-heading">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-heading font-bold text-lg leading-tight tracking-wide">
                Mohite Farms
              </span>
              <span className="text-gold-light text-[0.6rem] tracking-[0.2em] uppercase hidden sm:block">
                {t.nav.farmToTable}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/80 hover:text-gold-light text-sm font-medium transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            {mounted && <LanguageSwitcher />}

            {/* User */}
            {mounted && (
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 text-cream/80 hover:text-gold-light transition-colors text-sm"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                      <User className="w-4 h-4 text-gold-light" />
                    </div>
                    <ChevronDown className="w-3 h-3 hidden sm:block" />
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 text-cream/80 hover:text-gold-light transition-colors text-sm"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{t.nav.signIn}</span>
                  </Link>
                )}

                {/* User dropdown */}
                {showUserMenu && user && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-sand py-1 animate-slide-down">
                    <div className="px-3 py-2 border-b border-sand/50">
                      <p className="text-xs text-earth-light truncate">{user.email || user.phone}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-sm text-foreground hover:bg-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t.nav.myOrders}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.nav.signOut}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-cream/80 hover:text-gold-light transition-colors"
              aria-label={`Cart with ${mounted ? totalItems : 0} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-forest-dark text-[0.65rem] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-cream/80 hover:text-gold-light transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 animate-slide-down">
          <nav className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/80 hover:text-gold-light hover:bg-white/5 py-3 px-3 rounded-lg text-sm font-medium transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {mounted && !user && (
              <Link
                href="/auth/login"
                className="text-gold hover:text-gold-light hover:bg-white/5 py-3 px-3 rounded-lg text-sm font-medium transition-all border-t border-white/10 mt-2 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.signInCreate}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
