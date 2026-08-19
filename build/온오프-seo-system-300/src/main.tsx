import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const cta = target?.closest('[data-cta="kakao-consult"]') as HTMLElement | null;
  if (!cta) return;

  const location = cta.getAttribute('data-cta-location') || '';
  const payload = {
    event: 'seo_system_kakao_click',
    cta_location: location,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'seo_system_kakao_click', { cta_location: location });
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
