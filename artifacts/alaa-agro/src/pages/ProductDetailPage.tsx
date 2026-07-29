import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Package, Wheat, MessageSquare, Download, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const WA_NUMBER = '79265705777';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(2, "Company is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  message: z.string().min(10, "Message is required")
});
type FormValues = z.infer<typeof formSchema>;

export function ProductDetailPage() {
  const [, params] = useRoute("/:locale/products/:slug");
  const slug = params?.slug;
  const { locale, t } = useLocale();
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const product = products.find(p => p.id === slug || p.slug === slug);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: `I am interested in receiving a quote and specifications for ${product?.name}.`
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone ?? '',
          country: data.country,
          message: data.message,
          productsOfInterest: product?.name ?? '',
          source: 'product_page',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setIsSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setIsSuccess(false);
        reset();
      }, 3500);
    } catch {
      alert(locale === 'en'
        ? 'Submission failed — please reach out via WhatsApp.'
        : 'Ошибка отправки — пожалуйста, напишите нам в WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const productName = locale === 'en' ? product?.name : product?.nameRu;
    const msg = locale === 'en'
      ? `Hello, I am interested in ${productName}. Could you please send me a quote and specifications?`
      : `Здравствуйте, меня интересует ${productName}. Пожалуйста, пришлите коммерческое предложение и спецификацию.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 text-center px-6">
        <h1 className="text-3xl font-serif mb-4 text-foreground">Product not found</h1>
        <Link href={`/${locale}/products`} className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category);
  const catName = category ? (locale === 'en' ? category.name : category.nameRu) : product.category;
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const bgGradient = product.category === 'Grains' ? 'from-amber-100/50' : 
                     product.category === 'Pulses' ? 'from-emerald-100/50' : 
                     product.category === 'Oilseeds' ? 'from-yellow-100/50' :
                     product.category === 'Vegetable Oils' ? 'from-orange-100/50' : 'from-stone-100/50';

  const name = locale === 'en' ? product.name : product.nameRu;
  const nameSec = locale === 'en' ? product.nameRu : product.name;
  const description = locale === 'en' ? product.descriptionEn : product.descriptionRu;
  const application = locale === 'en' ? product.applicationEn : product.applicationRu;
  const highlights = locale === 'en' ? product.highlights : product.highlightsRu;
  const seoTitle = locale === 'en' ? product.seoTitleEn : product.seoTitleRu;
  const seoDesc = locale === 'en' ? product.seoDescEn : product.seoDescRu;

  return (
    <div className="bg-background pb-20">
      <SEOHead title={seoTitle} description={seoDesc} path={`/${locale}/products/${product.slug}`} />

      {/* Hero Section */}
      <section className={`pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b ${bgGradient} to-background border-b border-border relative overflow-hidden`}>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-10">
            <Link href={`/${locale}`} className="hover:text-foreground">{t('nav.home')}</Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-foreground">{t('nav.products')}</Link>
            <span>/</span>
            <Link href={`/${locale}/products?category=${product.category}`} className="hover:text-foreground">{catName}</Link>
            <span>/</span>
            <span className="text-foreground">{name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-card border border-border shadow-sm rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                  {catName}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-2 leading-tight">
                {name}
              </h1>
              <p className="text-2xl text-muted-foreground font-serif italic mb-8">
                {nameSec}
              </p>
              
              <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-10">
                <p>{description}</p>
                <p><strong>{locale === 'en' ? 'Application:' : 'Применение:'}</strong> {application}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-3 bg-card border border-border p-4 rounded-xl">
                    <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium text-sm">{hl}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center text-sm uppercase tracking-wide shadow-lg"
              >
                <MessageSquare size={18} className="mr-2.5" />
                {t('productDetail.requestInfo')}
              </button>
            </div>

            {/* Quick Specs Card */}
            <div className="lg:col-span-5 bg-card rounded-2xl p-8 md:p-10 border border-border shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
              
              <h3 className="font-serif text-3xl text-foreground mb-8 flex items-center gap-3">
                <Wheat className="text-accent" size={28} /> {t('productDetail.specs')}
              </h3>
              
              <div className="space-y-4 mb-10">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-border/50 pb-3">
                    <span className="text-muted-foreground text-sm font-medium">{locale === 'en' ? spec.label : spec.labelRu}</span>
                    <span className="font-bold text-foreground text-right max-w-[60%]">{spec.value}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground italic mb-10">
                * {t('productDetail.disclaimer')}
              </p>
              
              <div className="p-6 bg-background rounded-xl border border-border">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Package className="text-accent" size={18} /> {t('productDetail.packaging')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.packaging.map((pack, i) => (
                    <span key={i} className="px-3 py-1.5 bg-card border border-border rounded text-sm text-foreground font-medium shadow-sm">
                      {pack}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Packaging Section */}
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: '#F3EBDD', borderTop: '1px solid rgba(194,154,61,0.20)', borderBottom: '1px solid rgba(194,154,61,0.12)' }}>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <p className="font-bold uppercase mb-3" style={{ color: '#9A6818', fontSize: '10px', letterSpacing: '0.28em' }}>
              {locale === 'en' ? 'Export-Ready Solutions' : 'Решения для экспорта'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-2" style={{ color: '#2B241C' }}>
              {locale === 'en' ? 'Prepared for International Trade' : 'Готово к международной торговле'}
            </h2>
            <div className="mb-4" style={{ height: '1px', width: '44px', background: 'linear-gradient(90deg, #C29A3D, rgba(194,154,61,0.10))' }} />
            <p className="text-sm max-w-xl" style={{ color: '#7A6450', lineHeight: 1.8 }}>
              {locale === 'en'
                ? product.category === 'Vegetable Oils'
                  ? 'Sunflower oil ships in retail bottles, plastic cans and bulk IBC tanks — sized for every buyer.'
                  : `${name} is available in multiple export formats to suit your logistics requirements.`
                : product.category === 'Vegetable Oils'
                  ? 'Подсолнечное масло поставляется в розничных бутылках, пластиковых канистрах и наливных IBC-контейнерах.'
                  : `${name} доступен в нескольких форматах упаковки для ваших логистических требований.`}
            </p>
          </div>

          {/* Packaging photo cards */}
          {product.category === 'Vegetable Oils' ? (
            /* Oil ships in retail formats (bottles, cans) and bulk IBC tanks.
               Only the container-load photo from the packaging set represents
               oil shipping accurately, so we show it with a text list for the rest. */
            <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.42 }}
                className="flex flex-col overflow-hidden sm:w-72 shrink-0"
                style={{
                  background: '#FFFAF4',
                  border: '1px solid rgba(194,154,61,0.22)',
                  borderTop: '3px solid #C29A3D',
                  borderRadius: '14px',
                  boxShadow: '0 2px 14px rgba(43,36,28,0.07)',
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img
                    src={`${import.meta.env.BASE_URL}packaging/container-load.jpg`}
                    srcSet={`${import.meta.env.BASE_URL}packaging/container-load-480.jpg 480w, ${import.meta.env.BASE_URL}packaging/container-load.jpg 1024w`}
                    sizes="(max-width: 640px) 100vw, 288px"
                    alt={locale === 'en' ? 'Container loading – bulk oil shipment' : 'Загрузка контейнера – навалом'}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,18,13,0.45) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div className="flex flex-col items-center text-center px-3 py-3">
                  <div className="font-serif text-base font-semibold mb-0.5 leading-tight" style={{ color: '#2B241C' }}>{locale === 'en' ? 'Container / Bulk' : 'Контейнер / Навалом'}</div>
                  <div className="text-[11px]" style={{ color: '#7A6450' }}>{locale === 'en' ? 'IBC Tanks · FCL/LCL' : 'IBC-контейнеры · FCL/LCL'}</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.42, delay: 0.08 }}
                className="flex-1 p-6 rounded-2xl"
                style={{ background: '#FFFAF4', border: '1px solid rgba(194,154,61,0.22)', borderTop: '3px solid #C29A3D', boxShadow: '0 2px 14px rgba(43,36,28,0.07)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9A6818' }}>
                  {locale === 'en' ? 'Available Formats' : 'Доступные форматы'}
                </p>
                <div className="space-y-3">
                  {[
                    { label: locale === 'en' ? 'Retail Bottles' : 'Розничные бутылки', detail: '1 L · 5 L PET' },
                    { label: locale === 'en' ? 'Plastic Cans' : 'Пластиковые канистры', detail: '10 L · 20 L' },
                    { label: locale === 'en' ? 'Carton Packs' : 'Картонные упаковки', detail: '3×5 L · 4×5 L' },
                    { label: locale === 'en' ? 'IBC Tanks' : 'IBC-контейнеры', detail: '1,000 L bulk' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'rgba(194,154,61,0.16)' }}>
                      <span className="text-sm font-medium" style={{ color: '#2B241C' }}>{row.label}</span>
                      <span className="text-xs" style={{ color: '#7A6450' }}>{row.detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { format: '25 kg', sub: locale === 'en' ? 'PP Woven Bags' : 'Мешки ПП 25 кг', photo: 'packaging/bag-25kg.jpg' },
                { format: '50 kg', sub: locale === 'en' ? 'PP Woven Bags' : 'Мешки ПП 50 кг', photo: 'packaging/bag-50kg.jpg' },
                { format: locale === 'en' ? 'Pallets' : 'Поддоны', sub: locale === 'en' ? 'Stacked & Wrapped' : 'Паллетирование', photo: 'packaging/pallets.jpg' },
                { format: locale === 'en' ? 'Big Bags' : 'Биг-бэги', sub: locale === 'en' ? '~1,000 kg FIBC' : 'МКР ~1 000 кг', photo: 'packaging/bigbag-fibc.jpg' },
                { format: locale === 'en' ? 'Container' : 'Контейнер', sub: locale === 'en' ? 'Full Loads FCL/LCL' : 'Полная загрузка', photo: 'packaging/container-load.jpg' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.42, delay: i * 0.08 }}
                  className="flex flex-col overflow-hidden transition-all duration-300 cursor-default"
                  style={{
                    background: '#FFFAF4',
                    border: '1px solid rgba(194,154,61,0.22)',
                    borderTop: '3px solid #C29A3D',
                    borderRadius: '14px',
                    boxShadow: '0 2px 14px rgba(43,36,28,0.07)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 10px 28px rgba(43,36,28,0.13)';
                    const img = el.querySelector('img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1.07)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = '';
                    el.style.boxShadow = '0 2px 14px rgba(43,36,28,0.07)';
                    const img = el.querySelector('img') as HTMLElement;
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img
                      src={`${import.meta.env.BASE_URL}${item.photo}`}
                      srcSet={`${import.meta.env.BASE_URL}${item.photo.replace('.jpg', '-480.jpg')} 480w, ${import.meta.env.BASE_URL}${item.photo} 1024w`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      alt={`${item.format} – ${item.sub}`}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,18,13,0.45) 0%, transparent 50%)', pointerEvents: 'none' }} />
                  </div>
                  <div className="flex flex-col items-center text-center px-3 py-3">
                    <div className="font-serif text-base font-semibold mb-0.5 leading-tight" style={{ color: '#2B241C' }}>{item.format}</div>
                    <div className="text-[11px]" style={{ color: '#7A6450' }}>{item.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Packaging section footer — quote CTA + link */}
          <div
            className="mt-10 rounded-2xl px-6 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            style={{ background: 'rgba(194,154,61,0.07)', border: '1px solid rgba(194,154,61,0.22)' }}
          >
            <div>
              <p className="font-serif text-base text-foreground mb-1">
                {locale === 'en'
                  ? `Ready to order ${name}?`
                  : `Готовы заказать ${name}?`}
              </p>
              <p className="text-xs" style={{ color: '#7A6450' }}>
                {locale === 'en'
                  ? 'Tell us your format, quantity and destination — we\'ll send a full offer within 24 hours.'
                  : 'Укажите формат, объём и страну назначения — вышлем коммерческое предложение в течение 24 часов.'}
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-105 hover:shadow-lg active:scale-[0.98]"
                style={{ background: '#C29A3D', color: '#15120D' }}
              >
                <MessageSquare size={15} />
                {locale === 'en' ? 'Request a Quote' : 'Запросить предложение'}
              </button>
              <Link
                href={`/${locale}/packaging`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-accent/10"
                style={{ color: '#C29A3D', border: '1px solid rgba(194,154,61,0.35)' }}
              >
                {locale === 'en' ? 'Packaging details' : 'Об упаковке'}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          <p className="text-xs italic mt-3" style={{ color: '#9A8070' }}>
            * {locale === 'en' ? 'Packaging formats may vary by order quantity and destination requirements.' : 'Форматы упаковки могут варьироваться в зависимости от объёма заказа и требований страны назначения.'}
          </p>
        </div>
      </section>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => { setShowModal(false); setIsSuccess(false); reset(); }}
            />
            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto px-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                      {locale === 'en' ? 'Request Information' : 'Запросить информацию'}
                    </p>
                    <h3 className="text-xl font-serif text-foreground">{name}</h3>
                  </div>
                  <button
                    onClick={() => { setShowModal(false); setIsSuccess(false); reset(); }}
                    className="ml-4 shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col items-center text-center py-14 px-6">
                    <CheckCircle2 className="w-14 h-14 text-accent mb-5" />
                    <h3 className="text-2xl font-serif text-foreground mb-2">{t('forms.success')}</h3>
                    <p className="text-muted-foreground text-sm">{locale === 'en' ? 'We will be in touch shortly.' : 'Мы свяжемся с вами в ближайшее время.'}</p>
                  </div>
                ) : (
                  <div className="p-6 space-y-5">

                    {/* WhatsApp primary CTA */}
                    <button
                      onClick={openWhatsApp}
                      className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-white text-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
                      style={{ background: '#25D366' }}
                    >
                      {/* WhatsApp icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {locale === 'en' ? 'Send inquiry via WhatsApp' : 'Отправить запрос через WhatsApp'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {locale === 'en' ? 'or fill in the form below' : 'или заполните форму ниже'}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Email form */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">{t('forms.fullName')} *</label>
                          <input {...register("name")} className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30" />
                          {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">{t('forms.company')} *</label>
                          <input {...register("company")} className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30" />
                          {errors.company && <span className="text-xs text-destructive mt-1 block">{errors.company.message}</span>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">{t('forms.email')} *</label>
                          <input {...register("email")} type="email" className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30" />
                          {errors.email && <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">{t('forms.country')} *</label>
                          <input {...register("country")} className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30" />
                          {errors.country && <span className="text-xs text-destructive mt-1 block">{errors.country.message}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{t('forms.message')} *</label>
                        <textarea
                          {...register("message")}
                          rows={3}
                          className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
                        />
                        {errors.message && <span className="text-xs text-destructive mt-1 block">{errors.message.message}</span>}
                      </div>
                      <div className="flex justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => { setShowModal(false); reset(); }}
                          className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                        >
                          {t('forms.cancel')}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-7 py-2.5 text-sm bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                            ? (locale === 'en' ? 'Sending…' : 'Отправка…')
                            : t('forms.submit')}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-4xl font-serif text-foreground mb-12">{t('productDetail.related')} {catName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
