import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { Link } from 'wouter';
import { SEOHead } from '../components/SEOHead';

const ALL = 'All';

export function ProductsPage() {
  const { locale, t } = useLocale();
  const queryParams = new URLSearchParams(window.location.search);
  const initialCategory = queryParams.get('category') || ALL;

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter((p) => {
    const catOk = activeCategory === ALL || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const nameOk = !q || p.name.toLowerCase().includes(q) || p.nameRu.toLowerCase().includes(q);
    return catOk && nameOk;
  });

  const tabs = [
    { id: ALL, labelEn: 'All Products', labelRu: 'Все продукты' },
    ...categories.map((c) => ({ id: c.id, labelEn: c.name, labelRu: c.nameRu })),
  ];

  return (
    <div className="bg-background min-h-screen" style={{ paddingTop: '82px' }}>
      <SEOHead
        title={`${t('productsPage.title')} | ALAA AGRO TRADE LLC`}
        description={t('productsPage.desc')}
        path={`/${locale}/products`}
      />

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#1A1200] border-b border-white/10">
        <div className="container mx-auto px-5 sm:px-6 py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-white/40 mb-5">
            <Link href={`/${locale}`} className="hover:text-white/70 transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-white/70">{t('nav.products')}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#C29A3D' }}>
                {locale !== 'ru' ? 'Product Catalogue' : 'Каталог продукции'}
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">
                {t('productsPage.title')}
              </h1>
            </div>
            <Link
              href={`/${locale}/quote`}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all"
              style={{ background: '#C29A3D', color: '#1A1200' }}
            >
              {t('nav.quote')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="container mx-auto px-5 sm:px-6">
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {tabs.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className="relative shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none"
                  style={{ color: active ? '#C29A3D' : 'rgba(255,255,255,0.5)' }}
                >
                  {locale === 'ru' ? tab.labelRu : tab.labelEn}
                  {active && (
                    <motion.div
                      layoutId="cat-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: '#C29A3D' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SEARCH + RESULTS ── */}
      <div className="container mx-auto px-5 sm:px-6 py-8 md:py-10">

        {/* Search bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? t('productsPage.product') : t('productsPage.products')}
          </p>
          <div className="relative w-56 sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder={t('productsPage.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-8 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-xl mt-4">
            <p className="text-lg font-serif text-foreground mb-2">{t('productsPage.noResults')}</p>
            <p className="text-sm text-muted-foreground mb-6">{t('productsPage.tryAdjusting')}</p>
            <button
              onClick={() => { setActiveCategory(ALL); setSearchQuery(''); }}
              className="px-5 py-2 text-sm border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded transition-colors"
            >
              {t('productsPage.clear')}
            </button>
          </div>
        )}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="container mx-auto px-5 sm:px-6 pb-20">
        <div className="rounded-xl bg-[#1A1200] border border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: '#C29A3D' }}>
              {locale !== 'ru' ? 'Ready to order?' : 'Готовы к заказу?'}
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-white">{t('quoteCta.help')}</h3>
            <p className="text-white/60 text-sm mt-1">{t('quoteCta.body')}</p>
          </div>
          <Link
            href={`/${locale}/quote`}
            className="shrink-0 px-8 py-3 rounded font-semibold text-sm inline-flex items-center gap-2 transition-all"
            style={{ background: '#C29A3D', color: '#1A1200' }}
          >
            {t('quoteCta.primary')} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
