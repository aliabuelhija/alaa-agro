import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { Product, productName, specLabel } from '../data/products';
import { useLocale } from '../contexts/LocaleContext';
import { categoryLabelById } from '../data/categories';

interface ProductCardProps {
  product: Product;
}

const WA_NUMBER = '79265705777';

function buildWaUrl(productName: string, locale: string) {
  const msg =
    locale === 'ru'
      ? `Здравствуйте, интересует оптовая закупка: ${productName}. Прошу выслать коммерческое предложение.`
      : locale === 'ar'
        ? `مرحباً، أنا مهتم بشراء كمية بالجملة من: ${productName}. يرجى إرسال عرض تجاري.`
        : `Hello, I'm interested in a bulk order of: ${productName}. Please send me a commercial offer.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Compact one-line packaging summary, e.g. "25 / 50 kg bags · Big bags · Containers" */
function packagingSummary(packaging: string[], locale: string): string {
  const has = (frag: string) => packaging.some(p => p.toLowerCase().includes(frag));
  const parts: string[] = [];
  const kg: string[] = [];
  if (has('25 kg')) kg.push('25');
  if (has('50 kg')) kg.push('50');
  if (kg.length) parts.push(locale === 'ru' ? `Мешки ${kg.join(' / ')} кг` : locale === 'ar' ? `أكياس ${kg.join(' / ')} كجم` : `${kg.join(' / ')} kg bags`);
  if (has('big bag')) parts.push(locale === 'ru' ? 'Биг-бэги' : locale === 'ar' ? 'أكياس كبيرة' : 'Big bags');
  if (has('container')) parts.push(locale === 'ru' ? 'Контейнеры' : locale === 'ar' ? 'حاويات' : 'Containers');
  if (has('bottle') || has(' l ') || has('cartons')) parts.push(locale === 'ru' ? 'Бутылки' : locale === 'ar' ? 'معبأ في عبوات' : 'Bottled');
  return parts.join(' · ');
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
  const name = productName(product, locale);
  const nameAlt = locale === 'en' ? product.nameRu : product.name;

  // Pick 3 key specs for the card
  const keySpecs = product.specs.slice(0, 3);
  const waUrl = buildWaUrl(name, locale);
  const pkgLine = packagingSummary(product.packaging || [], locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full overflow-hidden transition-all duration-300"
      style={{ borderRadius: '14px', background: '#FFFBF5', border: '1px solid rgba(194,154,61,0.20)', boxShadow: '0 1px 10px rgba(43,36,28,0.06)' }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(43,36,28,0.14)' }}
    >
      {/* Image */}
      <Link href={`/${locale}/products/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={`${import.meta.env.BASE_URL}${product.image}`}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
        />
        {/* Soft bottom vignette so the dark photos blend into the card */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(21,16,8,0.35), transparent)' }}
        />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ background: 'rgba(12,9,3,0.60)', color: '#E3B84F', backdropFilter: 'blur(8px)', border: '1px solid rgba(227,184,79,0.25)' }}
        >
          {categoryLabelById(product.category, locale)}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        {/* Name */}
        <Link href={`/${locale}/products/${product.slug}`} className="block mb-3 group/name">
          <h3 className="font-serif text-lg md:text-xl leading-snug group-hover/name:text-primary transition-colors" style={{ color: '#2B241C' }}>
            {name}
          </h3>
          <p className="text-[11px] mt-0.5 uppercase tracking-[0.08em]" style={{ color: '#B09A82' }}>{nameAlt}</p>
        </Link>

        {/* Key specs */}
        <div className="flex-1">
          {keySpecs.map((spec, i) => (
            <div key={i} className="flex items-baseline justify-between py-[7px] gap-3" style={{ borderTop: '1px solid rgba(194,154,61,0.12)' }}>
              <span className="text-xs" style={{ color: '#9A8070' }}>
                {specLabel(spec, locale)}
              </span>
              <span className="text-xs font-semibold tabular-nums shrink-0 text-right" style={{ color: '#2B241C' }}>
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* Packaging summary line */}
        {pkgLine && (
          <div className="flex items-center gap-1.5 mt-1 mb-3 pt-[7px]" style={{ borderTop: '1px solid rgba(194,154,61,0.12)' }}>
            <Package size={12} className="shrink-0" style={{ color: '#C29A3D' }} />
            <span className="text-[11px] leading-snug" style={{ color: '#7A6450' }}>{pkgLine}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(194,154,61,0.18)' }}>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="flex-1 inline-flex items-center gap-1.5 text-xs font-semibold hover:text-accent transition-colors min-w-0"
            style={{ color: '#2B241C' }}
          >
            <span className="truncate">{t('featured.viewSpecs')}</span>
            <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          {/* WhatsApp button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp — ${name}`}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold text-white transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ background: '#25D366' }}
            onClick={e => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
