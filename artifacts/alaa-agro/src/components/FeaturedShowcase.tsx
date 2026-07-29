import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const AUTOPLAY_MS = 6000;

type ShowcaseItem = {
  id: string;
  slug: string;
  bag: string;
  name: { en: string; ru: string };
  spec: { en: string; ru: string };
  packaging: { en: string; ru: string };
};

const ITEMS: ShowcaseItem[] = [
  {
    id: 'wheat', slug: 'wheat', bag: 'showcase/bag-wheat.png',
    name: { en: 'Wheat', ru: 'Пшеница' },
    spec: { en: 'Protein 11.5–14.0% · Gluten 23–30%', ru: 'Белок 11,5–14,0% · Клейковина 23–30%' },
    packaging: { en: 'PP bags 25/50 kg · Big bags · Bulk', ru: 'Мешки ПП 25/50 кг · Биг-бэги · Насыпью' },
  },
  {
    id: 'corn', slug: 'corn', bag: 'showcase/bag-corn.png',
    name: { en: 'Corn / Maize', ru: 'Кукуруза' },
    spec: { en: 'Moisture max 14% · Feed & food grades', ru: 'Влажность до 14% · Кормовая и пищевая' },
    packaging: { en: 'PP bags 25/50 kg · Big bags · Bulk', ru: 'Мешки ПП 25/50 кг · Биг-бэги · Насыпью' },
  },
  {
    id: 'chickpeas', slug: 'chickpeas', bag: 'showcase/bag-chickpeas.png',
    name: { en: 'Chickpeas', ru: 'Нут' },
    spec: { en: 'Calibre 6–9 mm · Hand-pick quality', ru: 'Калибр 6–9 мм · Ручная очистка' },
    packaging: { en: 'PP bags 25/50 kg · Big bags', ru: 'Мешки ПП 25/50 кг · Биг-бэги' },
  },
  {
    id: 'lentils', slug: 'lentils', bag: 'showcase/bag-lentils.png',
    name: { en: 'Lentils', ru: 'Чечевица' },
    spec: { en: 'Red & green varieties · Purity ≥99%', ru: 'Красная и зелёная · Чистота ≥99%' },
    packaging: { en: 'PP bags 25/50 kg · Big bags', ru: 'Мешки ПП 25/50 кг · Биг-бэги' },
  },
  {
    id: 'flaxseed', slug: 'brown-flaxseed', bag: 'showcase/bag-flaxseed.png',
    name: { en: 'Flaxseed', ru: 'Лён' },
    spec: { en: 'Oil content ≥40% · Purity ≥99%', ru: 'Масличность ≥40% · Чистота ≥99%' },
    packaging: { en: 'PP bags 25/50 kg · Big bags', ru: 'Мешки ПП 25/50 кг · Биг-бэги' },
  },
  {
    id: 'sunflower-seeds', slug: 'sunflower-seeds', bag: 'showcase/bag-sunflower-seeds.png',
    name: { en: 'Sunflower Seeds', ru: 'Семена подсолнечника' },
    spec: { en: 'Confectionery & oil grades', ru: 'Кондитерские и масличные сорта' },
    packaging: { en: 'PP bags 25/50 kg · Big bags', ru: 'Мешки ПП 25/50 кг · Биг-бэги' },
  },
];

const N = ITEMS.length;
const mod = (n: number) => ((n % N) + N) % N;

