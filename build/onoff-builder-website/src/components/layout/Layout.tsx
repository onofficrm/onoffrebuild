import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteSeo, SITE_NAME } from '../../data/seo';
import { Header } from './Header';
import { Footer } from './Footer';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.remove();
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertFaqJsonLd(faqs?: { question: string; answer: string }[]) {
  const existing = document.head.querySelector('script[data-seo-schema="faq"]');
  if (!faqs || faqs.length === 0) {
    if (existing) existing.remove();
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-schema', 'faq');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const seo = getRouteSeo(pathname);
    document.title = seo.title;

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.robots);
    if (seo.keywords && seo.keywords.length > 0) {
      upsertMeta('name', 'keywords', seo.keywords.join(', '));
    } else {
      removeMeta('name', 'keywords');
    }

    // OpenGraph Tags
    upsertMeta('property', 'og:type', seo.ogType);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', seo.canonical);

    // Twitter / X Card Tags
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);

    // Canonical URL
    upsertCanonical(seo.canonical);

    // Schema.org FAQPage Structured Data
    upsertFaqJsonLd(seo.faqSchema);

    // GTM/GA4: client-side route changes (initial load handled by GTM container)
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'onoff_virtual_pageview',
      page_location: window.location.href,
      page_path: pathname + window.location.search,
      page_title: seo.title,
    });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-semibold focus:text-white focus:shadow-lg"
      >
        본문으로 바로가기
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
