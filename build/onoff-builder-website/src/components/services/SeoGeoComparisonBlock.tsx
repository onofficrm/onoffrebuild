import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SeoGeoComparisonBlockProps {
  current: 'seo' | 'geo';
}

const COMPARISON_ROWS = [
  {
    criterion: '고객의 탐색 방식',
    seo: '포털·검색엔진에 키워드를 입력하고 검색 결과 목록에서 웹사이트를 클릭합니다.',
    geo: '생성형 AI 검색에 문장으로 질문하고, 요약된 답변과 참고 출처를 확인합니다.',
  },
  {
    criterion: '핵심 준비 요소',
    seo: '페이지 제목·메타 설명, 모바일 최적화, 깔끔한 URL과 내부링크 구조, 키워드 콘텐츠.',
    geo: '기업과 서비스에 대한 명확한 정의, 사실 기반 문장, 질문·답변(FAQ) 중심 구조화.',
  },
  {
    criterion: '웹사이트에서의 역할',
    seo: '검색엔진이 사이트의 모든 페이지를 빠짐없이 읽고 분류할 수 있는 기초 토대입니다.',
    geo: 'AI가 기업의 전문성과 서비스 범위를 오해 없이 해석하도록 돕는 정보 체계입니다.',
  },
  {
    criterion: '함께 운영할 때의 장점',
    seo: '기본 SEO 구조가 탄탄할수록 검색 유입과 AI 검색의 출처 신뢰도가 함께 높아집니다.',
    geo: '기존 SEO 자산 위에 GEO 진단을 더해 변화하는 검색 환경에 단계적으로 대응합니다.',
  },
];

export function SeoGeoComparisonBlock({ current }: SeoGeoComparisonBlockProps) {
  const siblingPath = current === 'seo' ? '/geo' : '/services/seo';
  const siblingLabel = current === 'seo' ? 'GEO 서비스 자세히 보기' : 'SEO 서비스 자세히 보기';

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[600px]">
          <p className="text-[13px] font-semibold text-blue-600">SEO와 GEO의 차이</p>
          <h3 className="mt-2 text-[22px] sm:text-[26px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
            전통 검색(SEO)과 AI 검색(GEO), 무엇이 다를까요?
          </h3>
          <p className="mt-2.5 text-[15px] leading-[1.65] text-slate-600">
            두 영역은 서로 대체하는 관계가 아니라, 고객이 정보를 찾는 두 가지 경로에 함께 대비하는
            보완 구조입니다.
          </p>
        </div>
        <Link
          to={siblingPath}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
        >
          <span>{siblingLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Desktop Column Headers */}
        <div className="hidden md:grid md:grid-cols-12 border-b border-slate-200 bg-slate-50 px-6 py-4 text-[13px] font-semibold">
          <div className="md:col-span-3 text-slate-500">비교 기준</div>
          <div
            className={`md:col-span-4 ${
              current === 'seo' ? 'text-blue-600' : 'text-slate-950'
            }`}
          >
            SEO · 검색엔진 최적화
          </div>
          <div
            className={`md:col-span-5 ${
              current === 'geo' ? 'text-blue-600' : 'text-slate-950'
            }`}
          >
            GEO · 생성형 AI 검색 대응
          </div>
        </div>

        <div className="divide-y divide-[#EAECF0]">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.criterion}
              className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-12 md:gap-6"
            >
              <div className="md:col-span-3">
                <p className="text-[14px] font-semibold text-slate-950">{row.criterion}</p>
              </div>
              <div className="md:col-span-4">
                <p className="mb-1 text-[12px] font-semibold text-slate-500 md:hidden">
                  SEO · 검색엔진 최적화
                </p>
                <p className="text-[14px] leading-[1.65] text-slate-600">{row.seo}</p>
              </div>
              <div className="md:col-span-5">
                <p className="mb-1 text-[12px] font-semibold text-blue-600 md:hidden">
                  GEO · 생성형 AI 검색 대응
                </p>
                <p className="text-[14px] leading-[1.65] text-slate-600">{row.geo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
