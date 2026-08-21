import { GraduationCap, ExternalLink } from 'lucide-react';
import { SERVICE_URLS } from './seo-system/data/servicesData';

/** SEO System 300 education CTA — separate from execution product flow. */
export default function HomeSeoSystem300Section() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80" aria-labelledby="home-seo300-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 mb-5">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 id="home-seo300-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          SEO를 직접 배우고 싶다면
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6">
          CatchDomain, Content, BACKLINK, Traffic을 실제로 쓰며 배우는
          <br className="hidden sm:block" />
          실전 교육 — SEO System 300
        </p>
        <a
          href={SERVICE_URLS.seoSystem300}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-700 text-white text-sm font-extrabold hover:bg-indigo-600 transition-colors"
        >
          SEO System 300 안내
          <ExternalLink className="w-4 h-4" />
        </a>
        <p className="mt-4 text-xs text-slate-500 font-medium">실행 도구 흐름과 별개의 교육 프로그램입니다</p>
      </div>
    </section>
  );
}
