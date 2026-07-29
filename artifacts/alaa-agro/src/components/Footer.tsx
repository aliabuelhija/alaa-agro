import React from "react";
import { Link } from "wouter";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
import { useLocale } from "../contexts/LocaleContext";

export function Footer() {
  const { locale, t } = useLocale();

  return (
    <footer
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: "#15120D",
        borderTop: "2px solid #C29A3D",
      }}
    >
      {/* Subtle logo watermark */}
      <img
        src={logoPath}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none object-contain"
        style={{
          width: "480px",
          height: "480px",
          opacity: 0.03,
          filter: "brightness(0) invert(1)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-4 inline-block"
            >
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full p-2"
                style={{
                  background: "rgba(194,154,61,0.12)",
                  border: "1px solid rgba(194,154,61,0.20)",
                }}
              >
                <img
                  src={logoPath}
                  alt="ALAA AGRO Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col font-serif uppercase tracking-widest">
                <span
                  style={{
                    color: "#F3EBDD",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                  }}
                >
                  ALAA AGRO
                </span>
                <span
                  style={{
                    color: "#C29A3D",
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                  }}
                  className="mt-1 uppercase"
                >
                  Trade LLC
                </span>
              </div>
            </Link>
            <p
              style={{
                color: "rgba(243,235,221,0.60)",
                maxWidth: "300px",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              {t("footer.desc")}
            </p>
            <p
              className="font-serif italic text-sm"
              style={{ color: "rgba(194,154,61,0.65)" }}
            >
              "From Trusted Fields to Lasting Partnerships."
            </p>
          </div>

          {/* Company Links Col */}
          <div className="lg:col-span-2">
            <h4
              className="font-serif text-base mb-6"
              style={{ color: "#C29A3D" }}
            >
              {t("footer.company")}
            </h4>
            <ul
              className="space-y-3 text-sm"
              style={{ color: "rgba(243,235,221,0.65)" }}
            >
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/quality`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.quality")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Trade Col */}
          <div className="lg:col-span-3">
            <h4
              className="font-serif text-base mb-6"
              style={{ color: "#C29A3D" }}
            >
              {t("footer.tradeInfo")}
            </h4>
            <ul
              className="space-y-3 text-sm"
              style={{ color: "rgba(243,235,221,0.65)" }}
            >
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/packaging`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.packaging")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/trade`}
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  {t("nav.trade")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/quote`}
                  className="font-medium hover:text-[#D4AF4C] transition-colors"
                  style={{ color: "#C29A3D" }}
                >
                  {t("nav.quote")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3">
            <h4
              className="font-serif text-base mb-6"
              style={{ color: "#C29A3D" }}
            >
              {t("footer.contact")}
            </h4>
            <ul
              className="space-y-4 text-sm"
              style={{ color: "rgba(243,235,221,0.65)" }}
            >
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#C29A3D" }}
                />
                <span>
                  Russia, 125047, Moscow,
                  <br />
                  Lesnaya str., 7, office 305
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#C29A3D" }}
                />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+79265705777"
                    className="hover:text-[#C29A3D] transition-colors"
                  >
                    +7 (926) 570-57-77 (Alaa Noufal)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  size={16}
                  className="shrink-0"
                  style={{ color: "#C29A3D" }}
                />
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:Alaa.agro_trade@mail.ru"
                    className="hover:text-[#C29A3D] transition-colors"
                  >
                    Alaa.agro_trade@mail.ru
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 pt-1">
                <Instagram
                  size={16}
                  className="shrink-0"
                  style={{ color: "#C29A3D" }}
                />
                <a
                  href="https://www.instagram.com/alaa_agro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C29A3D] transition-colors"
                >
                  @alaa_agro
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: "1px solid rgba(194,154,61,0.15)",
            color: "rgba(243,235,221,0.35)",
          }}
        >
          <p>
            © {new Date().getFullYear()} ALAA AGRO TRADE LLC.{" "}
            {t("footer.rights")}
          </p>
          <div className="flex gap-4">
            <span className="hover:text-[#C29A3D] transition-colors cursor-pointer">
              {t("footer.privacy")}
            </span>
            <span className="hover:text-[#C29A3D] transition-colors cursor-pointer">
              {t("footer.terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
