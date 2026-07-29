import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
const logoPath = `${import.meta.env.BASE_URL}alaa-agro-logo.png`;
import { useLocale } from "../contexts/LocaleContext";

const NAV_H = 84;

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ru" : "en";
    setLocation(location.replace(/^\/(en|ru)/, `/${newLocale}`));
  };

  const navLinks = [
    { name: t("nav.home"), path: `/${locale}` },
    { name: t("nav.products"), path: `/${locale}/products` },
    { name: t("nav.about"), path: `/${locale}/about` },
    { name: t("nav.quality"), path: `/${locale}/quality` },
    { name: t("nav.packaging"), path: `/${locale}/packaging` },
    { name: t("nav.trade"), path: `/${locale}/trade` },
    { name: t("nav.contact"), path: `/${locale}/contact` },
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        height: scrolled ? "70px" : `${NAV_H}px`,
        background: scrolled
          ? "rgba(251,248,242,0.99)"
          : "rgba(251,248,242,0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(150,102,21,0.35)",
        boxShadow: scrolled
          ? "0 2px 18px rgba(42,35,28,0.10)"
          : "0 1px 8px rgba(42,35,28,0.05)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-full flex items-center justify-between">
        {/* Logo + wordmark — exact real logo, ~13% larger than previous round */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 z-50 shrink-0"
        >
          <img
            src={logoPath}
            alt="ALAA AGRO TRADE LLC"
            className="object-contain transition-all duration-300"
            style={{
              width: scrolled ? "54px" : "62px",
              height: scrolled ? "54px" : "62px",
            }}
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span
              style={{
                color: "#2A231C",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
              className="uppercase"
            >
              ALAA AGRO
            </span>
            <span
              style={{
                color: "#966615",
                fontSize: "9.5px",
                letterSpacing: "0.16em",
              }}
              className="uppercase mt-[4px]"
            >
              TRADE LLC
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-3">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                location === link.path ||
                (link.path !== `/${locale}` && location.startsWith(link.path));
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="relative block px-2.5 py-2 text-sm font-medium transition-colors"
                    style={{ color: isActive ? "#966615" : "#3A322A" }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.color =
                          "#966615";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.color =
                          "#3A322A";
                    }}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2.5 right-2.5"
                        style={{ height: "1.5px", background: "#C9972D" }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            className="flex items-center gap-3 ml-3 pl-4"
            style={{ borderLeft: "1px solid rgba(150,102,21,0.28)" }}
          >
            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
              style={{ color: "#3A322A" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#966615";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#3A322A";
              }}
            >
              <Globe size={14} />
              {locale === "en" ? "RU" : "EN"}
            </button>

            {/* Quote CTA — rich gold, dark text */}
            <Link
              href={`/${locale}/quote`}
              className="px-6 py-2.5 rounded font-semibold text-sm transition-all"
              style={{
                background: "#C9972D",
                color: "#17130F",
                borderRadius: "6px",
                boxShadow: "0 2px 10px rgba(150,102,21,0.22)",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#B8871F";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 6px 16px rgba(150,102,21,0.30)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#C9972D";
                el.style.transform = "";
                el.style.boxShadow = "0 2px 10px rgba(150,102,21,0.22)";
              }}
            >
              {t("nav.quote")}
            </Link>
          </div>
        </nav>

        {/* Mobile row — hamburger only; language + quote live inside the menu */}
        <div className="lg:hidden flex items-center z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen
                ? locale === "en"
                  ? "Close menu"
                  : "Закрыть меню"
                : locale === "en"
                  ? "Open menu"
                  : "Открыть меню"
            }
            aria-expanded={mobileMenuOpen}
            className="p-2 -mr-2"
          >
            {mobileMenuOpen ? (
              <X size={26} style={{ color: "#2A231C" }} />
            ) : (
              <Menu size={26} style={{ color: "#2A231C" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — inside the fixed header, absolute top-full */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - 84px)",
              background: "#FBF8F2",
              borderBottom: "2px solid rgba(150,102,21,0.28)",
              boxShadow: "0 12px 40px rgba(42,35,28,0.22)",
              zIndex: 49,
            }}
          >
            <div className="px-6 pt-2 pb-6">
              {/* Nav links */}
              <nav>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="flex items-center py-3.5 text-lg font-serif"
                    style={{
                      color: location === link.path ? "#966615" : "#2A231C",
                      borderBottom: "1px solid rgba(150,102,21,0.13)",
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="pt-5 space-y-3">
                <Link
                  href={`/${locale}/quote`}
                  className="block w-full py-3.5 text-center font-semibold text-base rounded"
                  style={{ background: "#C9972D", color: "#17130F" }}
                >
                  {t("nav.quote")}
                </Link>
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 text-sm font-semibold py-2 w-full"
                  style={{ color: "#3A322A" }}
                >
                  <Globe size={16} style={{ color: "#966615" }} />
                  {locale === "en" ? "Русский" : "English"}
                </button>
                <div
                  className="text-sm space-y-1 pt-1"
                  style={{ color: "#6E6256" }}
                >
                  <a
                    href="mailto:Alaa.agro_trade@mail.ru"
                    className="block py-1"
                  >
                    Alaa.agro_trade@mail.ru
                  </a>
                  <a href="tel:+79265705777" className="block py-1">
                    +7 (926) 570-57-77
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
