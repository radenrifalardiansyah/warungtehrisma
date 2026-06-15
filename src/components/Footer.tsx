'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Instagram, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/images/logo-tehrisma.jpeg';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.footer.links.home },
    { href: '/products', label: t.footer.links.products },
    { href: '/checkout', label: t.footer.links.checkout },
  ];

  const categories = [
    { emoji: '🥔', label: t.footer.categories.keripik, href: '/products?category=keripik' },
    { emoji: '🍜', label: t.footer.categories.mie, href: '/products?category=mie' },
    { emoji: '🍿', label: t.footer.categories.snack, href: '/products?category=snack' },
    { emoji: '🎁', label: t.footer.categories.paket, href: '/products?category=paket' },
  ];
  const C = '#a22200';
  const Cm = 'rgba(162,34,0,0.7)';
  const Cs = 'rgba(162,34,0,0.5)';
  const border = 'rgba(162,34,0,0.2)';

  return (
    <footer className="relative overflow-hidden hidden md:block" style={{ background: '#efc996' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${border}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0" style={{ borderColor: border }}>
                <Image src={logo} alt="Cemilan Teh Risma" fill className="object-cover" />
              </div>
              <div>
                <p className="font-display text-xl font-bold leading-none" style={{ color: C }}>Cemilan</p>
                <p className="font-display text-base font-bold leading-none" style={{ color: C }}>Teh Risma</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: Cm }}>
              {t.footer.desc}
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white border border-green-400 hover:bg-green-400 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://www.instagram.com/keripiktehrisma"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white border border-pink-400 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                aria-label="Instagram @keripiktehrisma"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://shopee.co.id/tehrisma.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center border border-orange-400 hover:bg-orange-400 transition-all"
                aria-label="Shopee tehrisma.id"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C9.8 2 8 3.8 8 6H4.5C3.7 6 3 6.6 3 7.4L2 19.4C1.9 20.3 2.6 21 3.5 21H20.5C21.4 21 22.1 20.3 22 19.4L21 7.4C21 6.6 20.3 6 19.5 6H16C16 3.8 14.2 2 12 2ZM12 3.5C13.4 3.5 14.5 4.6 14.5 6H9.5C9.5 4.6 10.6 3.5 12 3.5Z" fill="#EE4D2D"/>
                  <circle cx="8.5" cy="12" r="1.5" fill="#EE4D2D"/>
                  <circle cx="15.5" cy="12" r="1.5" fill="#EE4D2D"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold mb-4 text-sm" style={{ color: C }}>{t.footer.navigation}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-opacity hover:opacity-100 flex items-center gap-2 group"
                    style={{ color: Cm }}
                  >
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: Cs }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h4 className="font-display font-bold mb-4 text-sm" style={{ color: C }}>{t.footer.flavors}</h4>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-sm transition-opacity hover:opacity-100 flex items-center gap-2"
                    style={{ color: Cm }}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold mb-4 text-sm" style={{ color: C }}>{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: C }} />
                <div>
                  <p className="text-sm leading-snug" style={{ color: Cm }}>
                    Jl. Batara Kp. Bubulak No. 54 RT01/RW03<br />
                    Kel. Ciluar, Kec. Bogor Utara 16156
                  </p>
                  <a
                    href="https://maps.app.goo.gl/h1AyYBaTH2tAqS588"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold transition-opacity hover:opacity-100"
                    style={{ color: C }}
                  >
                    <MapPin size={10} />
                    {t.footer.mapsLink}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="flex-shrink-0" style={{ color: C }} />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: Cm }}
                >
                  0812-1213-2014
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram size={14} className="flex-shrink-0" style={{ color: C }} />
                <a
                  href="https://www.instagram.com/keripiktehrisma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: Cm }}
                >
                  @keripiktehrisma
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="flex-shrink-0" style={{ color: C }} />
                <span className="text-sm" style={{ color: Cm }}>{t.footer.hours}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: `1px solid ${border}` }}>
          <div className="flex flex-col items-center sm:items-start gap-0.5">
            <p className="text-sm" style={{ color: Cm }}>{t.footer.copyright}</p>
            <p className="text-xs" style={{ color: Cs }}>PT. RMedia Production</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: Cm }}>
            <span>{t.footer.madeWith}</span>
            <span style={{ color: C }}>♥</span>
            <span>{t.footer.madeFrom}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
