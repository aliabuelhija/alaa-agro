import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'wouter';
import { ArrowRight, MapPin } from 'lucide-react';

// Tuple type is required — framer-motion's `Easing` rejects a plain number[].
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

const commitments = [
  {
    en: {
      title: 'Specifications agreed in writing before any order is confirmed',
      detail: 'Moisture, protein, gluten, impurities and ash levels are shared at enquiry stage — not after payment. If a crop lot does not match the agreed parameters, we do not ship it.',
    },
    ru: {
      title: 'Спецификации согласуются письменно до подтверждения заказа',
      detail: 'Влажность, белок, клейковина, примеси и зольность раскрываются на этапе запроса — не после оплаты. Если партия не соответствует согласованным параметрам, мы её не отгружаем.',
    },
  },
  {
    en: {
      title: 'GOST-compliant phytosanitary and quality certificates on every shipment',
      detail: 'All goods comply with Russian Federal State Standards. Full documentation — phytosanitary certificate, quality certificate, certificate of origin — is prepared and provided as standard.',
    },
    ru: {
      title: 'Фитосанитарные и качественные сертификаты ГОСТ на каждую отгрузку',
      detail: 'Вся продукция соответствует Государственным стандартам РФ. Полный пакет документов — фитосанитарный сертификат, сертификат качества, сертификат происхождения — оформляется в стандартном порядке.',
    },
  },
  {
    en: {
      title: 'Packaging sized and labelled for your destination market',
      detail: 'Branded 25 kg and 50 kg PP woven bags, FIBC big bags, or bulk container loads. Label language, net weight markings and country-of-origin declarations are prepared per your import requirements.',
    },
    ru: {
      title: 'Упаковка и маркировка под требования рынка назначения',
      detail: 'Фирменные мешки по 25 и 50 кг из ПП-ткани, МКР или насыпью. Язык этикетки, маркировка нетто и декларации о стране происхождения оформляются согласно вашим импортным требованиям.',
    },
  },
  {
    en: {
      title: 'FOB, CFR, CIF and DAP — we quote the Incoterm that works for your port',
      detail: 'We coordinate sea freight from Novorossiysk, Taman and other Black Sea and Baltic ports. Rail and road options are available for landlocked destinations across Central Asia and the Caucasus.',
    },
    ru: {
      title: 'FOB, CFR, CIF и DAP — котируем на условиях, удобных для вашего порта',
      detail: 'Организуем морскую перевозку из Новороссийска, Тамани и других портов Чёрного и Балтийского морей. Для стран без выхода к морю — Центральная Азия, Кавказ — доступны железнодорожный и автомобильный варианты.',
    },
  },
  {
    en: {
      title: 'One contact person from first enquiry through to delivery confirmation',
      detail: 'No ticketing system, no handoffs between departments. Your manager is reachable directly by WhatsApp or email and handles every step — contract, payment, loading, documents and final delivery.',
    },
    ru: {
      title: 'Один контактный менеджер — от первого запроса до подтверждения доставки',
      detail: 'Без систем заявок и передачи между отделами. Ваш менеджер доступен напрямую в WhatsApp или по email и ведёт каждый этап: контракт, оплата, погрузка, документы и итоговая доставка.',
    },
  },
  {
    en: {
      title: 'Repeat buyers receive priority allocation during tight supply seasons',
      detail: 'When seasonal supply is constrained, established buyers are offered available lots first. Consistent volume commitments are rewarded with fixed pricing windows and reserved loading slots.',
    },
    ru: {
      title: 'Постоянные покупатели получают приоритетное распределение в периоды дефицита',
      detail: 'В сезоны ограниченного предложения действующим покупателям предлагаются доступные партии в первую очередь. Стабильные объёмы поощряются фиксированными ценовыми окнами и зарезервированными слотами погрузки.',
    },
  },
];

const stats = [
  { en: 'Products in catalogue', ru: 'Продуктов в каталоге', value: '15+' },
  { en: 'Packaging formats', ru: 'Форматов упаковки', value: '5' },
  { en: 'Export destinations', ru: 'Направлений экспорта', value: '20+' },
  { en: 'Incoterms offered', ru: 'Условий Инкотермс', value: 'FOB · CFR · CIF · DAP' },
];

