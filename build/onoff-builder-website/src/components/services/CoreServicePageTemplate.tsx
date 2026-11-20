import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';
import {
  DisplayHeading,
  LeadText,
  SectionHeading,
  SectionKicker,
} from '../ui/Typography';

export interface CoreReasonItem {
  number: string;
  title: string;
  description: string;
}

export interface CoreFeatureItem {
  number: string;
  title: string;
  scopeNote: string;
  description: string;
}

export interface CoreProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface CoreFaqItem {
  question: string;
  answer: string;
}

export interface RelatedServiceLink {
  label: string;
  description: string;
  to: string;
}

export interface CoreServicePageProps {
  kicker: string;
  headline: ReactNode;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaTo: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;

  reasonsKicker: string;
  reasonsHeading: ReactNode;
  reasonsLead: string;
  reasons: CoreReasonItem[];
  reasonsFootnote?: ReactNode;

  featuresKicker: string;
  featuresHeading: ReactNode;
  featuresLead: string;
  featuresNotice?: string;
  features: CoreFeatureItem[];
  featuresExtraSection?: ReactNode;

  previewKicker: string;
  previewHeading: ReactNode;
  previewLead: string;
  previewComponent: ReactNode;

  processKicker: string;
  processHeading: ReactNode;
  processLead?: string;
  processSteps: CoreProcessStep[];

  relatedLinks?: RelatedServiceLink[];

  faqs: CoreFaqItem[];

  ctaTitle: ReactNode;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonTo: string;
}

