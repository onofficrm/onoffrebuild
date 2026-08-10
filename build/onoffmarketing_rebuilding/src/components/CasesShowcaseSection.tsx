import { useState } from 'react';
import { ExternalLink, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const caseCategories = ['전체', '홈페이지 제작', 'SEO 상위노출', '트래픽 운영', '자동화 운영', 'CPA 플랫폼'];

const casesData = [
  {
    title: '온오프성형외과',
    category: '홈페이지 제작',
    demoUrl: 'https://plastic.icrm.co.kr',
    desc: '의료 브랜딩, 시술 소개, 카카오 직통 상담 전환에 최적화된 병원 웹사이트 사례입니다.',
    badge: '병원/의료',
    metric: '상담 전환율 +280%',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프더팰리스 아파트분양',
    category: '트래픽 운영',
    demoUrl: 'https://palace.icrm.co.kr',
    desc: '입지 프리미엄, 평면도 및 방문예약 신청 타겟 트래픽 집중형 분양 랜딩페이지 사례입니다.',
    badge: '분양/부동산',
    metric: '월 방문예약 350건+',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프회생법률센터',
    category: 'SEO 상위노출',
    demoUrl: 'https://recoverylaw.icrm.co.kr',
    desc: '개인회생/파산 핵심 키워드 구글·네이버 1페이지 상위점유 및 자격진단 DB 수집 사례입니다.',
    badge: '법률/전문직',
    metric: '키워드 상위 92% 점유',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프CPA 제휴마케팅 플랫폼',
    category: 'CPA 플랫폼',
    demoUrl: 'https://onoffcpa.icrm.co.kr/',
    desc: '광고주와 1,200+ 제휴 파트너 마케터를 직접 연결하는 리드 수집 및 자동 정산 플랫폼 사례입니다.',
    badge: 'CPA/CPS 플랫폼',
    metric: '유효 DB 50,000건+ 누적',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프클린 입주청소',
    category: 'SEO 상위노출',
    demoUrl: 'https://clean.icrm.co.kr',
    desc: '청소 전후 비교, 지역 키워드 검색 노출 및 견적 문의 자동 접수에 특화된 홈케어 사례입니다.',
    badge: '생활/홈케어',
    metric: '지역키워드 1위 노출',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'iCRM 기반 환자/고객 자동화',
    category: '자동화 운영',
    internalLink: '/platform',
    desc: '문의 DB 수집 즉시 카카오 알림톡 발송 및 미팅/예약 일정 자동 리마인드 케어 시스템 사례입니다.',
    badge: 'iCRM 자동화',
    metric: 'CS 리소스 85% 절감',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프영어학원',
    category: '홈페이지 제작',
    demoUrl: 'https://english.icrm.co.kr',
    desc: '커리큘럼, 합격 후기 및 학부모 1:1 상담 예약에 최적화된 교육기관 홈페이지 사례입니다.',
    badge: '교육/학원',
    metric: '상담 신규 유입 3배',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: '온오프스페이스 인테리어',
    category: '트래픽 운영',
    demoUrl: 'https://space.icrm.co.kr',
    desc: '시공 포트폴리오 갤러리 및 평수별 견적 시뮬레이터로 고단가 문의를 유도하는 사례입니다.',
    badge: '인테리어/건축',
    metric: '견적문의 전환 4.2배',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
  }
];

export default function CasesShowcaseSection() {
  const [activeTab, setActiveTab] = useState('전체');

  const filteredCases = activeTab === '전체' 
    ? casesData 
    : casesData.filter(c => c.category === activeTab);

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 border border-blue-200">
            <Sparkles size={16} className="mr-2 text-yellow-500" />
            실전 포트폴리오 & 적용 사례
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "직접 운영하고, <span className="text-blue-700">직접 적용한 사례</span>"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            이론이 아닌, 실전 비즈니스 현장에서 작동하며 검증된 온오프마케팅의 성공 사례를 확인해보세요.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {caseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                activeTab === cat
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCases.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Banner Image */}
                <div className="h-40 relative overflow-hidden text-white flex flex-col justify-between border-b border-slate-200">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-2.5 py-0.5 bg-blue-900/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-blue-700/50 shadow-sm">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-extrabold text-yellow-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                        {item.category}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="text-xs font-extrabold text-yellow-300 mb-0.5 flex items-center drop-shadow">
                        <CheckCircle size={12} className="mr-1 text-emerald-400" />
                        {item.metric}
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-tight drop-shadow-md">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0">
                {item.demoUrl ? (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white"
                  >
                    데모 / 사이트 보기
                    <ExternalLink size={14} className="ml-1.5" />
                  </a>
                ) : (
                  <Link
                    to={item.internalLink!}
                    className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white"
                  >
                    자세히 보기
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Portfolio Link */}
        <div className="mt-12 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-800 rounded-xl font-extrabold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            포트폴리오 사례 전체보기
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
}
