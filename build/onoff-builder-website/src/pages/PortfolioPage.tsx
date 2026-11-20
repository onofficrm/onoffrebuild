import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import {
  getPublicPortfolioItems,
  PORTFOLIO_FILTERS,
  type PortfolioFilterOption,
  type PortfolioItem,
} from '../data/portfolio';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { EditorialImage } from '../components/ui/EditorialImage';
import { FadeIn } from '../components/ui/FadeIn';
import {
  DisplayHeading,
  LeadText,
  SectionKicker,
} from '../components/ui/Typography';

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<PortfolioFilterOption>('전체');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const publicItems = getPublicPortfolioItems();
  const realCount = publicItems.filter((item) => !item.isConceptExample).length;

  const filteredItems =
    activeFilter === '전체'
      ? publicItems
      : publicItems.filter((item) => item.category === activeFilter);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    }
    if (selectedItem) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  return (
    <>
      {/* Hero & Filters */}
      <section className="bg-white pt-10 pb-10 sm:pt-14 sm:pb-12 lg:pt-16">
        <Container>
          <FadeIn immediate>
            <SectionKicker>제작사례</SectionKicker>
            <DisplayHeading className="mt-3 max-w-[780px]">
              브랜드의 격을 높이는
              <br />
              웹사이트 디자인 기준.
            </DisplayHeading>
            <LeadText className="mt-4 max-w-[620px]">
              실제 공개 협의를 마친 고객 프로젝트만 제작사례로 등록하며, 가상의 사례나 임의 로고는
              사용하지 않습니다.
            </LeadText>

            {/* Compact Transparent Separation Bar */}
            <div className="mt-7 rounded-[14px] border border-slate-200 bg-slate-50 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13.5px] leading-[1.55] text-slate-600">
                <span className="font-semibold text-slate-950">
                  실제 공개 제작사례 {realCount}건 (순차 등록 예정)
                </span>
                <span className="mx-2 text-[#D0D5DD]" aria-hidden="true">
                  ·
                </span>
                아래 항목은 실제 고객 실적이 아닌{' '}
                <strong className="font-semibold text-slate-950">콘셉트 디자인 예시</strong>로
                구분 표기합니다.
              </p>
              <Button to="/contact?service=website" variant="secondary" size="sm">
                맞춤 시안 상담
              </Button>
            </div>

            {/* Category Filters: 전체 / 기업 / 전문직 / 커뮤니티 / 랜딩페이지 */}
            <div
              role="tablist"
              aria-label="제작사례 카테고리 필터"
              className="mt-7 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-5"
            >
              {PORTFOLIO_FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-[38px] rounded-[8px] px-3.5 py-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                      active
                        ? 'bg-[#101828] text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-[#F2F4F7] hover:text-slate-950'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Thumbnail-First Minimal Portfolio Gallery */}
      <section className="bg-white pb-16 sm:pb-24">
        <Container>
          {filteredItems.length === 0 ? (
            <FadeIn>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-6 py-14 sm:px-12 sm:py-16 text-center">
                <p className="text-[12.5px] font-semibold text-blue-600">{activeFilter} 카테고리</p>
                <h2 className="mt-2.5 text-[21px] sm:text-[24px] font-bold tracking-[-0.02em] text-slate-950">
                  현재 ‘{activeFilter}’ 공개 제작사례를 준비 중입니다
                </h2>
                <p className="mx-auto mt-2.5 max-w-[500px] text-[14.5px] leading-[1.6] text-slate-600">
                  실제 고객사의 공개 동의를 마친 프로젝트부터 순차 등록됩니다. 업종에 맞는 구성
                  방향은 상담으로 안내해 드립니다.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Button to="/contact?service=website" size="md">
                    <span>{activeFilter} 상담하기</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setActiveFilter('전체')}
                  >
                    전체 예시 보기
                  </Button>
                </div>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, idx) => (
                <FadeIn key={item.id} delay={idx * 0.04}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-subtle)]">
                    {/* Thumbnail Centerpiece */}
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`${item.title} 상세 구성 보기`}
                      className="block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                    >
                      <EditorialImage
                        src={item.thumbnail}
                        alt={item.thumbnailAlt}
                        aspectClass="aspect-[16/11] w-full"
                        fallbackTitle={item.title}
                        className="rounded-none border-0"
                      />
                    </button>

                    {/* Minimal Metadata Only: Status, Industry, Title */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[12px]">
                          <span
                            className={`font-semibold ${
                              item.isConceptExample ? 'text-blue-600' : 'text-slate-950'
                            }`}
                          >
                            {item.isConceptExample ? '콘셉트 디자인 예시' : '실제 제작사례'}
                          </span>
                          <span className="text-slate-500 truncate">{item.industry}</span>
                        </div>

                        <h2 className="mt-2 text-[17.5px] font-bold leading-[1.34] tracking-[-0.02em] text-slate-950 group-hover:text-blue-600 transition-colors">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="text-left cursor-pointer"
                          >
                            {item.title}
                          </button>
                        </h2>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-3.5 text-[13px]">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="font-semibold text-slate-950 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          상세 구성 보기
                        </button>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <span>사이트 방문</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="text-[12px] text-slate-500">{item.category}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
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
                  원하시는 분위기나 참고 구조가 있다면
                  <br />
                  상담으로 편하게 공유해 주세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  업종과 목적에 맞는 홈페이지 설계 방향과 진행 기준을 1:1 상담으로 안내합니다.
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

      {/* Accessible Detail Preview Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 p-4 sm:p-6 backdrop-blur-[2px]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[780px] overflow-y-auto rounded-[18px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-semibold text-blue-600">
                  {selectedItem.isConceptExample ? '콘셉트 디자인 예시' : '실제 제작사례'}
                </span>
                <span aria-hidden="true" className="text-[#D0D5DD]">
                  ·
                </span>
                <span className="text-slate-500">{selectedItem.category}</span>
              </div>
              <button
                type="button"
                aria-label="상세 창 닫기"
                onClick={() => setSelectedItem(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-7">
              <EditorialImage
                src={selectedItem.thumbnail}
                alt={selectedItem.thumbnailAlt}
                aspectClass="aspect-[16/10] w-full"
                fallbackTitle={selectedItem.title}
              />

              <h3
                id="portfolio-modal-title"
                className="mt-5 text-[22px] font-bold tracking-[-0.02em] text-slate-950"
              >
                {selectedItem.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.66] text-slate-600">
                {selectedItem.description}
              </p>

              <dl className="mt-5 divide-y divide-[#EAECF0] border-y border-slate-200 text-[13.5px]">
                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-slate-500">업종</dt>
                  <dd className="sm:col-span-2 font-medium text-slate-950">
                    {selectedItem.industry}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-slate-500">구분</dt>
                  <dd className="sm:col-span-2 font-medium text-blue-600">
                    {selectedItem.isConceptExample
                      ? '콘셉트 디자인 예시 (실제 고객 제작물 아님)'
                      : '실제 고객 제작사례'}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-slate-500">URL</dt>
                  <dd className="sm:col-span-2 text-slate-600">
                    {selectedItem.url ? (
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline break-all"
                      >
                        <span>{selectedItem.url}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      '콘셉트 예시로 별도 외부 URL 없음'
                    )}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-slate-500">주요 기능</dt>
                  <dd className="sm:col-span-2 space-y-1 text-slate-950">
                    {selectedItem.features.map((feat) => (
                      <p key={feat}>· {feat}</p>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setSelectedItem(null)}>
                  닫기
                </Button>
                <Button to="/contact?service=website">
                  <span>이 스타일로 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
