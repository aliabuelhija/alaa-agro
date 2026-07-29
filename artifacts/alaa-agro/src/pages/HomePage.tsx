import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { useLocale } from "../contexts/LocaleContext";
import { SEOHead } from "../components/SEOHead";
import {
  Package,
  ArrowRight,
  CheckSquare,
  FileText,
  Truck,
  Handshake,
  Wheat,
  Bean,
  Droplets,
  Sprout,
  FlaskConical,
} from "lucide-react";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
import { CertificatesSection } from "../components/CertificatesSection";
import { HeroSlider } from "../components/HeroSlider";
import { FeaturedShowcase } from "../components/FeaturedShowcase";

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { locale, t } = useLocale();

  return (
    <div ref={containerRef} className="bg-background">
      <SEOHead
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        path={`/${locale}/`}
      />

      {/* 1. HERO — "The Journey of One Product" cinematic slider */}
      <HeroSlider />

      {/* 3. WHAT WE SELL — editorial category grid */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#F6F0E6",
          borderTop: "3px solid #C29A3D",
          borderBottom: "1px solid rgba(154,104,24,0.10)",
        }}
      >
        {/* Warm glow at the seam so the section reads as a continuation of the sunset hero */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "120px",
            background:
              "linear-gradient(180deg, rgba(201,143,63,0.14) 0%, rgba(201,143,63,0.00) 100%)",
          }}
        />
        <div className="container mx-auto px-5 sm:px-6 pt-9 md:pt-12 pb-12 md:pb-16">
          {/* Section header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 md:mb-9"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <p
                className="text-[11px] font-bold tracking-[0.26em] uppercase mb-3"
                style={{ color: "#9A6818" }}
              >
                {locale === "en"
                  ? "Russian origin · Export-ready range"
                  : "Российское происхождение · Экспортный ассортимент"}
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl mb-3"
                style={{ color: "#29231D" }}
              >
                {locale === "en" ? "What We Sell" : "Что мы поставляем"}
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "#7B6A5B" }}
              >
                {locale === "en"
                  ? "A focused range of grains, pulses, oilseeds, seeds and vegetable oils prepared for international trade."
                  : "Специализированный ассортимент зерновых, бобовых, масличных, семян и растительных масел, подготовленных для международной торговли."}
              </p>
            </div>
            <Link
              href={`/${locale}/products`}
              className="group shrink-0 inline-flex items-center gap-2 text-sm font-semibold pb-px"
              style={{
                color: "#9A6818",
                borderBottom: "1px solid rgba(154,104,24,0.35)",
              }}
            >
              {locale === "en" ? "View Full Catalogue" : "Полный каталог"}
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Editorial 12-column category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
            {[
              {
                key: "Grains",
                img: "products/wheat_2.jpg",
                icon: <Wheat size={18} strokeWidth={1.5} />,
                span: "lg:col-span-4 lg:row-span-2",
                minH: "lg:min-h-[560px] min-h-[300px]",
                phrase: "Wheat, barley, corn and other cereal commodities.",
                phraseRu:
                  "Пшеница, ячмень, кукуруза и другие зерновые культуры.",
              },
              {
                key: "Pulses",
                img: "products/chickpeas_2.jpg",
                icon: <Bean size={18} strokeWidth={1.5} />,
                span: "lg:col-span-2",
                minH: "min-h-[268px]",
                phrase: "Chickpeas, lentils and peas for food processing.",
                phraseRu: "Нут, чечевица и горох для пищевой переработки.",
              },
              {
                key: "Oilseeds",
                img: "products/brown-flaxseed_2.jpg",
                icon: <Droplets size={18} strokeWidth={1.5} />,
                span: "lg:col-span-2",
                minH: "min-h-[268px]",
                phrase: "Flaxseed and sunflower seeds for oil extraction.",
                phraseRu: "Лён и семена подсолнечника для производства масла.",
              },
              {
                key: "Seeds",
                img: "products/coriander_2.jpg",
                icon: <Sprout size={18} strokeWidth={1.5} />,
                span: "lg:col-span-2",
                minH: "min-h-[268px]",
                phrase: "Spring vetch and coriander, cleaned and sorted.",
                phraseRu:
                  "Вика яровая и кориандр, очищенные и отсортированные.",
              },
              {
                key: "Vegetable Oils",
                img: "products/sunflower-oil_2.jpg",
                icon: <FlaskConical size={18} strokeWidth={1.5} />,
                span: "lg:col-span-2",
                minH: "min-h-[268px]",
                phrase: "Refined sunflower oil in retail and bulk formats.",
                phraseRu:
                  "Рафинированное подсолнечное масло в розничных и оптовых форматах.",
              },
              {
                key: "Packaging & Logistics",
                img: "hero-real-warehouse.jpg",
                icon: <Package size={18} strokeWidth={1.5} />,
                span: "sm:col-span-2 lg:col-span-8",
                minH: "min-h-[268px]",
                phrase:
                  "Export bags, big bags, pallets and container preparation.",
                phraseRu:
                  "Экспортные мешки, биг-бэги, поддоны и подготовка контейнеров.",
              },
            ].map((card, i) => {
              const cat = categories.find((c) => c.id === card.key);
              const count = products.filter(
                (p) => p.category === card.key,
              ).length;
              const isService = !cat;
              const href = isService
                ? `/${locale}/packaging`
                : `/${locale}/products?category=${card.key}`;
              const title = isService
                ? locale === "en"
                  ? "Packaging & Logistics"
                  : "Упаковка и логистика"
                : locale === "en"
                  ? cat.name
                  : cat.nameRu;
              return (
                <motion.div
                  key={card.key}
                  className={`${card.span}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : i * 0.06,
                  }}
                >
                  <Link
                    href={href}
                    className={`group relative flex h-full w-full flex-col justify-end overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A6818] ${card.minH}`}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(154,104,24,0.16)",
                      boxShadow:
                        "0 8px 28px rgba(41,35,29,0.06), 0 1px 2px rgba(41,35,29,0.04)",
                      transition:
                        "transform 0.35s cubic-bezier(0.33,1,0.68,1), box-shadow 0.35s ease, border-color 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (prefersReducedMotion) return;
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-5px)";
                      el.style.boxShadow =
                        "0 18px 48px rgba(41,35,29,0.10), 0 2px 6px rgba(41,35,29,0.05)";
                      el.style.borderColor = "rgba(154,104,24,0.34)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "";
                      el.style.boxShadow =
                        "0 8px 28px rgba(41,35,29,0.06), 0 1px 2px rgba(41,35,29,0.04)";
                      el.style.borderColor = "rgba(154,104,24,0.16)";
                    }}
                  >
                    {/* Full-bleed image */}
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={`${import.meta.env.BASE_URL}${card.img.replace(/\.jpg$/, "-768.webp")} 768w, ${import.meta.env.BASE_URL}${card.img.replace(/\.jpg$/, ".webp")} 1200w`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <img
                        src={`${import.meta.env.BASE_URL}${card.img}`}
                        alt={title}
                        loading="lazy"
                        className={`absolute inset-0 h-full w-full object-cover ${prefersReducedMotion ? "" : "transition-transform duration-700 group-hover:scale-[1.04]"}`}
                      />
                    </picture>
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(30,23,15,0.92) 0%, rgba(30,23,15,0.55) 38%, rgba(30,23,15,0.12) 68%, rgba(30,23,15,0.05) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(30,23,15,0.55) 0%, rgba(30,23,15,0.10) 45%, transparent 100%)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-5 md:p-6">
                      <div className="mb-2.5" style={{ color: "#DDBB68" }}>
                        {card.icon}
                      </div>
                      <h3
                        className="font-serif text-xl md:text-2xl leading-tight mb-1"
                        style={{ color: "#F6F0E6" }}
                      >
                        {title}
                      </h3>
                      <p
                        className="text-xs font-medium mb-2"
                        style={{ color: "rgba(246,240,230,0.65)" }}
                      >
                        {isService
                          ? locale === "en"
                            ? "Export services"
                            : "Экспортные услуги"
                          : `${count} ${locale === "en" ? (count === 1 ? "product" : "products") : "поз."}`}
                      </p>
                      <p
                        className="text-[13px] leading-snug mb-3.5 max-w-md"
                        style={{ color: "rgba(246,240,230,0.80)" }}
                      >
                        {locale === "en" ? card.phrase : card.phraseRu}
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                        style={{ color: "#DDBB68" }}
                      >
                        {isService
                          ? locale === "en"
                            ? "Learn more"
                            : "Подробнее"
                          : locale === "en"
                            ? "Explore category"
                            : "Смотреть категорию"}
                        <ArrowRight
                          size={13}
                          className={
                            prefersReducedMotion
                              ? ""
                              : "transition-transform duration-200 group-hover:translate-x-1"
                          }
                        />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS — premium coverflow showcase */}
      <FeaturedShowcase />

      {/* 6. WHY BUYERS CHOOSE ALAA AGRO */}
      <section
        className="py-10 md:py-14 bg-secondary text-secondary-foreground"
        style={{
          borderTop: "3px solid #C29A3D",
          borderBottom: "1px solid rgba(194,154,61,0.12)",
        }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">
            {t("why.title")}
          </h2>

          {/* Logo badge */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center gap-4">
              <img
                src={logoPath}
                alt="ALAA AGRO TRADE LLC"
                className="object-contain"
                style={{
                  width: "120px",
                  height: "120px",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.92,
                }}
              />
              <div className="text-center">
                <p className="uppercase font-bold tracking-[0.22em] text-white text-sm">
                  ALAA AGRO
                </p>
                <p className="uppercase tracking-[0.18em] text-white/50 text-[10px] mt-1">
                  TRADE LLC · Moscow, Russia
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                img: "hero-wheat-golden.jpg",
                pos: "center 60%",
                title: t("why.selected"),
                desc: t("why.selectedDesc"),
              },
              {
                img: "gost-certificate.jpg",
                pos: "center 40%",
                title: t("why.specs"),
                desc: t("why.specsDesc"),
              },
              {
                img: "hero-bags-clean.jpg",
                pos: "center 50%",
                title: t("why.packaging"),
                desc: t("why.packagingDesc"),
              },
              {
                img: "hero-warehouse.jpg",
                pos: "center 55%",
                title: t("why.shipment"),
                desc: t("why.shipmentDesc"),
              },
              {
                img: "tradeshow.jpg",
                pos: "center 40%",
                title: t("why.partnership"),
                desc: t("why.partnershipDesc"),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col group hover:border-accent/50 transition-colors duration-300"
              >
                <div className="h-44 overflow-hidden shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}${f.img}`}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: f.pos }}
                    loading="lazy"
                  />
                </div>
                <div
                  className="p-5 flex flex-col flex-1"
                  style={{ borderTop: "2px solid rgba(194,154,61,0.4)" }}
                >
                  <h4 className="text-lg font-serif text-white mb-2">
                    {f.title}
                  </h4>
                  <p className="text-white/60 leading-relaxed font-light text-sm flex-1">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PACKAGING & LOGISTICS PREVIEW */}
      <section
        id="packaging-preview"
        className="py-8 md:py-12 relative overflow-hidden"
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

        <div className="container mx-auto px-6 relative z-10">
          {/* Eyebrow + heading + subtitle */}
          <div className="text-center mb-8">
            <p
              className="font-bold uppercase mb-4"
              style={{
                color: "#C29A3D",
                fontSize: "10px",
                letterSpacing: "0.30em",
              }}
            >
              {locale === "en"
                ? "Export-Ready Solutions"
                : "Решения для экспорта"}
            </p>
            <h2
              className="font-serif text-4xl md:text-5xl mb-4"
              style={{ color: "#2B241C" }}
            >
              {t("packagingHome.title")}
            </h2>
            <div
              className="mx-auto mb-5"
              style={{
                height: "1px",
                width: "48px",
                background:
                  "linear-gradient(90deg, transparent, #C29A3D, transparent)",
              }}
            />
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#7A6450", lineHeight: 1.8 }}
            >
              {locale === "en"
                ? "Flexible packaging and loading formats designed for reliable international delivery."
                : "Гибкие форматы упаковки и загрузки, разработанные для надёжной международной доставки."}
            </p>
          </div>

          {/* 4 premium format cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                format: "25 kg",
                sub: locale === "en" ? "PP Woven Bags" : "Мешки ПП 25 кг",
                photo: "packaging/bag-25kg.jpg",
              },
              {
                format: "50 kg",
                sub: locale === "en" ? "PP Woven Bags" : "Мешки ПП 50 кг",
                photo: "packaging/bag-50kg.jpg",
              },
              {
                format: locale === "en" ? "Big Bags" : "Биг-бэги",
                sub: locale === "en" ? "~1,000 kg FIBC" : "МКР ~1 000 кг",
                photo: "packaging/bigbag-fibc.jpg",
              },
              {
                format: locale === "en" ? "Container" : "Контейнер",
                sub: locale === "en" ? "Full Loads FCL/LCL" : "Полная загрузка",
                photo: "packaging/container-load.jpg",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: i * 0.08 }}
                className="flex flex-col overflow-hidden transition-all duration-300 cursor-default"
                style={{
                  background: "#FFFAF4",
                  borderWidth: "1px 1px 1px 1px",
                  borderStyle: "solid",
                  borderColor: "rgba(194,154,61,0.22)",
                  borderTopWidth: "3px",
                  borderTopColor: "#C29A3D",
                  borderRadius: "14px",
                  boxShadow: "0 2px 14px rgba(43,36,28,0.07)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 10px 28px rgba(43,36,28,0.13)";
                  const img = el.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1.07)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "";
                  el.style.boxShadow = "0 2px 14px rgba(43,36,28,0.07)";
                  const img = el.querySelector("img") as HTMLElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                {/* Photo */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "4/3",
                  }}
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${import.meta.env.BASE_URL}${item.photo.replace(/\.jpg$/, "-768.webp")} 768w, ${import.meta.env.BASE_URL}${item.photo.replace(/\.jpg$/, ".webp")} 1200w`}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}${item.photo}`}
                      alt={`${item.format} – ${item.sub}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </picture>
                  {/* Dark gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(21,18,13,0.45) 0%, transparent 50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {/* Label */}
                <div className="flex flex-col items-center text-center px-3 py-3">
                  <div
                    className="font-serif text-base font-semibold mb-0.5 leading-tight"
                    style={{ color: "#2B241C" }}
                  >
                    {item.format}
                  </div>
                  <div className="text-[11px]" style={{ color: "#7A6450" }}>
                    {item.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer + CTA */}
          <div className="text-center">
            <p
              className="text-xs mb-6 max-w-2xl mx-auto italic"
              style={{ color: "#9A8070" }}
            >
              * {t("packagingHome.disclaimer")}
            </p>
            <Link
              href={`/${locale}/packaging`}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{
                color: "#C29A3D",
                borderBottom: "1px solid rgba(194,154,61,0.40)",
                paddingBottom: "3px",
              }}
            >
              {t("packagingHome.learnMore")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. QUALITY CERTIFICATES */}
      <CertificatesSection />

      {/* 10. QUOTE CTA */}
      <section className="py-12 md:py-16 bg-[#1A1200] relative overflow-hidden text-center border-t-4 border-accent">
        {/* Subtle texture/glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-80 mix-blend-overlay" />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 max-w-4xl">
            {t("quoteCta.title")}
          </h2>
          <p className="text-white/80 text-lg mb-12 max-w-2xl font-light">
            {t("quoteCta.body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href={`/${locale}/quote`}
              className="px-10 py-4 rounded font-semibold uppercase tracking-wide text-sm shadow-xl transition-all hover:-translate-y-0.5"
              style={{
                background: "#C29A3D",
                color: "#15120D",
                boxShadow: "0 4px 20px rgba(194,154,61,0.38)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#D4AF4C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#C29A3D";
              }}
            >
              {t("quoteCta.primary")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-10 py-4 rounded font-semibold uppercase tracking-wide text-sm transition-all hover:bg-[rgba(194,154,61,0.10)]"
              style={{
                border: "1px solid rgba(194,154,61,0.45)",
                color: "rgba(217,190,120,0.90)",
              }}
            >
              {t("quoteCta.secondary")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
