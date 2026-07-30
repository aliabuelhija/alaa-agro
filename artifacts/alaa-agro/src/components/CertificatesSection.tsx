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
    sub_en: "Russian Federation Standards",
    sub_ru: "Стандарты РФ",
  },
  {
    badge: "certificates/cert-phytosanitary.svg",
    name_en: "Phytosanitary Cleared",
    name_ru: "Фитосанитарный контроль",
    sub_en: "Export Health Compliance",
    sub_ru: "Экспортные нормы здоровья",
  },
  {
    badge: "certificates/cert-non-gmo.svg",
    name_en: "Non-GMO Declaration",
    name_ru: "Декларация Non-GMO",
    sub_en: "Conventional Origin",
    sub_ru: "Традиционное происхождение",
  },
  {
    badge: "certificates/cert-fumigation.svg",
    name_en: "Fumigation Treated",
    name_ru: "Фумигация",
    sub_en: "Pest-Free Storage",
    sub_ru: "Защита от вредителей",
  },
  {
    badge: "certificates/cert-laboratory-tested.svg",
    name_en: "Laboratory Tested",
    name_ru: "Лабораторный контроль",
    sub_en: "Analytical Standards",
    sub_ru: "Аналитические стандарты",
  },
];

export function CertificatesSection() {
  const { locale } = useLocale();
  const en = locale === "en";
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
            {en ? "Standards & Compliance" : "Стандарты и соответствие"}
          </p>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "#2C1F0E" }}
          >
            {en ? "Quality & Compliance" : "Качество и соответствие"}
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
            {en
              ? "Every shipment is prepared to meet the documentation and compliance requirements of international trade."
              : "Каждая отгрузка подготовлена в соответствии с требованиями международной торговли."}
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
                alt={en ? c.name_en : c.name_ru}
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
                  {en ? c.name_en : c.name_ru}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "rgba(44,31,14,0.50)" }}
                >
                  {en ? c.sub_en : c.sub_ru}
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
          {en
            ? "Full documentation — certificates of origin, phytosanitary certificates and quality analysis reports — available on request."
            : "Полный пакет документов — сертификаты происхождения, фитосанитарные сертификаты и протоколы анализа качества — предоставляется по запросу."}
        </p>
      </div>
    </section>
  );
}
