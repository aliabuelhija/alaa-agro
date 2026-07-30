import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { CheckCircle2, ChevronRight, ChevronLeft, Building2, PackageSearch, FileText, ArrowRight } from 'lucide-react';
import { products } from '../data/products';

const WA_CONTACTS = [
  { number: '79265705777', nameEn: 'Alaa Noufal', nameRu: 'Алаа Ноуфал', phone: '+7 (926) 570-57-77' },
];

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const step1Schema = z.object({
  fullName: z.string().min(2, "Required"),
  company: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().min(2, "Required"),
  website: z.string().optional(),
});

const step2Schema = z.object({
  productsOfInterest: z.array(z.string()).min(1, "Select at least one product"),
  quantity: z.string().optional(),
  packaging: z.string().optional(),
  destCountry: z.string().min(2, "Required"),
  destPort: z.string().optional(),
  incoterm: z.string().optional(),
  reqSpecs: z.string().optional(),
  reqDocs: z.string().optional(),
  expDate: z.string().optional(),
});

const step3Schema = z.object({
  buyerType: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Consent required")
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormValues = z.infer<typeof formSchema>;

export function QuotePage() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, trigger, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { productsOfInterest: [] }
  });

  const selectedProducts = watch('productsOfInterest');

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["fullName", "company", "email", "country"]);
    if (step === 2) valid = await trigger(["productsOfInterest", "destCountry"]);
    
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('server_error');
      }
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError(
        locale !== 'ru'
          ? 'We could not send your request. Please try again or contact us directly on WhatsApp.'
          : 'Не удалось отправить запрос. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую в WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
      <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -translate-y-1/2 z-0" />
      <div className="absolute left-0 top-1/2 h-[2px] bg-accent -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      
      {[
        { num: 1, icon: Building2, label: t('quotePage.step1') },
        { num: 2, icon: PackageSearch, label: t('quotePage.step2') },
        { num: 3, icon: FileText, label: t('quotePage.step3') }
      ].map((s) => (
        <div key={s.num} className="relative z-10 flex flex-col items-center gap-3 bg-background px-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
            step >= s.num ? 'bg-accent border-accent text-accent-foreground' : 'bg-card border-border text-muted-foreground'
          }`}>
            <s.icon size={20} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <SEOHead 
        title={`${t('nav.quote')} | ALAA AGRO`} 
        description={t('quotePage.desc')}
        path={`/${locale}/quote`}
      />

      <div className="container mx-auto px-6 max-w-4xl pt-8">
        
        {isSuccess ? (
          <div className="bg-card border border-border p-12 md:p-20 rounded-3xl text-center shadow-xl mt-12">
            <CheckCircle2 className="w-24 h-24 text-accent mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">{t('forms.success')}</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
              {locale !== 'ru' 
                ? 'Thank you for your request. Our commercial team will review your requirements and contact you shortly.'
                : 'Спасибо за ваш запрос. Наша коммерческая команда изучит ваши требования и свяжется с вами в ближайшее время.'}
            </p>

            {/* WhatsApp follow-up */}
            <div className="max-w-md mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
                {locale !== 'ru' ? 'Want to follow up? Reach us on WhatsApp' : 'Хотите уточнить детали? Напишите нам в WhatsApp'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {WA_CONTACTS.map(c => {
                  const msg = locale !== 'ru'
                    ? `Hello, I have just submitted a quote request on the ALAA AGRO website and would like to follow up.`
                    : `Здравствуйте, я только что отправил запрос на коммерческое предложение на сайте АЛАА АГРО и хотел бы уточнить детали.`;
                  return (
                    <a
                      key={c.number}
                      href={`https://wa.me/${c.number}?text=${encodeURIComponent(msg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                      style={{ borderColor: 'rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.05)' }}
                    >
                      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white transition-transform group-hover:scale-105" style={{ background: '#25D366' }}>
                        <WhatsAppIcon />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {locale !== 'ru' ? c.nameEn : c.nameRu}
                        </p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                      </div>
                      <ArrowRight size={14} className="ms-auto shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t('quotePage.title')}</h1>
              <p className="text-muted-foreground">{t('quotePage.desc')}</p>
            </div>

            {/* WhatsApp quick contact */}
            <div className="mb-10 bg-card border border-border rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
                {locale !== 'ru' ? 'Fastest response — WhatsApp' : 'Быстрый ответ — WhatsApp'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WA_CONTACTS.map(c => {
                  const msg = locale !== 'ru'
                    ? `Hello, I would like to submit a quote request for ALAA AGRO products.`
                    : `Здравствуйте, я хотел бы отправить запрос на коммерческое предложение по продукции АЛАА АГРО.`;
                  return (
                    <a
                      key={c.number}
                      href={`https://wa.me/${c.number}?text=${encodeURIComponent(msg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                      style={{ borderColor: 'rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.05)' }}
                    >
                      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white transition-transform group-hover:scale-105" style={{ background: '#25D366' }}>
                        <WhatsAppIcon />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {locale !== 'ru' ? c.nameEn : c.nameRu}
                        </p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                      </div>
                      <ArrowRight size={14} className="ms-auto shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground px-1">
                  {locale !== 'ru' ? 'or fill in the form below' : 'или заполните форму ниже'}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>

            <StepIndicator />

            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-lg">
              
              {/* STEP 1 */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-serif mb-8 border-b border-border pb-4">{t('quotePage.step1')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.fullName')} *</label>
                    <input {...register("fullName")} className={`w-full px-4 py-3 bg-background border ${errors.fullName ? 'border-destructive' : 'border-border'} rounded focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.company')} *</label>
                    <input {...register("company")} className={`w-full px-4 py-3 bg-background border ${errors.company ? 'border-destructive' : 'border-border'} rounded focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.email')} *</label>
                    <input type="email" {...register("email")} className={`w-full px-4 py-3 bg-background border ${errors.email ? 'border-destructive' : 'border-border'} rounded focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.phone')}</label>
                    <input {...register("phone")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.whatsapp')}</label>
                    <input {...register("whatsapp")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.country')} *</label>
                    <input {...register("country")} className={`w-full px-4 py-3 bg-background border ${errors.country ? 'border-destructive' : 'border-border'} rounded focus:outline-none focus:border-accent`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">{t('quotePage.website')}</label>
                    <input {...register("website")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-serif mb-8 border-b border-border pb-4">{t('quotePage.step2')}</h2>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-4">{t('quotePage.productsLabel')} * <span className="text-xs text-muted-foreground font-normal ms-2">({t('quotePage.productsHint')})</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {products.map(p => (
                      <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedProducts.includes(p.name) ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent/50'}`}>
                        <input type="checkbox" value={p.name} {...register("productsOfInterest")} className="accent-accent" />
                        <span className="text-sm font-medium">{locale !== 'ru' ? p.name : p.nameRu}</span>
                      </label>
                    ))}
                  </div>
                  {errors.productsOfInterest && <p className="text-destructive text-sm mt-2">{errors.productsOfInterest.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.quantity')}</label>
                    <input {...register("quantity")} placeholder="e.g. 500 MT" className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.packagingLabel')}</label>
                    <select {...register("packaging")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent">
                      <option value="">{t('quotePage.selectFormat')}</option>
                      <option value="25kg bags">{t('quotePage.packagingOptions.bags25')}</option>
                      <option value="50kg bags">{t('quotePage.packagingOptions.bags50')}</option>
                      <option value="Big bags">{t('quotePage.packagingOptions.bigBags')}</option>
                      <option value="Container bulk">{t('quotePage.packagingOptions.container')}</option>
                      <option value="Other">{t('quotePage.packagingOptions.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.destCountry')} *</label>
                    <input {...register("destCountry")} className={`w-full px-4 py-3 bg-background border ${errors.destCountry ? 'border-destructive' : 'border-border'} rounded focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.destPort')}</label>
                    <input {...register("destPort")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.incoterm')}</label>
                    <select {...register("incoterm")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent">
                      <option value="">Select...</option>
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="CFR">CFR</option>
                      <option value="EXW">EXW</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.expDate')}</label>
                    <input type="text" placeholder="MM/YYYY" {...register("expDate")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">{t('quotePage.reqSpecs')}</label>
                    <textarea rows={3} {...register("reqSpecs")} placeholder="List any specific parameter requirements (e.g. protein %, moisture %)" className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">{t('quotePage.reqDocs')}</label>
                    <textarea rows={2} {...register("reqDocs")} placeholder="List any specific required certificates or documents for your destination" className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent resize-none" />
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-serif mb-8 border-b border-border pb-4">{t('quotePage.step3')}</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('quotePage.buyerType')}</label>
                    <select {...register("buyerType")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent">
                      <option value="">Select...</option>
                      <option value="Food Manufacturer">{t('quotePage.buyerTypes.food')}</option>
                      <option value="Flour Mill">{t('quotePage.buyerTypes.flour')}</option>
                      <option value="Feed Producer">{t('quotePage.buyerTypes.feed')}</option>
                      <option value="Trader/Distributor">{t('quotePage.buyerTypes.trader')}</option>
                      <option value="Retailer">{t('quotePage.buyerTypes.retailer')}</option>
                      <option value="Other">{t('quotePage.buyerTypes.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('forms.message')} (Optional)</label>
                    <textarea rows={5} {...register("message")} className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-accent resize-none" />
                  </div>
                  
                  <div className="mt-4 p-6 bg-background rounded-xl border border-border">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" {...register("consent")} className="mt-1 w-5 h-5 accent-accent" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {t('quotePage.consent')} *
                      </span>
                    </label>
                    {errors.consent && <p className="text-destructive text-sm mt-2">{errors.consent.message}</p>}
                  </div>
                </div>
              </div>

              {/* Error message */}
              {submitError && (
                <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex items-center justify-between pt-8 border-t border-border">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft size={20} /> {t('quotePage.back')}
                  </button>
                ) : <div />}
                
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                    {t('quotePage.next')} <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-10 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-lg uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? (locale !== 'ru' ? 'Sending…' : 'Отправка…')
                      : t('forms.submit')}
                  </button>
                )}
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
}