export function FeaturedShowcase() {
  const { locale } = useLocale();
  const lang = (locale === 'ru' ? 'ru' : 'en') as 'en' | 'ru';
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);

  const next = useCallback(() => setIndex(i => mod(i + 1)), []);
  const prev = useCallback(() => setIndex(i => mod(i - 1)), []);

  // Autoplay every 6s; pause on hover, off-viewport, or reduced motion
  useEffect(() => {
    if (hovered || focused || !inView || prefersReducedMotion) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hovered, focused, inView, prefersReducedMotion, next]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([e]) => setInView(e.intersectionRatio >= 0.15), { threshold: [0, 0.15] });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drag / swipe (pointer events cover mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragged.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) dragged.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  const active = ITEMS[index];

  // Relative offset in [-2..3] for coverflow placement
  const rel = (i: number) => {
    let d = mod(i - index);
    if (d > N / 2) d -= N;
    return d;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ borderTop: '3px solid #C29A3D', borderBottom: '1px solid rgba(194,154,61,0.20)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
      aria-roledescription="carousel"
      aria-label={lang === 'en' ? 'Selected export products' : 'Избранные экспортные товары'}
    >
      {/* Wheat-field sunset background + warm dark overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}hero-wheat-golden.jpg`}
          alt=""
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(24,14,5,0.88) 0%, rgba(32,20,8,0.78) 40%, rgba(20,12,4,0.90) 100%)',
        }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-6 sm:px-10 lg:px-16 py-14 lg:py-0 lg:min-h-[700px] lg:flex lg:items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-10 lg:gap-8 items-center w-full">

          {/* ── LEFT — editorial text ── */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-7 shrink-0" style={{ background: '#E3B84F' }} />
              <span className="uppercase" style={{ color: '#E8C05E', fontSize: '10px', letterSpacing: '0.24em', fontWeight: 600 }}>
                {lang === 'en' ? 'Selected Export Products' : 'Избранные экспортные товары'}
              </span>
            </div>
            <h2 className="font-serif mb-5" style={{ fontSize: 'clamp(1.9rem, 2.6vw, 2.8rem)', lineHeight: 1.15, color: '#F7F2E8' }}>
              {lang === 'en' ? 'Frequently Requested Commodities' : 'Часто запрашиваемые товары'}
            </h2>
            <p className="mb-8" style={{ fontSize: '0.98rem', lineHeight: 1.75, maxWidth: '400px', color: 'rgba(247,242,232,0.78)' }}>
              {lang === 'en'
                ? 'A focused selection of grains, pulses and oilseeds our buyers order most — cleaned, sorted and packed under the ALAA AGRO brand.'
                : 'Подборка зерновых, бобовых и масличных, которые чаще всего заказывают наши покупатели — очищенные, отсортированные и упакованные под брендом ALAA AGRO.'}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2.5 px-8 font-semibold transition-all"
              style={{ height: '52px', background: '#C9972D', color: '#17130F', borderRadius: '6px', fontSize: '13px', letterSpacing: '0.04em', boxShadow: '0 4px 14px rgba(150,102,21,0.30)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#B8871F'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9972D'; }}
            >
              {lang === 'en' ? 'View Complete Catalogue' : 'Полный каталог'}
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* ── RIGHT — coverflow carousel ── */}
          <div className="select-none">
            <div
              className="relative touch-pan-y cursor-grab active:cursor-grabbing"
              style={{ height: 'clamp(300px, 36vw, 400px)', perspective: '1200px' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => { dragStartX.current = null; }}
            >
              {ITEMS.map((item, i) => {
                const d = rel(i);
                const visible = Math.abs(d) <= 1;
                return (
                  <div
                    key={item.id}
                    className="absolute left-1/2 top-1/2"
                    onClick={() => { if (!dragged.current && d !== 0) setIndex(i); }}
                    style={{
                      transform: `translate(-50%, -50%) translateX(${d * 62}%) scale(${d === 0 ? 1 : 0.75}) rotateY(${d * -18}deg)`,
                      opacity: visible ? (d === 0 ? 1 : 0.55) : 0,
                      pointerEvents: visible ? 'auto' : 'none',
                      zIndex: d === 0 ? 3 : 2,
                      transition: prefersReducedMotion ? 'none' : 'transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.65s ease',
                      height: '100%',
                      cursor: d === 0 ? 'grab' : 'pointer',
                      filter: d === 0 ? 'drop-shadow(0 22px 30px rgba(0,0,0,0.45))' : 'drop-shadow(0 12px 18px rgba(0,0,0,0.35))',
                    }}
                    aria-hidden={d !== 0}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${item.bag}`}
                      alt={d === 0 ? item.name[lang] : ''}
                      draggable={false}
                      style={{ height: '100%', width: 'auto', display: 'block' }}
                    />
                  </div>
                );
              })}

              {/* Arrows */}
              <button
                type="button"
                aria-label={lang === 'en' ? 'Previous product' : 'Предыдущий товар'}
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(232,192,94,0.15)]"
                style={{ border: '1px solid rgba(232,192,94,0.45)', color: '#E3B84F', background: 'rgba(20,12,4,0.35)', backdropFilter: 'blur(2px)' }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label={lang === 'en' ? 'Next product' : 'Следующий товар'}
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(232,192,94,0.15)]"
                style={{ border: '1px solid rgba(232,192,94,0.45)', color: '#E3B84F', background: 'rgba(20,12,4,0.35)', backdropFilter: 'blur(2px)' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* ── INFO PANEL — under the active bag ── */}
            <div className="mt-6 mx-auto max-w-[540px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="px-6 py-5 rounded-xl"
                  style={{
                    background: 'rgba(20,12,4,0.55)',
                    border: '1px solid rgba(232,192,94,0.28)',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.30)',
                  }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2.5">
                    <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#F7F2E8' }}>{active.name[lang]}</h3>
                    <span className="uppercase" style={{ fontSize: '10px', letterSpacing: '0.18em', fontWeight: 600, color: '#E8C05E' }}>
                      {lang === 'en' ? 'Origin: Russia' : 'Происхождение: Россия'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'rgba(247,242,232,0.82)', lineHeight: 1.6 }}>{active.spec[lang]}</p>
                  <p className="mb-4" style={{ fontSize: '12.5px', color: 'rgba(247,242,232,0.62)', lineHeight: 1.6 }}>{active.packaging[lang]}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      href={`/${locale}/products/${active.slug}`}
                      className="group inline-flex items-center gap-1.5 font-semibold"
                      style={{ fontSize: '12.5px', color: '#E3B84F', borderBottom: '1px solid rgba(232,192,94,0.35)', paddingBottom: '1px' }}
                    >
                      {lang === 'en' ? 'View Specifications' : 'Смотреть спецификации'}
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href={`/${locale}/quote`}
                      className="group inline-flex items-center gap-1.5 font-semibold"
                      style={{ fontSize: '12.5px', color: '#F7F2E8', borderBottom: '1px solid rgba(247,242,232,0.30)', paddingBottom: '1px' }}
                    >
                      {lang === 'en' ? 'Request a Quote' : 'Запросить предложение'}
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