export function CoreServicePageTemplate({
  kicker,
  headline,
  heroDescription,
  primaryCtaLabel,
  primaryCtaTo,
  secondaryCtaLabel,
  secondaryCtaHref,
  reasonsKicker,
  reasonsHeading,
  reasonsLead,
  reasons,
  reasonsFootnote,
  featuresKicker,
  featuresHeading,
  featuresLead,
  featuresNotice,
  features,
  featuresExtraSection,
  previewKicker,
  previewHeading,
  previewLead,
  previewComponent,
  processKicker,
  processHeading,
  processLead,
  processSteps,
  relatedLinks,
  faqs,
  ctaTitle,
  ctaDescription,
  ctaButtonLabel,
  ctaButtonTo,
}: CoreServicePageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* 1. Hero — Consistent Visual Scale & Clear Basic-vs-Service Boundary */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <Container>
          <FadeIn immediate>
            <div className="max-w-[780px]">
              <SectionKicker>{kicker}</SectionKicker>
              <DisplayHeading className="mt-3">{headline}</DisplayHeading>
              <LeadText className="mt-4 max-w-[640px]">{heroDescription}</LeadText>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button to={primaryCtaTo} size="lg">
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href={secondaryCtaHref} variant="secondary" size="lg">
                  {secondaryCtaLabel}
                </Button>
              </div>

              <p className="mt-5 text-[12.5px] text-slate-500">
                ONOFF Builder 기본 기능(루틴·스텝메일·오토포스터·쉬운 수정·AI 기능 개발)과 구분되는
                전문 서비스 영역입니다.{' '}
                <Link
                  to="/features"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  기본 기능 보기
                </Link>
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* 2. Product & Feature Screen Preview (Visual-First Placement) */}
      <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-20">
        <Container size="wide">
          <FadeIn>
            <div className="max-w-[680px]">
              <SectionKicker>{previewKicker}</SectionKicker>
              <SectionHeading className="mt-2.5">{previewHeading}</SectionHeading>
              <LeadText className="mt-3">{previewLead}</LeadText>
            </div>

            <div className="mt-8">{previewComponent}</div>
          </FadeIn>
        </Container>
      </section>

      {/* 3. Why Customers Need This Service */}
      <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
        <Container>
          <FadeIn>
            <div className="max-w-[680px]">
              <SectionKicker>{reasonsKicker}</SectionKicker>
              <SectionHeading className="mt-2.5">{reasonsHeading}</SectionHeading>
              <LeadText className="mt-3">{reasonsLead}</LeadText>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
              {reasons.map((item) => (
                <div
                  key={item.number}
                  className="rounded-[16px] border border-slate-200 bg-slate-50 p-6"
                >
                  <p className="text-[12px] font-semibold tabular-metrics text-blue-600">
                    {item.number}
                  </p>
                  <h3 className="mt-3 text-[17.5px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.64] text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {reasonsFootnote && <div className="mt-6">{reasonsFootnote}</div>}
          </FadeIn>
        </Container>
      </section>

      {/* 4. Provided Features & How It Is Used */}
      <section
        id="features"
        className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-14 sm:py-20"
      >
        <Container>
          <FadeIn>
            <div className="max-w-[680px]">
              <SectionKicker>{featuresKicker}</SectionKicker>
              <SectionHeading className="mt-2.5">{featuresHeading}</SectionHeading>
              <LeadText className="mt-3">{featuresLead}</LeadText>
            </div>

            {featuresNotice && (
              <div className="mt-6 rounded-[14px] border border-slate-200 bg-white px-5 py-3.5">
                <p className="text-[13.5px] leading-[1.58] text-slate-600">{featuresNotice}</p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="flex flex-col justify-between rounded-[16px] border border-slate-200 bg-white p-6 transition-colors duration-150 hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="font-semibold tabular-metrics text-blue-600">
                        {feature.number}
                      </span>
                      <span className="text-slate-500">{feature.scopeNote}</span>
                    </div>
                    <h3 className="mt-3 text-[17px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-[1.64] text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {featuresExtraSection && <div className="mt-10">{featuresExtraSection}</div>}
          </FadeIn>
        </Container>
      </section>

      {/* 5. Service Process & Related Services */}
      <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
        <Container>
          <FadeIn>
            <div className="max-w-[660px]">
              <SectionKicker>{processKicker}</SectionKicker>
              <SectionHeading className="mt-2.5">{processHeading}</SectionHeading>
              {processLead && <LeadText className="mt-3">{processLead}</LeadText>}
            </div>

            <div className="mt-10 relative">
              <div
                aria-hidden="true"
                className="hidden lg:block absolute top-[17px] left-0 right-0 h-px bg-[#D0D5DD]"
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((step) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-center gap-3">
                      <span className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-[12.5px] font-semibold tabular-metrics text-blue-600">
                        {step.step}
                      </span>
                      <div aria-hidden="true" className="h-px flex-1 bg-[#EAECF0] lg:hidden" />
                    </div>
                    <h3 className="mt-4 text-[17px] font-bold tracking-[-0.02em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-[1.62] text-slate-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {relatedLinks && relatedLinks.length > 0 && (
              <div className="mt-12 border-t border-slate-200 pt-10">
                <p className="text-[12.5px] font-semibold text-slate-500">함께 연결하면 좋은 서비스</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {relatedLinks.map((rel) => (
                    <Link
                      key={rel.to}
                      to={rel.to}
                      className="group flex flex-col justify-between rounded-[14px] border border-slate-200 bg-slate-50 p-5 transition-[border-color,background-color] duration-150 hover:border-slate-300 hover:bg-white"
                    >
                      <div>
                        <p className="text-[15.5px] font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                          {rel.label}
                        </p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.58] text-slate-600">
                          {rel.description}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                        자세히 보기
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        </Container>
      </section>

      {/* 6. Collapsed FAQ Accordion */}
      <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-20">
        <Container>
          <FadeIn>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionKicker>자주 묻는 질문</SectionKicker>
                <h2 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                  도입 전 궁금한 점을 확인하세요
                </h2>
                <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
                  프로젝트 성격에 따라 세부 기준이 달라질 수 있으며, 상담을 통해 알맞은 구성을
                  안내합니다.
                </p>
              </div>

              <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const panelId = `service-faq-panel-${idx}`;
                  return (
                    <div key={faq.question}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="flex min-h-[54px] w-full items-center justify-between gap-4 py-4 text-left cursor-pointer"
                      >
                        <span className="text-[14.5px] sm:text-[15.5px] font-semibold leading-snug text-slate-950">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                            isOpen ? 'rotate-180 text-slate-950' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div id={panelId} className="pb-4 pr-2 sm:pr-6">
                          <p className="text-[14px] leading-[1.68] text-slate-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* 7. Consultation CTA (Deep Navy matching HomePage) */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  {ctaTitle}
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">{ctaDescription}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to={ctaButtonTo} size="lg">
                  <span>{ctaButtonLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/pricing" variant="inverseGhost" size="lg">
                  요금안내 보기
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
