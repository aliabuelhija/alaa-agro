import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'wouter';
import { Wheat, Package, Globe } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const SLIDE_MS = 7000;
const FADE_S = 1;
// The three uploaded photos are all 1536×1024 (3:2). The hero media band uses
// this exact ratio so every photo is shown complete — nothing cropped, no zoom.
const PHOTO_RATIO = '1536 / 1024';

type Slide = {
  img: string;
  eyebrow: { en: string; ru: string };
  headline: { en: string; ru: string };
  sub: { en: string; ru: string };
};

const SLIDES: Slide[] = [
  {
    img: 'hero/slide-1-port.jpg',
    eyebrow: { en: 'Ready for Global Delivery', ru: 'Готово к мировой доставке' },
    headline: { en: 'Reliable International Shipment', ru: 'Надёжные международные отгрузки' },
    sub: {
      en: 'Branded consignments prepared and loaded for dependable movement to international markets.',
      ru: 'Брендированные партии подготовлены и погружены для надёжных поставок на международные рынки.',
    },
  },
  {
    img: 'hero/slide-2-map.jpg',
    eyebrow: { en: 'Delivered with Confidence', ru: 'Доставлено с уверенностью' },
    headline: { en: 'From Moscow to World Markets', ru: 'Из Москвы на мировые рынки' },
    sub: {
      en: 'Coordinated export routes connecting Russian origin to buyers across the globe.',
      ru: 'Скоординированные экспортные маршруты, соединяющие российское происхождение с покупателями по всему миру.',
    },
  },
  {
    img: 'hero/slide-3-field.jpg',
    eyebrow: { en: 'From Russian Origin', ru: 'Российское происхождение' },
    headline: { en: 'Premium Agricultural Products', ru: 'Премиальная сельхозпродукция' },
    sub: {
      en: 'Selected grains, pulses, oilseeds and seeds prepared for international buyers.',
      ru: 'Отборные зерновые, бобовые, масличные и семена, подготовленные для международных покупателей.',
    },
  },
];

