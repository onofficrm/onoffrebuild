import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/assets';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { EditorialImage } from '../components/ui/EditorialImage';
import { FadeIn } from '../components/ui/FadeIn';
import {
  DisplayHeading,
  LeadText,
  SectionHeading,
  SectionKicker,
} from '../components/ui/Typography';

type IndustryFilterId =
  | 'all'
  | 'medical-pro'
  | 'interior'
  | 'corporate'
  | 'education'
  | 'community'
  | 'tourism';

interface IndustryUseCase {
  id: Exclude<IndustryFilterId, 'all'>;
  number: string;
  label: string;
  mockUrl: string;
  headline: string;
  oneLineSummary: string;
  image: string;
  imageAlt: string;
  keyPages: string[];
  customNote: string;
}

const INDUSTRY_USE_CASES: IndustryUseCase[] = [
  {
    id: 'medical-pro',
    number: '01',
    label: '병원·치과·전문직',
    mockUrl: 'clinic-example.onoff.site',
    headline: '전문 분야와 상담 동선이 한눈에 보이는 신뢰형 구조',
    oneLineSummary: '진료 과목·의료진 소개·상담 문의를 정돈하고 일정 변경을 운영관리로 반영합니다.',
    image: EDITORIAL_IMAGES.conceptMedical.src,
    imageAlt: EDITORIAL_IMAGES.conceptMedical.alt,
    keyPages: ['진료·전문 분야', '의료진·전문가', '상담 · 오시는 길'],
    customNote: '온라인 예약·다국어 안내는 맞춤 추가 개발 협의',
  },
  {
    id: 'interior',
    number: '02',
    label: '인테리어·시공업체',
    mockUrl: 'interior-example.onoff.site',
    headline: '시공 사진을 크게 보여주는 포트폴리오 중심 구조',
    oneLineSummary: '공간별 대형 시공 갤러리와 평수·예산 기반 견적 문의를 연결합니다.',
    image: EDITORIAL_IMAGES.conceptInterior.src,
    imageAlt: EDITORIAL_IMAGES.conceptInterior.alt,
    keyPages: ['공간별 시공사례', '시공 절차·A/S', '견적 상담 폼'],
    customNote: '고급 필터·예상 견적 계산기는 맞춤 추가 개발 협의',
  },
  {
    id: 'corporate',
    number: '03',
    label: '기업·소상공인',
    mockUrl: 'corp-example.onoff.site',
    headline: '대외 신뢰와 B2B 문의를 높이는 공식 비즈니스 창구',
    oneLineSummary: '회사소개·제품 카탈로그·납품 제휴 문의를 갖추고 내부 담당자 없이 운영합니다.',
    image: EDITORIAL_IMAGES.digitalInfrastructure.src,
    imageAlt: EDITORIAL_IMAGES.digitalInfrastructure.alt,
    keyPages: ['회사·사업 소개', '카탈로그 자료실', 'B2B 도입 상담'],
    customNote: '쇼핑몰·결제·다국어 확장은 맞춤 추가 개발 협의',
  },
  {
    id: 'education',
    number: '04',
    label: '교육·컨설팅',
    mockUrl: 'edu-example.onoff.site',
    headline: '커리큘럼과 전문 인사이트를 정리한 정보 전달형 구조',
    oneLineSummary: '대상별 과정 비교·강사진 소개·모집 일정 변경을 유연하게 관리합니다.',
    image: EDITORIAL_IMAGES.managedWorkflow.src,
    imageAlt: EDITORIAL_IMAGES.managedWorkflow.alt,
    keyPages: ['커리큘럼 안내', '강사진·프로세스', '수강·출강 문의'],
    customNote: '수강 결제·회원 학습 페이지는 맞춤 추가 개발 협의',
  },
  {
    id: 'community',
    number: '05',
    label: '커뮤니티·정보 플랫폼',
    mockUrl: 'archive-example.onoff.site',
    headline: '공지와 자료가 체계적으로 쌓이는 아카이브형 구조',
    oneLineSummary: '주제별 게시판·자료실과 검색 친화적 페이지 계층으로 정보를 축적합니다.',
    image: EDITORIAL_IMAGES.conceptEditorial.src,
    imageAlt: EDITORIAL_IMAGES.conceptEditorial.alt,
    keyPages: ['카테고리 게시판', '자료실·공지 허브', '제보·참여 접수'],
    customNote: '회원 등급·고급 커뮤니티·결제는 맞춤 추가 개발 협의',
  },
  {
    id: 'tourism',
    number: '06',
    label: '관광·지역정보 플랫폼',
    mockUrl: 'local-example.onoff.site',
    headline: '공간 매력과 지역 정보를 모바일 중심으로 안내하는 구조',
    oneLineSummary: '대형 공간 비주얼과 코스·이용 안내, 시즌별 배너 교체를 손쉽게 운영합니다.',
    image: EDITORIAL_IMAGES.heroStudio.src,
    imageAlt: EDITORIAL_IMAGES.heroStudio.alt,
    keyPages: ['공간·코스 소개', '교통·계절 소식', '단체·제휴 문의'],
    customNote: '실시간 예약·결제·다국어는 맞춤 추가 개발 협의',
  },
];

