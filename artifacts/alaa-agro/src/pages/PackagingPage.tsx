import React, { useState } from 'react';
import { Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'wouter';

const STANDARD_FORMATS = [
  {
    webp: '/packaging/bag-25kg.webp',
    photo: '/packaging/bag-25kg.jpg',
    titleKey: 'packagingPage.fmt25kg',
    descKey: 'packagingPage.fmt25kgDesc',
    chips: { en: ['25 kg net', '40 bags / pallet', 'ALAA AGRO branded'], ru: ['25 кг нетто', '40 мешков / паллет', 'Фирменная маркировка'] },
  },
  {
    webp: '/packaging/bag-50kg.webp',
    photo: '/packaging/bag-50kg.jpg',
    titleKey: 'packagingPage.fmt50kg',
    descKey: 'packagingPage.fmt50kgDesc',
    chips: { en: ['50 kg net', '20 bags / pallet', 'Liner available'], ru: ['50 кг нетто', '20 мешков / паллет', 'Вкладыш по запросу'] },
  },
  {
    webp: '/packaging/bigbag-fibc.webp',
    photo: '/packaging/bigbag-fibc.jpg',
    titleKey: 'packagingPage.fmtBig',
    descKey: 'packagingPage.fmtBigDesc',
    chips: { en: ['600–1000 kg', '2- or 4-loop', 'Food-grade liner'], ru: ['600–1000 кг', '2 или 4 стропы', 'Пищевой вкладыш'] },
  },
  {
    webp: '/packaging/container-load.webp',
    photo: '/packaging/container-load.jpg',
    titleKey: 'packagingPage.fmtContainer',
    descKey: 'packagingPage.fmtContainerDesc',
    chips: { en: ['20 ft ≈ 22 MT', '40 ft ≈ 26 MT', 'Liner fitted'], ru: ['20 фут ≈ 22 МТ', '40 фут ≈ 26 МТ', 'Вкладыш в комплекте'] },
  },
];

const GALLERY = [
  {
    src: '/packaging/bag-25kg.jpg',
    webp: '/packaging/bag-25kg.webp',
    alt: { en: 'ALAA AGRO 25 kg branded woven bags — chickpeas, lentils, sunflower seeds', ru: 'Брендированные мешки АЛАА АГРО 25 кг' },
    caption: { en: '25 kg branded woven bags', ru: 'Фирменные мешки 25 кг' },
    wide: false,
  },
  {
    src: '/packaging/pallets.jpg',
    webp: '/packaging/pallets.jpg',
    alt: { en: 'ALAA AGRO bags stacked on pallets ready for container loading', ru: 'Мешки АЛАА АГРО на паллетах перед загрузкой в контейнер' },
    caption: { en: 'Palletised bags — container-ready', ru: 'Паллетированные мешки' },
    wide: false,
  },
  {
    src: '/packaging/bigbag-fibc.jpg',
    webp: '/packaging/bigbag-fibc.webp',
    alt: { en: 'ALAA AGRO FIBC big bag 600–1000 kg with food-grade liner', ru: 'Биг-бэг АЛАА АГРО 600–1000 кг с пищевым вкладышем' },
    caption: { en: 'FIBC big bag — 600–1000 kg', ru: 'Биг-бэг 600–1000 кг' },
    wide: false,
  },
  {
    src: '/packaging/pallets_2.jpg',
    webp: '/packaging/pallets_2.jpg',
    alt: { en: 'ALAA AGRO stacked pallets in storage ready for export shipment', ru: 'Паллеты АЛАА АГРО на хранении перед отправкой' },
    caption: { en: 'Pallet storage before shipment', ru: 'Паллеты перед отгрузкой' },
    wide: false,
  },
  {
    src: '/packaging/container-load-real.jpg',
    webp: '/packaging/container-load-real.jpg',
    alt: { en: 'Polypropylene grain bags stacked inside a 20-foot shipping container', ru: 'Мешки с зерном в 20-футовом контейнере' },
    caption: { en: 'Container loading — 20 ft', ru: 'Загрузка контейнера — 20 фут' },
    wide: true,
  },
];

const OIL_FORMATS = [
  { iconEn: 'PET Bottle', iconRu: 'ПЭТ-бутылка', sizesEn: '1 L · 5 L', sizesRu: '1 л · 5 л', noteEn: 'Retail & food-service', noteRu: 'Розница и фудсервис' },
  { iconEn: 'Carton Case', iconRu: 'Картонная коробка', sizesEn: '3 × 5 L · 4 × 5 L', sizesRu: '3 × 5 л · 4 × 5 л', noteEn: 'Wholesale distribution', noteRu: 'Оптовые поставки' },
  { iconEn: 'Bulk Container', iconRu: 'Наливная тара', sizesEn: '10 L / 20 L cans · 1 000 L IBC', sizesRu: '10 л / 20 л канистры · IBC 1 000 л', noteEn: 'Industrial & processing', noteRu: 'Промышленность и переработка' },
];

export function PackagingPage() {
  const { locale, t } = useLocale();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prevPhoto = () => setLightbox((i) => (i === null ? null : (i - 1 + GALLERY.length) % GALLERY.length));
  const nextPhoto = () => setLightbox((i) => (i === null ? null : (i + 1) % GALLERY.length));

  return (
    <div className="bg-background pt-[82px] pb-12">
      <SEOHead
        title={`${t('packagingPage.title')} | ALAA AGRO`}
        description={t('packagingPage.subtitle')}
        path={`/${locale}/packaging`}
      />

      {/* Hero — full photo */}
      <section className="relative overflow-hidden">
        <img
          src="/packaging/warehouse-loading.jpg"
          alt="ALAA AGRO branded warehouse with packaged goods loading for export"
          className="w-full h-[58vh] min-h-[360px] max-h-[540px] object-cover"
          style={{ objectPosition: 'center 62%' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(21,18,13,0.25), rgba(21,18,13,0.15) 35%, rgba(21,18,13,0.72))' }}
        />
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-14 px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight drop-shadow-md mb-4">
              {t('packagingPage.subtitle')}
            </h1>
            <p className="text-white/70 font-light text-lg max-w-xl mx-auto">
              {t('packagingHome.disclaimer')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Standard formats */}
          <div className="mb-3">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
              {locale === 'en' ? 'Grains · Pulses · Oilseeds · Seeds' : 'Зерновые · Бобовые · Масличные · Семена'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              {t('packagingPage.standard')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {STANDARD_FORMATS.map((fmt, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div className="h-52 overflow-hidden shrink-0">
                  <picture>
                    <source srcSet={fmt.webp} type="image/webp" />
                    <img
                      src={fmt.photo}
                      alt={t(fmt.titleKey)}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-serif text-foreground mb-2 leading-snug">
                    {t(fmt.titleKey)}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light mb-4 flex-1">
                    {t(fmt.descKey)}
                  </p>
                  {/* Spec chips */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                    {(locale === 'ru' ? fmt.chips.ru : fmt.chips.en).map((chip, ci) => (
                      <span
                        key={ci}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(194,154,61,0.1)', color: '#8B6914', border: '1px solid rgba(194,154,61,0.25)' }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special formats — Vegetable Oils */}
          <div className="mb-14 rounded-2xl overflow-hidden border border-border" style={{ background: '#FAF7F2' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Photo */}
              <div className="h-64 lg:h-auto overflow-hidden">
                <picture>
                  <source srcSet={`${import.meta.env.BASE_URL}products/sunflower-oil_2.webp`} type="image/webp" />
                  <img
                    src={`${import.meta.env.BASE_URL}products/sunflower-oil_2.jpg`}
                    alt={locale === 'en' ? 'ALAA AGRO refined sunflower oil — export packaging' : 'Рафинированное подсолнечное масло АЛАА АГРО'}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 40%' }}
                  />
                </picture>
              </div>
              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
                  {locale === 'en' ? 'Vegetable Oils' : 'Растительные масла'}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                  {t('packagingPage.special')}
                </h2>
                <p className="text-sm text-muted-foreground mb-7 font-light">
                  {locale === 'en'
                    ? 'Refined sunflower oil is available in three packaging configurations to suit retail, wholesale, and industrial buyers.'
                    : 'Рафинированное подсолнечное масло доступно в трёх форматах упаковки — для розницы, оптовиков и промышленных покупателей.'}
                </p>
                <div className="space-y-4">
                  {OIL_FORMATS.map((f, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background">
                      <span
                        className="shrink-0 text-2xl font-serif leading-none mt-0.5 select-none"
                        style={{ color: 'rgba(194,154,61,0.4)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{locale === 'en' ? f.iconEn : f.iconRu}</p>
                        <p className="text-accent font-medium text-sm">{locale === 'en' ? f.sizesEn : f.sizesRu}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{locale === 'en' ? f.noteEn : f.noteRu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Photo Gallery ──────────────────────────────────────────── */}
          <div className="mb-14">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
                {locale === 'en' ? 'Real photos' : 'Реальные фото'}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                {locale === 'en' ? 'Our Packaging in Practice' : 'Наша упаковка в действии'}
              </h2>
            </div>

            {/* Responsive masonry-style grid: first image spans 2 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightbox(idx)}
                  className={`group relative overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/60${photo.wide ? ' col-span-2 md:col-span-2' : ''}`}
                  style={{ aspectRatio: photo.wide ? '16/7' : '4/3' }}
                  aria-label={photo.caption[locale as 'en' | 'ru']}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt[locale as 'en' | 'ru']}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-white text-xs font-medium drop-shadow-md text-left">
                      {photo.caption[locale as 'en' | 'ru']}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Process / CTA */}
          <div className="bg-[#1A1200] text-white p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-xl border-l-8 border-accent">
            <h3 className="text-3xl font-serif mb-6">{t('packagingPage.process')}</h3>
            <ul className="space-y-4 text-lg font-light text-white/90">
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <span>{t('packagingPage.p1')}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <span>{t('packagingPage.p2')}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <span>{t('packagingPage.p3')}</span>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3 text-white/60 text-sm bg-black/20 p-4 rounded-xl">
              <Info className="shrink-0" size={20} />
              <p>{t('packagingHome.disclaimer')} {t('packagingPage.shipNote')}</p>
            </div>

            <div className="mt-8">
              <Link
                href={`/${locale}/quote`}
                className="inline-block px-10 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm"
              >
                {t('nav.quote')}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-3 md:left-6 text-white/60 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY[lightbox].src}
              alt={GALLERY[lightbox].alt[locale as 'en' | 'ru']}
              className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white/70 text-sm text-center mt-3">
              {GALLERY[lightbox].caption[locale as 'en' | 'ru']}
              <span className="text-white/30 ml-2">
                {lightbox + 1} / {GALLERY.length}
              </span>
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-3 md:right-6 text-white/60 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-2"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
