import type { ReactNode } from 'react';
import { Globe, FileText, Link2, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_URLS } from './seo-system/data/servicesData';

type Product = {
  label: string;
  title: string;
  desc: string;
  icon: ReactNode;
  href: string;
  accent: string;
  iconWrap: string;
};

const products: Product[] = [
  {
    label: 'CatchDomain',
    title: '좋은 SEO 도메인 찾기',
    desc: 'SEO에 활용할 도메인을 데이터를 기준으로 찾습니다.',
    icon: <Globe className="w-5 h-5" />,
    href: SERVICE_URLS.catchDomain,
    accent: 'border-blue-200 hover:border-blue-400',
    iconWrap: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'AI Content',
    title: '검색 콘텐츠 제작',
    desc: '키워드에 맞는 콘텐츠 제작을 체계적으로 관리합니다.',
    icon: <FileText className="w-5 h-5" />,
    href: SERVICE_URLS.contentTraffic,
    accent: 'border-amber-200 hover:border-amber-400',
    iconWrap: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'BACKLINK',
    title: '백링크 · 외부 SEO',
    desc: '사이트에 필요한 백링크와 외부 SEO 작업을 관리합니다.',
    icon: <Link2 className="w-5 h-5" />,
    href: SERVICE_URLS.seoflow,
    accent: 'border-emerald-200 hover:border-emerald-400',
    iconWrap: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'Traffic',
    title: '방문자 유입',
    desc: '콘텐츠와 랜딩페이지에 실제 유입을 연결합니다.',
    icon: <TrendingUp className="w-5 h-5" />,
    href: SERVICE_URLS.contentTraffic,
    accent: 'border-indigo-200 hover:border-indigo-400',
    iconWrap: 'bg-indigo-50 text-indigo-700',
  },
];

/** Home summary: 4 execution products only (no WEBSITE/RESULT cards). */
export default function OnoffSeoSystemHomeSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80" aria-labelledby="onoff-seo-system-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 border border-blue-200">
            ONOFF SEO SYSTEM
          </div>
          <h2
            id="onoff-seo-system-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
          >
            필요한 SEO 도구를 한곳에서
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            도메인, 콘텐츠, 백링크, 트래픽 —
            <br className="hidden sm:block" />
            검색 노출에 필요한 실행 도구를 연결해 둡니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
          {products.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`h-full bg-white rounded-2xl border p-5 shadow-sm transition-all ${item.accent} hover:shadow-md text-left block`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">{item.label}</span>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconWrap}`}>{item.icon}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                자세히 <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/seo-platform')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-900 text-white text-sm font-extrabold hover:bg-blue-800 shadow-md shadow-blue-900/15 transition-colors"
          >
            ONOFF SEO SYSTEM 자세히 보기
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/consult')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-slate-800 text-sm font-extrabold hover:border-blue-200 hover:bg-slate-50 transition-colors"
          >
            SEO 상담하기
          </button>
        </div>
      </div>
    </section>
  );
}