const CUSTOM_ADDONS = [
  {
    number: '01',
    title: '예약 시스템 연동',
    description: '진료·상담·체험 일정에 맞춘 날짜·시간 선택 예약이나 외부 플랫폼 연동 개발',
  },
  {
    number: '02',
    title: '쇼핑몰 및 상품 주문',
    description: '장바구니, 옵션 선택, 주문 관리가 필요한 사업에 맞춘 커머스 구조 설계',
  },
  {
    number: '03',
    title: '결제(PG) 연동',
    description: '수강료, 예약금, 상품 구매 등 온라인 결제 및 정산 흐름 구축',
  },
  {
    number: '04',
    title: '다국어 홈페이지 구성',
    description: '영문·일문·중문 전환 구조와 언어별 SEO 기본 설정 맞춤 개발',
  },
];

export function UseCasesPage() {
  const [selectedFilter, setSelectedFilter] = useState<IndustryFilterId>('all');

  const visibleCases =
    selectedFilter === 'all'
      ? INDUSTRY_USE_CASES
      : INDUSTRY_USE_CASES.filter((item) => item.id === selectedFilter);

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-10 pb-10 sm:pt-14 sm:pb-12 lg:pt-16">
        <Container>
          <FadeIn immediate>
            <SectionKicker>활용사례 · 업종별 활용 예시</SectionKicker>
            <DisplayHeading className="mt-3 max-w-[780px]">
              어떤 비즈니스에도,
              <br />
              그에 맞는 홈페이지가 있습니다.
            </DisplayHeading>
            <LeadText className="mt-4 max-w-[600px]">
              업종별 고객 탐색 흐름에 맞춘 대표 구성입니다. 아래 화면은 실제 고객 사례가 아닌
              업종별 구성 이해를 돕는 활용 예시입니다.
            </LeadText>

            {/* Industry Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-5">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`min-h-[38px] rounded-[8px] px-3.5 py-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-[#101828] text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-[#F2F4F7] hover:text-slate-950'
                }`}
              >
                전체 업종 (6)
              </button>
              {INDUSTRY_USE_CASES.map((item) => {
                const active = selectedFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedFilter(item.id)}
                    className={`min-h-[38px] rounded-[8px] px-3.5 py-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                      active
                        ? 'bg-[#101828] text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-[#F2F4F7] hover:text-slate-950'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Visual-First Industry Mockup Grid */}
      <section className="bg-white pb-16 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleCases.map((item) => (
              <FadeIn key={item.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-subtle)]">
                  {/* Website Mockup Frame — Visual First */}
                  <div className="border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 text-[11.5px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="h-2 w-2 rounded-full bg-[#D0D5DD]" aria-hidden="true" />
                        <span className="h-2 w-2 rounded-full bg-[#D0D5DD]" aria-hidden="true" />
                        <span className="h-2 w-2 rounded-full bg-[#D0D5DD]" aria-hidden="true" />
                        <span className="ml-2 truncate font-medium text-slate-500">
                          {item.mockUrl}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600 shrink-0">활용 예시</span>
                    </div>
                    <EditorialImage
                      src={item.image}
                      alt={`${item.label} 홈페이지 활용 예시 — ${item.imageAlt}`}
                      aspectClass="aspect-[16/10] w-full"
                      fallbackTitle={item.label}
                      className="rounded-none border-0 border-t border-slate-200"
                    />
                  </div>

                  {/* Concise 1-Line Info & Structure */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="font-semibold text-blue-600">
                          <span className="tabular-metrics">{item.number}</span> · {item.label}
                        </span>
                        <span className="text-slate-500">활용 예시</span>
                      </div>

                      <h2 className="mt-2.5 text-[18.5px] font-bold leading-[1.32] tracking-[-0.02em] text-slate-950">
                        {item.headline}
                      </h2>
                      <p className="mt-1.5 text-[13.5px] leading-[1.58] text-slate-600">
                        {item.oneLineSummary}
                      </p>

                      {/* Compact Page Flow */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 pt-3.5 text-[12px] text-[#344054]">
                        {item.keyPages.map((page, idx) => (
                          <span key={page} className="inline-flex items-center gap-1">
                            <span className="font-semibold tabular-metrics text-blue-600">
                              0{idx + 1}
                            </span>
                            <span>{page}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3.5">
                      <span className="text-[12px] text-slate-500 truncate">{item.customNote}</span>
                      <Link
                        to="/contact?service=website"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                      >
                        <span>상담하기</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Custom Add-on Development Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-20">
        <Container>
          <FadeIn>
            <div className="max-w-[680px]">
              <SectionKicker>맞춤형 추가 개발</SectionKicker>
              <SectionHeading className="mt-2.5">
                예약·쇼핑몰·결제·다국어는 필요 시 맞춤 확장합니다
              </SectionHeading>
              <LeadText className="mt-3">
                사업 모델에 꼭 필요한 기능만 상담 단계에서 범위를 정의해 별도 협의 개발합니다.
              </LeadText>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CUSTOM_ADDONS.map((addon) => (
                <div
                  key={addon.number}
                  className="rounded-[16px] border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold tabular-metrics text-blue-600">
                      {addon.number}
                    </span>
                    <span className="text-slate-500">별도 협의</span>
                  </div>
                  <h3 className="mt-3 text-[16.5px] font-bold text-slate-950">{addon.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-slate-600">
                    {addon.description}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Deep Navy Closing CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  우리 업종에 꼭 필요한 구성만 담아
                  <br />
                  홈페이지를 시작해 보세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  기본 구축 범위부터 예약·결제·다국어 같은 맞춤형 추가 개발 여부까지 상담으로
                  안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=website" size="lg">
                  <span>상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
