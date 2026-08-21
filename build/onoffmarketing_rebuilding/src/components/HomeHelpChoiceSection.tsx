import { ArrowRight, ExternalLink, Wrench, GraduationCap, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_URLS } from './seo-system/data/servicesData';

const choices = [
  {
    step: '01',
    title: 'SEO를 맡기고 싶어요',
    desc: '현재 사이트를 확인하고 필요한 SEO 작업을 함께 진행합니다.',
    tags: ['홈페이지', '콘텐츠', '백링크', '트래픽'],
    icon: <Handshake className="w-5 h-5" />,
    cta: 'SEO 상담받기',
    action: 'consult' as const,
  },
  {
    step: '02',
    title: '필요한 도구만 사용하고 싶어요',
    desc: '도메인, 콘텐츠, 백링크, 트래픽 등 필요한 서비스만 선택할 수 있습니다.',
    tags: ['CatchDomain', 'Content', 'BACKLINK', 'Traffic'],
    icon: <Wrench className="w-5 h-5" />,
    cta: 'SEO SYSTEM 보기',
    action: 'platform' as const,
  },
  {
    step: '03',
    title: 'SEO를 직접 배우고 싶어요',
    desc: '실제 도구를 이용해 SEO 프로젝트를 직접 진행하는 실전 교육입니다.',
    tags: ['실전 교육', '1:1'],
    icon: <GraduationCap className="w-5 h-5" />,
    cta: 'SEO System 300',
    action: 'education' as const,
  },
];

export default function HomeHelpChoiceSection() {
  const navigate = useNavigate();

  const onCta = (action: (typeof choices)[number]['action']) => {
    if (action === 'consult') navigate('/consult');
    else if (action === 'platform') navigate('/seo-platform');
    else window.open(SERVICE_URLS.seoSystem300, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80" aria-labelledby="home-help-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="home-help-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-10 sm:mb-12"
        >
          어떤 도움이 필요하신가요?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {choices.map((item) => (
            <div
              key={item.step}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-7 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-black text-slate-400">{item.step}</span>
                <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
                  {item.icon}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4 flex-1">{item.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onCta(item.action)}
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 transition-colors"
              >
                {item.cta}
                {item.action === 'education' ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
