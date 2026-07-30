import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Instagram, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'wouter';

const WA_CONTACTS = [
  { number: '79265705777', nameEn: 'Alaa Noufal', nameRu: 'Алаа Ноуфал', nameAr: 'علاء نوفل', phone: '+7 (926) 570-57-77' },
];

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine(val => val === true, "Consent required")
});

type FormValues = z.infer<typeof formSchema>;

export function ContactPage() {
  const { locale, t, pick } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const messageBody = data.subject
        ? `[${data.subject}]\n\n${data.message}`
        : data.message;

      const res = await fetch(`${import.meta.env.BASE_URL}api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name,
          company: data.company ?? '',
          email: data.email,
          phone: data.phone ?? '',
          message: messageBody,
          source: 'contact_page',
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? 'Request failed');
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setSubmitError(
        pick({ en: 'Submission failed — please try WhatsApp or email us directly.', ru: 'Ошибка отправки — пожалуйста, напишите нам в WhatsApp или на почту.', ar: 'فشل الإرسال — يرجى التواصل عبر واتساب أو مراسلتنا بالبريد الإلكتروني مباشرة.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-[82px] pb-12">
      <SEOHead 
        title={`${t('nav.contact')} | ALAA AGRO`} 
        description={t('contactPage.desc')}
        path={`/${locale}/contact`}
      />
      
      <div className="container mx-auto px-6 max-w-6xl pt-8">
        
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">{t('contactPage.title')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('contactPage.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#1A1200] text-white p-7 rounded-3xl shadow-xl">
              <h3 className="text-3xl font-serif mb-6">{t('contactPage.office')}</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">{t('contactPage.addressLabel')}</p>
                    <p className="text-white/80 font-light leading-relaxed">ALAA AGRO TRADE LLC<br/>Russia, 125047, Moscow,<br/>Lesnaya str., 7, office 305</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">{t('contactPage.phonesLabel')}</p>
                    <a href="tel:+79265705777" className="block text-white/80 font-light hover:text-accent transition-colors">+7 (926) 570-57-77 <span className="opacity-60">(Alaa Noufal)</span></a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">{t('contactPage.emailLabel')}</p>
                    <a href="mailto:Alaa.agro_trade@mail.ru" className="block text-white/80 font-light hover:text-accent transition-colors">Alaa.agro_trade@mail.ru</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-5">
              <div className="w-14 h-14 bg-background rounded-full border border-border flex items-center justify-center shrink-0 text-accent">
                <Instagram size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">{t('contactPage.follow')}</h4>
                <a href="https://www.instagram.com/alaa_agro" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary transition-colors font-medium text-sm">
                  @alaa_agro
                </a>
              </div>
            </div>

          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-card border border-border p-6 md:p-8 rounded-2xl shadow-lg">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
                <h3 className="text-3xl font-serif text-foreground mb-4">{t('forms.success')}</h3>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 mt-8 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90"
                >
                  {pick({ en: 'Send another message', ru: 'Отправить другое сообщение', ar: 'إرسال رسالة أخرى' })}
                </button>
              </div>
            ) : (
              <>
                {/* WhatsApp quick contact */}
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
                    {pick({ en: 'Fastest response — WhatsApp', ru: 'Быстрый ответ — WhatsApp', ar: 'أسرع استجابة — واتساب' })}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WA_CONTACTS.map(c => {
                      const msg = pick({
                        en: 'Hello, I would like to enquire about ALAA AGRO products.',
                        ru: 'Здравствуйте, я хотел бы узнать о продукции АЛАА АГРО.',
                        ar: 'مرحباً، أود الاستفسار عن منتجات ALAA AGRO.',
                      });
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
                              {pick({ en: c.nameEn, ru: c.nameRu, ar: c.nameAr })}
                            </p>
                            <p className="text-xs text-muted-foreground">{c.phone}</p>
                          </div>
                          <ArrowRight size={14} className="ms-auto shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-1">
                    {pick({ en: 'or send us a message below', ru: 'или напишите нам ниже', ar: 'أو أرسل لنا رسالة أدناه' })}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('forms.fullName')} *</label>
                    <input {...register("name")} className={`w-full px-4 py-3 bg-background border ${errors.name ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('forms.company')}</label>
                    <input {...register("company")} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('forms.email')} *</label>
                    <input type="email" {...register("email")} className={`w-full px-4 py-3 bg-background border ${errors.email ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:border-accent`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('forms.phone')}</label>
                    <input {...register("phone")} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input {...register("subject")} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('forms.message')} *</label>
                  <textarea rows={6} {...register("message")} className={`w-full px-4 py-3 bg-background border ${errors.message ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:border-accent resize-none`} />
                </div>

                <div className="flex items-start gap-4 bg-background p-4 rounded-xl border border-border">
                  <input type="checkbox" id="consent" {...register("consent")} className="mt-1 w-5 h-5 accent-accent shrink-0" />
                  <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {pick({ en: 'I consent to ALAA AGRO TRADE LLC collecting my details to respond to my enquiry.', ru: 'Я даю согласие ООО «АЛАА АГРО ТРЕЙД» на сбор моих данных для ответа на мой запрос.', ar: 'أوافق على قيام ALAA AGRO TRADE LLC بجمع بياناتي للرد على استفساري.' })} *
                  </label>
                </div>
                {errors.consent && <p className="text-destructive text-sm mt-1">{errors.consent.message}</p>}

                {submitError && (
                  <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                    {submitError}
                  </p>
                )}

                <div className="pt-6 border-t border-border">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px] uppercase tracking-wide text-sm shadow-md"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('forms.submit')}
                  </button>
                </div>
              </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