export function HeroSlider() {
  const { locale } = useLocale();
  const lang = (locale === 'ru' ? 'ru' : 'en') as 'en' | 'ru';
  const prefersReducedMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const remainingRef = useRef(SLIDE_MS);

  const active = inView && !prefersReducedMotion;

  const goTo = useCallback((next: number) => {
    remainingRef.current = SLIDE_MS;
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay; tracks remaining time so off-viewport pauses resume smoothly
  useEffect(() => {
    if (!active) return;
    const startedAt = Date.now();
    const id = setTimeout(() => goTo(index + 1), remainingRef.current);
    return () => {
      clearTimeout(id);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
    };
  }, [index, active, goTo]);

  // Pause when the hero is mostly outside the viewport (ratio-based)
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.intersectionRatio >= 0.15),
      { threshold: [0, 0.15, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Preload next slide shortly before it is needed (prefer WebP)
  useEffect(() => {
    const next = SLIDES[(index + 1) % SLIDES.length];
    const base = import.meta.env.BASE_URL;
    // Try WebP first; browsers that don't support it will ignore it
    const webp = new Image();
    webp.src = `${base}${next.img.replace('.jpg', '.webp')}`;
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 48) goTo(index + (dx < 0 ? 1 : -1));
  };

  const slide = SLIDES[index];

  /* Per-slide text block — reused by the desktop overlay and the mobile panel */
  const slideText = (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="h-px w-7 shrink-0" style={{ background: '#E3B84F' }} />
          <span style={{ color: '#E8C05E', fontSize: '10px', letterSpacing: '0.24em', fontWeight: 600 }} className="uppercase">
            {slide.eyebrow[lang]}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif mb-4 lg:mb-5"
          style={{
            fontSize: 'clamp(2.6rem, 4.6vw, 5rem)', lineHeight: 1.08, letterSpacing: '-0.025em',
            color: '#F7F2E8', textShadow: '0 2px 18px rgba(24,14,5,0.45)',
          }}
        >
          {slide.headline[lang]}
        </h1>

        {/* Gold rule */}
        <div className="mb-4 lg:mb-5" style={{ height: '1px', width: '52px', background: 'linear-gradient(90deg, #C9972D, rgba(201,151,45,0.10))' }} />

        {/* Supporting line */}
        <p
          className="mb-6 lg:mb-7"
          style={{
            fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)', lineHeight: 1.7, maxWidth: '420px',
            color: 'rgba(247,242,232,0.9)', textShadow: '0 1px 12px rgba(24,14,5,0.35)',
          }}
        >
          {slide.sub[lang]}
        </p>
      </motion.div>
    </AnimatePresence>
  );

  /* Fixed CTAs + trust points — stable across slides */
  const fixedContent = (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 lg:mb-7">
        <Link
          href={`/${locale}/products`}
          className="sm:w-auto px-8 font-semibold flex items-center justify-center transition-all"
          style={{ height: '50px', background: '#C9972D', color: '#17130F', borderRadius: '6px', fontSize: '13px', letterSpacing: '0.04em', boxShadow: '0 4px 14px rgba(150,102,21,0.28)' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#B8871F'; el.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#C9972D'; el.style.transform = ''; }}
        >
          {lang === 'en' ? 'Explore Products' : 'Каталог продуктов'}
        </Link>
        <Link
          href={`/${locale}/quote`}
          className="sm:w-auto px-8 font-semibold flex items-center justify-center transition-all"
          style={{ height: '50px', color: '#F7F2E8', border: '1px solid rgba(232,192,94,0.55)', borderRadius: '6px', fontSize: '13px', letterSpacing: '0.04em', background: 'rgba(24,15,6,0.35)', backdropFilter: 'blur(2px)' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E3B84F'; el.style.color = '#E3B84F'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(232,192,94,0.55)'; el.style.color = '#F7F2E8'; }}
        >
          {lang === 'en' ? 'Request a Quote' : 'Запросить предложение'}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
        {[
          { icon: <Wheat size={17} />, label: lang === 'en' ? 'Grains, pulses & oilseeds' : 'Зерновые, бобовые и масличные' },
          { icon: <Package size={17} />, label: lang === 'en' ? 'Flexible bulk packaging' : 'Гибкая оптовая упаковка' },
          { icon: <Globe size={17} />, label: lang === 'en' ? 'International shipment coordination' : 'Координация международных отгрузок' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span style={{ color: '#E3B84F' }}>{s.icon}</span>
            <span style={{ fontSize: '14px', color: 'rgba(247,242,232,0.85)', fontWeight: 500, textShadow: '0 1px 8px rgba(24,14,5,0.4)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section
      ref={heroRef}
      className="hero-section relative overflow-hidden"
      style={{ marginTop: '84px', background: '#2A1A0C' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label={lang === 'en' ? 'The journey of one product' : 'Путь одного продукта'}
    >
      {/* ── MEDIA BAND — exact 3:2 photo ratio so the full image is always visible ── */}
      <div className="relative w-full" style={{ aspectRatio: PHOTO_RATIO }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
          {SLIDES.map((s, i) => {
            const base = import.meta.env.BASE_URL;
            const jpgSrc = `${base}${s.img}`;
            const webpFull = jpgSrc.replace('.jpg', '.webp');
            const webpMobile = jpgSrc.replace('.jpg', '-mobile.webp');
            const jpgMobile = jpgSrc.replace('.jpg', '-mobile.jpg');
            return (
              <div
                key={s.img}
                className="absolute inset-0"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: prefersReducedMotion ? 'none' : `opacity ${FADE_S}s ease-in-out`,
                }}
              >
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${webpMobile} 768w, ${webpFull} 1536w`}
                    sizes="100vw"
                  />
                  <source
                    type="image/jpeg"
                    srcSet={`${jpgMobile} 768w, ${jpgSrc} 1536w`}
                    sizes="100vw"
                  />
                  <img
                    src={jpgSrc}
                    alt=""
                    fetchPriority={i === 0 ? 'high' : undefined}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Text-contrast gradient — desktop overlay only */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{
          background: 'linear-gradient(90deg, rgba(20,16,11,0.62) 0%, rgba(20,16,11,0.42) 26%, rgba(20,16,11,0.20) 46%, rgba(20,16,11,0.00) 64%)',
          zIndex: 2,
        }} />

        {/* ── DESKTOP CONTENT — overlaid on the left of the full photo ── */}
        <div className="absolute inset-0 z-10 hidden lg:flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
            <div className="w-full max-w-[45%]">
              {slideText}
              {fixedContent}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET CONTENT — below the full photo, warm dark panel ── */}
      <div className="lg:hidden relative z-10" style={{ background: 'linear-gradient(180deg, #2A1A0C 0%, #1D120A 100%)', borderTop: '2px solid rgba(201,151,45,0.45)' }}>
        <div className="px-6 sm:px-10 pt-8 pb-9">
          {slideText}
          {fixedContent}
        </div>
      </div>
    </section>
  );
}
