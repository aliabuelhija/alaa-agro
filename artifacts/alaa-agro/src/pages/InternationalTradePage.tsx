import React, { useEffect, useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../i18n';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'wouter';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { ArrowRight, MessageSquareText, FileSignature, PackageCheck, Ship, CheckSquare, FileText, Package, Truck, Handshake } from 'lucide-react';

const GOLD = '#C29A3D';

const processSteps = [
  {
    icon: MessageSquareText,
    en: {
      title: 'Inquiry',
      desc: 'Send us your product, volume and destination. We respond within one business day with availability and indicative terms.',
    },
    ru: {
      title: 'Запрос',
      desc: 'Отправьте нам продукт, объём и направление. Мы ответим в течение одного рабочего дня с наличием и предварительными условиями.',
    },
    ar: {
      title: 'الاستفسار',
      desc: 'أرسل لنا المنتج والكمية وجهة الوصول. نرد خلال يوم عمل واحد بالتوافر والشروط الإرشادية.',
    },
  },
  {
    icon: FileSignature,
    en: {
      title: 'Quotation',
      desc: 'You receive a formal offer with specifications, Incoterms, packaging options and payment terms — ready for contract.',
    },
    ru: {
      title: 'Коммерческое предложение',
      desc: 'Вы получаете официальное предложение со спецификациями, Инкотермс, вариантами упаковки и условиями оплаты.',
    },
    ar: {
      title: 'عرض السعر',
      desc: 'تستلم عرضاً رسمياً يتضمن المواصفات وشروط إنكوترمز وخيارات التعبئة وشروط الدفع — جاهزاً للتعاقد.',
    },
  },
  {
    icon: PackageCheck,
    en: {
      title: 'Preparation',
      desc: 'Goods are selected, quality-checked and packed in branded export packaging with full documentation prepared.',
    },
    ru: {
      title: 'Подготовка',
      desc: 'Товар отбирается, проходит контроль качества и упаковывается в фирменную экспортную упаковку с полным пакетом документов.',
    },
    ar: {
      title: 'التحضير',
      desc: 'يتم انتقاء السلع وفحص جودتها وتعبئتها في عبوات تصدير تحمل علامتنا، مع إعداد المستندات كاملة.',
    },
  },
  {
    icon: Ship,
    en: {
      title: 'Delivery',
      desc: 'Shipment is loaded and dispatched by road, rail or sea, with tracking and support until it reaches your warehouse.',
    },
    ru: {
      title: 'Доставка',
      desc: 'Груз отправляется автомобильным, железнодорожным или морским транспортом — с отслеживанием и поддержкой до вашего склада.',
    },
    ar: {
      title: 'التسليم',
      desc: 'تُحمّل الشحنة وتُرسل براً أو بالسكك الحديدية أو بحراً، مع التتبع والدعم حتى وصولها إلى مستودعكم.',
    },
  },
];

// Position of each step's icon along the line (0..1)
const STEP_POSITIONS = [0, 1 / 3, 2 / 3, 1];
const HIGHLIGHT_WINDOW = 0.07; // how close the pulse must be to light a step
const LOOP_DURATION = 5.5; // seconds per full journey

function ProcessStep({
  step,
  index,
  locale,
  highlighted,
}: {
  step: (typeof processSteps)[number];
  index: number;
  locale: Locale;
  highlighted: boolean;
}) {
  const content = step[locale];
  const Icon = step.icon;

  return (
    <div className="relative z-10 flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 lg:text-center group">
      <motion.div
        className="w-[70px] h-[70px] lg:w-[104px] lg:h-[104px] shrink-0 rounded-full bg-card border flex items-center justify-center cursor-default"
        initial={false}
        animate={{
          scale: highlighted ? 1.06 : 1,
          borderColor: highlighted ? 'rgba(194,154,61,0.85)' : 'rgba(194,154,61,0.4)',
          boxShadow: highlighted
            ? '0 0 0 1px rgba(194,154,61,0.15), 0 0 30px rgba(194,154,61,0.35)'
            : '0 0 0 0 rgba(194,154,61,0)',
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 20, mass: 0.8 }}
        whileHover={{
          y: -5,
          borderColor: 'rgba(194,154,61,0.95)',
          boxShadow: '0 14px 40px rgba(44,31,14,0.14), 0 0 34px rgba(194,154,61,0.32)',
        }}
      >
        <Icon size={30} className="text-accent lg:hidden" strokeWidth={1.25} />
        <Icon size={40} className="text-accent hidden lg:block" strokeWidth={1.25} />
      </motion.div>

      <div className="lg:mt-5">
        <span
          className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1 transition-colors duration-500"
          style={{ color: highlighted ? GOLD : 'rgba(194,154,61,0.6)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-serif text-foreground mb-2">{content.title}</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs">{content.desc}</p>
      </div>
    </div>
  );
}

function TravellingPulse({ orientation, progress }: { orientation: 'h' | 'v'; progress: any }) {
  const pos = useTransform(progress, (v: number) => `${v * 100}%`);
  // Fade out at the very end, fade in at the start, for a smooth restart
  const opacity = useTransform(progress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full"
      style={{
        ...(orientation === 'h'
          ? { left: pos, top: '50%', translateY: '-50%', translateX: '-50%' }
          : { top: pos, left: '50%', translateX: '-50%', translateY: '-50%' }),
        opacity,
        backgroundColor: GOLD,
        boxShadow: '0 0 12px 3px rgba(194,154,61,0.55)',
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: 'rgba(194,154,61,0.45)' }}
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

function ExportProcessSection({ locale }: { locale: Locale }) {
  const reducedMotion = useReducedMotion() ?? false;
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const progress = useMotionValue(0);

  // Continuous ambient loop: 0 → 1 over ~5.5s, brief rest, then restart.
  // framer-motion drives this via requestAnimationFrame, which browsers
  // throttle/pause automatically when the tab is inactive.
  useEffect(() => {
    if (reducedMotion) return;
    const controls = animate(progress, [0, 1], {
      duration: LOOP_DURATION,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0.6,
    });
    return () => controls.stop();
  }, [reducedMotion, progress]);

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = STEP_POSITIONS.findIndex((p) => Math.abs(v - p) < HIGHLIGHT_WINDOW);
    setHighlightedIndex((prev) => (prev === idx ? prev : idx));
  });

  return (
    <section className="py-10 md:py-14 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="relative">
          {/* Desktop connecting line — always visible, static */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(194,154,61,0.2), rgba(194,154,61,0.55) 20%, rgba(194,154,61,0.55) 80%, rgba(194,154,61,0.2))' }}
            />
            {!reducedMotion && <TravellingPulse orientation="h" progress={progress} />}
          </div>

          {/* Mobile connecting line (vertical) — always visible, static */}
          <div className="lg:hidden absolute left-[35px] top-8 bottom-8 w-px">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(194,154,61,0.2), rgba(194,154,61,0.5) 20%, rgba(194,154,61,0.5) 80%, rgba(194,154,61,0.2))' }}
            />
            {!reducedMotion && <TravellingPulse orientation="v" progress={progress} />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8">
            {processSteps.map((step, i) => (
              <ProcessStep
                key={i}
                step={step}
                index={i}
                locale={locale}
                highlighted={!reducedMotion && i === highlightedIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InternationalTradePage() {
  const { locale, t, pick } = useLocale();

  return (
    <div className="bg-background pt-[82px]">
      <SEOHead
        title={`${t('nav.trade')} | ALAA AGRO`}
        description={t('tradeProcess.title')}
        path={`/${locale}/trade`}
      />

      {/* Hero — branded export scene */}
      {/* Title band — separate from the hero image */}
      <section className="pt-10 md:pt-14 pb-8 text-center px-6 bg-card border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            {pick({ en: 'Export Process', ru: 'Экспортный процесс', ar: 'عملية التصدير' })}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-3 leading-tight">{t('tradeProcess.title')}</h1>
          <p className="text-base md:text-lg text-muted-foreground font-light">
            {pick({ en: 'A clear, transparent process for international B2B buyers.', ru: 'Понятный и прозрачный процесс для международных B2B-покупателей.', ar: 'عملية واضحة وشفافة للمشترين الدوليين.' })}
          </p>
        </div>
      </section>

      {/* Hero image — contained, full picture visible, no crop */}
      <section className="bg-card pb-10 md:pb-14 px-6">
        <div className="container mx-auto max-w-4xl">
          <div
            className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(44,31,14,0.18)]"
            style={{ border: '1px solid rgba(194,154,61,0.35)' }}
          >
            <img
              src="/trade/trade-hero.jpg"
              alt={pick({ en: 'ALAA AGRO branded export logistics — port, container ship and trade routes from Moscow', ru: 'Экспортная логистика ALAA AGRO — порт, контейнеровоз и торговые маршруты из Москвы', ar: 'الخدمات اللوجستية للتصدير لدى ALAA AGRO — الميناء وسفن الحاويات وطرق التجارة من موسكو' })}
              className="block w-full h-auto"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(21,18,13,0.08), transparent 25%)' }}
            />
          </div>
        </div>
      </section>

      {/* Process cards — ambient animated */}
      <ExportProcessSection locale={locale} />

      {/* Why work with us — compact */}
      <section className="py-10 md:py-12 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-8 text-center">{t('why.title')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: CheckSquare, title: t('why.selected'), desc: t('why.selectedDesc') },
              { icon: FileText, title: t('why.specs'), desc: t('why.specsDesc') },
              { icon: Package, title: t('why.packaging'), desc: t('why.packagingDesc') },
              { icon: Truck, title: t('why.shipment'), desc: t('why.shipmentDesc') },
              { icon: Handshake, title: t('why.partnership'), desc: t('why.partnershipDesc') },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-3 bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <feature.icon size={24} className="text-accent" strokeWidth={1.5} />
                <h4 className="text-base font-serif text-white leading-snug">{feature.title}</h4>
                <p className="text-white/60 leading-relaxed font-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="relative overflow-hidden py-14 md:py-20 px-6" style={{ backgroundColor: '#1E241C' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(194,154,61,0.18), transparent 60%)' }}
        />
        <div className="relative container mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 h-px w-16" style={{ backgroundColor: 'rgba(194,154,61,0.7)' }} />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
            {pick({ en: 'Ready to start your shipment?', ru: 'Готовы начать поставку?', ar: 'جاهز لبدء شحنتك؟' })}
          </h2>
          <p className="text-white/60 font-light mb-8 max-w-xl mx-auto">
            {pick({ en: 'Tell us what you need — product, volume and destination — and receive a formal quotation within one business day.', ru: 'Сообщите нам, что вам нужно — продукт, объём и направление — и получите официальное предложение в течение одного рабочего дня.', ar: 'أخبرنا بما تحتاجه — المنتج والكمية وجهة الوصول — واستلم عرض سعر رسمياً خلال يوم عمل واحد.' })}
          </p>
          <Link
            href={`/${locale}/quote`}
            className="inline-flex items-center px-10 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-all hover:shadow-[0_8px_30px_rgba(194,154,61,0.35)] uppercase tracking-wide text-sm"
          >
            {t('quoteCta.primary')} <ArrowRight size={18} className="ms-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