export function AboutPage() {
  const { locale, t } = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="bg-background pt-[82px] pb-0">
      <SEOHead
        title={`${t('aboutPage.title')} | ALAA AGRO`}
        description={t('aboutPage.mission')}
        path={`/${locale}/about`}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <picture>
          <source srcSet="/hero-cinematic-pano.webp" type="image/webp" />
          <img
            src="/hero-cinematic-pano.jpg"
            alt={isEn ? 'ALAA AGRO — Russian agricultural fields at harvest' : 'АЛАА АГРО — российские поля в период уборки урожая'}
            className="w-full h-[62vh] min-h-[380px] max-h-[580px] object-cover object-center"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(21,18,13,0.32), rgba(21,18,13,0.18) 40%, rgba(21,18,13,0.70))' }}
        />
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-14 px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-[0.22em] mb-5" style={{ borderColor: 'rgba(194,154,61,0.55)', color: '#E8CE8F', background: 'rgba(21,18,13,0.45)' }}>
              <MapPin size={13} /> Moscow, Russia
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight drop-shadow-md">
              {t('aboutPage.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Mission / Story ── */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-4">
                {isEn ? 'Who We Are' : 'О компании'}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                {isEn
                  ? 'A dedicated trading partner for international grain buyers'
                  : 'Надёжный торговый партнёр для международных покупателей зерна'}
              </h2>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>{t('aboutPage.mission')}</p>
                <p>
                  {isEn
                    ? 'Our team handles every stage of the export process — from sourcing and quality confirmation to packaging, documentation and shipment coordination. Buyers receive a single point of contact and a consistent experience across every order.'
                    : 'Наша команда ведёт каждый этап экспортного процесса — от закупки и контроля качества до упаковки, документации и координации отгрузки. Покупатели получают единую точку контакта и стабильное качество сервиса на каждом заказе.'}
                </p>
                <p>
                  {isEn
                    ? 'Operating from Moscow, we maintain direct links with trusted Russian agricultural producers across multiple regions, allowing us to source Wheat, Corn, Barley, Chickpeas, Lentils, Flaxseed and other commodities consistently year-round.'
                    : 'Работая из Москвы, мы поддерживаем прямые связи с надёжными российскими производителями в нескольких регионах, что позволяет нам стабильно поставлять пшеницу, кукурузу, ячмень, нут, чечевицу, лён и другие культуры круглый год.'}
                </p>
              </div>
            </motion.div>

            {/* Photo */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="relative"
            >
              <div
                className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(44,31,14,0.16)]"
                style={{ border: '1px solid rgba(194,154,61,0.3)' }}
              >
                <img
                  src="/hero-real-warehouse.jpg"
                  alt={isEn ? 'ALAA AGRO warehouse — packaged goods ready for export' : 'Склад АЛАА АГРО — упакованные товары, готовые к экспорту'}
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
              {/* Gold accent block */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl -z-10"
                style={{ background: 'rgba(194,154,61,0.18)', border: '1px solid rgba(194,154,61,0.35)' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-10 border-y border-border bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.5}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl font-serif text-foreground mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{isEn ? s.en : s.ru}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commitments ── */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              {isEn ? 'What every order includes' : 'Что входит в каждый заказ'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground max-w-xl leading-tight">
              {isEn
                ? 'Six commitments we make to every buyer'
                : 'Шесть обязательств перед каждым покупателем'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
            {commitments.map((c, i) => {
              const content = isEn ? c.en : c.ru;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.08}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex gap-5 py-7 border-b border-border last:border-0 group"
                >
                  {/* Ordinal */}
                  <span
                    className="shrink-0 text-4xl font-serif leading-none mt-0.5 select-none"
                    style={{ color: 'rgba(194,154,61,0.35)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-2 leading-snug group-hover:text-accent transition-colors duration-200">
                      {content.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {content.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6" style={{ backgroundColor: '#1A1200' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 110%, rgba(194,154,61,0.2), transparent 60%)' }}
        />
        {/* Faint world-map watermark */}
        <img
          src="/world-map-gold.png"
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto object-contain pointer-events-none select-none"
          style={{ opacity: 0.05 }}
        />
        <div className="relative container mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-px w-16" style={{ backgroundColor: 'rgba(194,154,61,0.7)' }} />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
            {t('aboutPage.locationTitle')}
          </h2>
          <p className="text-white/60 font-light mb-8 max-w-xl mx-auto leading-relaxed">
            {t('aboutPage.locationDesc')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-all hover:shadow-[0_8px_30px_rgba(194,154,61,0.35)] uppercase tracking-wide text-sm"
          >
            {t('aboutPage.partnership')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
