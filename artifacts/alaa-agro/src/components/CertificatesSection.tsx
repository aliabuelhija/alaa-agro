import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "../contexts/LocaleContext";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
// ─── Credential manifest ──────────────────────────────────────────────────────
//
//  These represent real quality and compliance checkpoints for Russian grain
//  export — not third-party logos. Add actual ISO/HACCP/Halal logos only when
//  the company uploads the real certificate files to public/certificates/.
//
// ─────────────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    badge: "certificates/cert-gost-compliant.svg",
    name_en: "GOST Compliant",
    name_ru: "Соответствие ГОСТ",
    name_ar: "مطابق لمعيار GOST",
    sub_en: "Russian Federation Standards",
    sub_ru: "Стандарты РФ",
    sub_ar: "معايير الاتحاد الروسي",
  },
  {
    badge: "certificates/cert-phytosanitary.svg",
    name_en: "Phytosanitary Cleared",
    name_ru: "Фитосанитарный контроль",
    name_ar: "تصريح الصحة النباتية",
    sub_en: "Export Health Compliance",
    sub_ru: "Экспортные нормы здоровья",
    sub_ar: "امتثال الصحة للتصدير",
  },
  {
    badge: "certificates/cert-non-gmo.svg",
    name_en: "Non-GMO Declaration",
    name_ru: "Декларация Non-GMO",
    name_ar: "إقرار خالٍ من التعديل الجيني",
    sub_en: "Conventional Origin",
    sub_ru: "Традиционное происхождение",
    sub_ar: "منشأ تقليدي",
  },
  {
    badge: "certificates/cert-fumigation.svg",
    name_en: "Fumigation Treated",
    name_ru: "Фумигация",
    name_ar: "معالجة بالتبخير",
    sub_en: "Pest-Free Storage",
    sub_ru: "Защита от вредителей",
    sub_ar: "تخزين خالٍ من الآفات",
  },
  {
    badge: "certificates/cert-laboratory-tested.svg",
    name_en: "Laboratory Tested",
    name_ru: "Лабораторный контроль",
    name_ar: "مُختبر مخبرياً",
    sub_en: "Analytical Standards",
    sub_ru: "Аналитические стандарты",
    sub_ar: "تحليل من طرف ثالث",
  },
];

export function CertificatesSection() {
  const { locale, pick } = useLocale();
  const base = import.meta.env.BASE_URL;
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#F3EBDD",
        borderTop: "3px solid rgba(194,154,61,0.40)",
        borderBottom: "1px solid rgba(194,154,61,0.12)",
      }}
    >
      {/* Subtle logo watermark */}
      <img
        src={logoPath}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none object-contain"
        style={{ width: "520px", height: "520px", opacity: 0.04 }}
      />
      <div className="container mx-auto px-5 sm:px-6 py-14 md:py-20 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="font-bold uppercase mb-3"
            style={{
              color: "#C29A3D",
              fontSize: "10px",
              letterSpacing: "0.30em",
            }}
          >
            {pick({ en: "Standards & Compliance", ru: "Стандарты и соответствие", ar: 'المعايير والامتثال' })}
          </p>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "#2C1F0E" }}
          >
            {pick({ en: "Quality & Compliance", ru: "Качество и соответствие", ar: 'الجودة والامتثال' })}
          </h2>
          <div
            className="mx-auto mb-4"
            style={{
              height: "1px",
              width: "44px",
              background:
                "linear-gradient(90deg, transparent, #C29A3D, transparent)",
            }}
          />
          <p
            className="text-sm max-w-lg mx-auto"
            style={{ color: "rgba(44,31,14,0.55)", lineHeight: 1.8 }}
          >
            {pick({ en: "Every shipment is prepared to meet the documentation and compliance requirements of international trade.", ru: "Каждая отгрузка подготовлена в соответствии с требованиями международной торговли.", ar: 'تُجهَّز كل شحنة لتلبية متطلبات المستندات والامتثال في التجارة الدولية.' })}
          </p>
        </motion.div>

        {/* Badge grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px"
          style={{
            border: "1px solid rgba(194,154,61,0.12)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {CREDENTIALS.map((c, i) => (
            <motion.div
              key={c.name_en}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col items-center text-center gap-4 px-5 py-8"
              style={{
                background: "rgba(255,250,240,0.55)",
                borderInlineEnd:
                  i < CREDENTIALS.length - 1
                    ? "1px solid rgba(194,154,61,0.18)"
                    : undefined,
              }}
            >
              <img
                src={`${base}${c.badge}`}
                alt={pick({ en: c.name_en, ru: c.name_ru, ar: c.name_ar })}
                width={80}
                height={80}
                loading="lazy"
                style={{ width: 80, height: 80, opacity: 0.9 }}
              />
              <div>
                <p
                  className="font-serif text-sm leading-snug mb-1"
                  style={{ color: "#2C1F0E" }}
                >
                  {pick({ en: c.name_en, ru: c.name_ru, ar: c.name_ar })}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "rgba(44,31,14,0.50)" }}
                >
                  {pick({ en: c.sub_en, ru: c.sub_ru, ar: c.sub_ar })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs mt-8 italic"
          style={{ color: "rgba(44,31,14,0.40)" }}
        >
          {pick({ en: "Full documentation — certificates of origin, phytosanitary certificates and quality analysis reports — available on request.", ru: "Полный пакет документов — сертификаты происхождения, фитосанитарные сертификаты и протоколы анализа качества — предоставляется по запросу.", ar: 'المستندات كاملة — شهادات المنشأ وشهادات الصحة النباتية وتقارير تحليل الجودة — متاحة عند الطلب.' })}
        </p>
      </div>
    </section>
  );
}
