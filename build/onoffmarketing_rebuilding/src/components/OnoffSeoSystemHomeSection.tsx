import type { ReactNode } from 'react';
import {
  Globe,
  Monitor,
  FileText,
  Link2,
  TrendingUp,
  BarChart3,
  ArrowRight,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICE_URLS } from './seo-system/data/servicesData';

type FlowStep = {
  step: string;
  category: string;
  title: string;
  desc: string;
  icon: ReactNode;
  href?: string;
  internalTo?: string;
  accent: string;
  iconWrap: string;
};

const steps: FlowStep[] = [
  {
    step: '01',
    category: 'DOMAIN',
    title: 'CatchDomain',
    desc: 'SEO에 활용할 도메인을 데이터를 기준으로 찾아봅니다.',
    icon: <Globe className="w-5 h-5" />,
    href: SERVICE_URLS.catchDomain,
    accent: 'border-blue-200 hover:border-blue-400',
    iconWrap: 'bg-blue-50 text-blue-600',
  },
  {
    step: '02',
    category: 'WEBSITE',
    title: 'SEO Website',
    desc: '검색엔진과 사용자를 고려한 사이트 구조를 설계합니다.',
    icon: <Monitor className="w-5 h-5" />,
    internalTo: '/consult',
    accent: 'border-cyan-200 hover:border-cyan-400',
    iconWrap: 'bg-cyan-50 text-cyan-700',
  },
  {
    step: '03',
    category: 'CONTENT',
    title: 'AI Content',
    desc: '키워드를 기반으로 SEO 콘텐츠 제작을 시스템화합니다.',
    icon: <FileText className="w-5 h-5" />,
    href: SERVICE_URLS.contentTraffic,
    accent: 'border-amber-200 hover:border-amber-400',
    iconWrap: 'bg-amber-50 text-amber-700',
  },
  {
    step: '04',
    category: 'AUTHORITY',
    title: 'SEOFLOW',
    desc: '사이트와 경쟁사를 분석하여 필요한 외부 SEO와 백링크를 관리합니다.',
    icon: <Link2 className="w-5 h-5" />,
    href: SERVICE_URLS.seoflow,
    accent: 'border-emerald-200 hover:border-emerald-400',
    iconWrap: 'bg-emerald-50 text-emerald-700',
  },
  {
    step: '05',
    category: 'TRAFFIC',
    title: 'Traffic',
    desc: '만든 페이지와 콘텐츠에 실제 유입 캠페인을 연결합니다.',
    icon: <TrendingUp className="w-5 h-5" />,
    href: SERVICE_URLS.contentTraffic,
    accent: 'border-indigo-200 hover:border-indigo-400',
    iconWrap: 'bg-indigo-50 text-indigo-700',
  },
  {
    step: '06',
    category: 'RESULT',
    title: 'Search Growth',
    desc: '작업 결과를 확인하고 다음 SEO 전략으로 연결합니다.',
    icon: <BarChart3 className="w-5 h-5" />,
    internalTo: '/seo-platform',
    accent: 'border-violet-200 hover:border-violet-400',
    iconWrap: 'bg-violet-50 text-violet-700',
  },
];

function StepCard({ item }: { item: FlowStep }) {
  const body = (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] font-black text-slate-400">{item.step}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconWrap}`}>{item.icon}</span>
      </div>
      <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1">{item.category}</p>
      <h3 className="text-sm font-extrabold text-slate-900 mb-2">{item.title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
      {(item.href || item.internalTo) && (
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
          {item.href ? (
            <>
              자세히 <ExternalLink className="w-3 h-3" />
            </>
          ) : (
            <>
              보기 <ArrowRight className="w-3 h-3" />
            </>
          )}
        </span>
      )}
    </>
  );

  const className = `h-full bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${item.accent} hover:shadow-md text-left block`;

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  if (item.internalTo) {
    return (
      <Link to={item.internalTo} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

/** Compact ONOFF SEO SYSTEM summary for the marketing homepage. */
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
            SEO를 분석에서 실행까지.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            좋은 도메인을 찾고, 검색에 맞는 사이트를 만들고, 콘텐츠를 쌓고,
            <br className="hidden sm:block" />
            백링크와 외부 SEO를 구축하고, 트래픽을 연결하는 과정을 하나의 흐름으로 구성합니다.
          </p>
        </div>

        {/* Flow: 1 col mobile → 2 tablet → 3/6 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {steps.map((item) => (
            <div key={item.step} className="min-w-0 h-full">
              <StepCard item={item} />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
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

        {/* Education note — not part of the 5 execution steps */}
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-extrabold text-slate-900">이 시스템을 직접 배우고 싶다면</p>
            <p className="text-xs text-slate-600 font-medium mt-0.5">SEO System 300 — SEO 실전 교육</p>
          </div>
          <a
            href={SERVICE_URLS.seoSystem300}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-indigo-700 hover:text-indigo-900 shrink-0"
          >
            교육 안내
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
