import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'wouter';

const STEPS = [
  { img: 'hero-seeds.jpg',              pos: 'center 50%' },
  { img: 'gost-certificate.jpg',        pos: 'center 40%' },
  { img: 'hero-bags-clean.jpg',         pos: 'center 50%' },
  { img: 'packaging/container-load.jpg',pos: 'center 55%' },
];

export function QualityPage() {
  const { locale, t } = useLocale();

  return (
    <div className="bg-background pt-[82px] pb-12">
      <SEOHead 
        title={`${t('qualityPage.title')} | ALAA AGRO`} 
        description={t('qualityPage.intro')}
        path={`/${locale}/quality`}
      />
      
      <section className="py-10 md:py-14 text-center px-6 border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-5 leading-tight">{t('qualityPage.title')}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
            {t('qualityPage.intro')}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-5xl">

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              {locale !== 'ru' ? 'Our Process' : 'Наш процесс'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">{t('qualityPage.focusTitle')}</h2>
          </div>

          <div className="flex flex-col gap-0 mb-14 rounded-2xl overflow-hidden border border-border shadow-sm">
            {[
              { title: t('qualityPage.f1'), desc: t('qualityPage.f1d') },
              { title: t('qualityPage.f2'), desc: t('qualityPage.f2d') },
              { title: t('qualityPage.f3'), desc: t('qualityPage.f3d') },
              { title: t('qualityPage.f4'), desc: t('qualityPage.f4d') },
            ].map((f, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row group border-b border-border last:border-0"
              >
                {/* Photo */}
                <div className="md:w-56 lg:w-72 shrink-0 h-52 md:h-auto overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}${STEPS[i].img}`}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: STEPS[i].pos }}
                    loading="lazy"
                  />
                </div>
                {/* Text */}
                <div className="flex gap-5 p-6 md:p-8 bg-card flex-1 items-start">
                  <span
                    className="shrink-0 text-5xl font-serif leading-none mt-0.5 select-none"
                    style={{ color: 'rgba(194,154,61,0.28)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3 leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-light">
                      {f.desc}
                    </p>
                    {i === 1 && (
                      <div className="flex items-start gap-3 mt-5 bg-background border border-border rounded-xl p-4">
                        <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                          <span className="text-base font-bold text-accent leading-none">ГОСТ</span>
                          <span className="text-xs text-muted-foreground">/GOST</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{t('qualityPage.certBadge')}</p>
                          <p className="text-muted-foreground text-xs mt-1">{t('qualityPage.certNote')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


          <div className="bg-secondary text-secondary-foreground p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent mix-blend-overlay" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-serif mb-6">{t('qualityProcess.title')}</h3>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                {t('qualityPage.viewSpecs')}
              </p>
              <Link 
                href={`/${locale}/products`}
                className="inline-flex items-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm"
              >
                {t('nav.products')} <ArrowRight size={18} className="ms-2" />
              </Link>
            </div>
            {/* Certificates section */}
          </div>

        </div>
      </section>
    </div>
  );
}
