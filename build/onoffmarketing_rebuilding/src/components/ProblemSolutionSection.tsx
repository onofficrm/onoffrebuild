import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const problemSolutions = [
  {
    problem: '홈페이지는 잘 만들어뒀는데 문의가 들어오지 않습니다.',
    solution: '고객 설득 동선 기획 + 고전환 CTA 및 카카오톡/전화 직통 상담 구조로 전면 개편합니다.',
    category: '전환율 개편',
    link: '/request'
  },
  {
    problem: '네이버, 구글 검색 및 AI 답변에 우리 회사가 노출되지 않습니다.',
    solution: 'SEO/AEO 알고리즘에 맞춘 메타 태그, 키워드 구조화 세팅으로 유기적 검색 1페이지 상위 점유를 만듭니다.',
    category: 'SEO/AEO 상위노출',
    link: '/consult'
  },
  {
    problem: '블로그와 카페 콘텐츠를 지속해서 작성·운영할 인력이 부족합니다.',
    solution: '업종별 맞춤 고품질 원고 기획부터 상위노출형 블로그·카페 포스팅 실행까지 대행해 드립니다.',
    category: '포스팅 실행대행',
    link: '/blog'
  },
  {
    problem: '키워드 광고 비용은 부담스러운데 자사 유기적 유입채널이 없습니다.',
    solution: '실시간 타겟 트래픽 및 백링크 자산 구축으로 광고비 없이 지속 유입되는 오가닉 검색망을 형성합니다.',
    category: '오가닉 트래픽',
    link: '/traffic'
  },
  {
    problem: '자사 상품이나 서비스를 홍보해 줄 CPA/CPS 제휴 파트너망을 구축하고 싶습니다.',
    solution: '온오프CPA 플랫폼 솔루션으로 리드 수집, 파트너 관리, 승인 및 자동 정산 시스템을 완성해 드립니다.',
    category: 'CPA 제휴플랫폼',
    externalLink: 'https://onoffcpa.icrm.co.kr/'
  }
];

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-yellow-100 text-yellow-900 text-xs sm:text-sm font-extrabold mb-4 border border-yellow-200">
            문제 진단 & 맞춤 솔루션
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "이런 고민이 있다면 <span className="text-blue-700">온오프마케팅이 해결</span>합니다"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            마케팅 실행의 막힘을 시원하게 뚫어드리는 온오프마케팅의 1:1 문제 해결 프로세스입니다.
          </p>
        </div>

        {/* List of Problem-Solution Cards */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {problemSolutions.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all duration-300 grid lg:grid-cols-12 gap-6 items-center"
            >
              {/* Problem Side */}
              <div className="lg:col-span-5 flex items-start gap-3.5">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 block">
                    고객의 고민 {idx + 1}
                  </span>
                  <p className="text-slate-800 font-bold text-base sm:text-lg leading-snug">
                    "{item.problem}"
                  </p>
                </div>
              </div>

              {/* Arrow Divider */}
              <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-300">
                <ArrowRight size={24} className="text-blue-500" />
              </div>

              {/* Solution Side */}
              <div className="lg:col-span-6 bg-white lg:bg-blue-50/50 p-5 rounded-xl border border-blue-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded mr-2">
                      {item.category}
                    </span>
                    <p className="text-slate-800 font-semibold text-sm sm:text-base leading-relaxed mt-1">
                      {item.solution}
                    </p>
                  </div>
                </div>

                {item.externalLink ? (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    해결책 보기
                  </a>
                ) : (
                  <Link
                    to={item.link!}
                    className="shrink-0 text-xs font-bold px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    해결책 보기
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
