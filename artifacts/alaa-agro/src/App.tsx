import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation, Redirect } from 'wouter';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import { DEFAULT_LOCALE, isLocale, localeFromPath } from './i18n';

// Layout
import { Layout } from './components/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { QualityPage } from './pages/QualityPage';
import { PackagingPage } from './pages/PackagingPage';
import { InternationalTradePage } from './pages/InternationalTradePage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function LocaleRouter() {
  const [location] = useLocation();
  const { setLocale, locale: contextLocale } = useLocale();

  // Update context locale if URL locale changes
  React.useEffect(() => {
    const urlLocale = localeFromPath(location);
    if (urlLocale && urlLocale !== contextLocale) {
      setLocale(urlLocale);
    }
  }, [location, contextLocale, setLocale]);

  if (!localeFromPath(location)) {
    const saved = localStorage.getItem('alaa_agro_locale');
    const storedLocale = isLocale(saved) ? saved : DEFAULT_LOCALE;
    const cleanLocation = location === '/' ? '' : location;
    return <Redirect to={`/${storedLocale}${cleanLocation}`} />;
  }

  return (
    <>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route path="/:locale" component={HomePage} />
          <Route path="/:locale/products" component={ProductsPage} />
          <Route path="/:locale/products/:slug" component={ProductDetailPage} />
          <Route path="/:locale/about" component={AboutPage} />
          <Route path="/:locale/quality" component={QualityPage} />
          <Route path="/:locale/packaging" component={PackagingPage} />
          <Route path="/:locale/trade" component={InternationalTradePage} />
          <Route path="/:locale/quote" component={QuotePage} />
          <Route path="/:locale/contact" component={ContactPage} />
          <Route>
            <Redirect to={`/${contextLocale}`} />
          </Route>
        </Switch>
      </Layout>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocaleProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <LocaleRouter />
          </WouterRouter>
        </LocaleProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
