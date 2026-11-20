import { useState } from 'react';
import { ArrowRight, FileText, Link2, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HOMEPAGE_PLAN_FAQ,
  HOMEPAGE_PRICING_PLANS,
  HOMEPAGE_QUALITY_NOTE,
  planContactPath,
} from '../../data/homepagePricingPlans';
import {
  POINT_REDEEM_SERVICE_CARDS,
  POINT_USAGE_STEPS,
  SERVICE_POINT_SECTION,
  type PointRedeemServiceCard,
} from '../../data/servicePointRedeem';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { SectionHeading, SectionKicker } from '../ui/Typography';

const SERVICE_ICONS: Record<string, LucideIcon> = {
  backlink: Link2,
  traffic: TrendingUp,
  content: FileText,
};

function ServiceIcon({ id }: { id: string }) {
  const Icon = SERVICE_ICONS[id] ?? FileText;
  return <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />;
}

function PointRedeemCard({ item }: { item: PointRedeemServiceCard }) {
  return (
    <article className="flex h-full flex-col rounded-[16px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-subtle)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <ServiceIcon id={item.id} />
        </span>
        <h4 className="text-[15px] font-bold text-slate-950">{item.name}</h4>
      </div>
      <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-slate-600">{item.effect}</p>
      <Link
        to={item.path}
        className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700"
      >
        서비스 자세히 보기
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function HomepagePlanSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <section
        id="homepage-plans"
        className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-14 sm:py-20"
        aria-labelledby="homepage-plans-heading"
      >
        <Container>
          <FadeIn>
            <div className="max-w-[720px]">
              <SectionKicker>홈페이지 제작 상품</SectionKicker>
              <SectionHeading id="homepage-plans-heading" className="mt-2.5">
                제작비와 서비스 포인트로 선택하세요
              </SectionHeading>
              <p className="mt-3 text-[15px] leading-[1.65] text-slate-600">{HOMEPAGE_QUALITY_NOTE}</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {HOMEPAGE_PRICING_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex h-full flex-col rounded-[18px] border bg-white p-6 shadow-[var(--shadow-subtle)] ${
                    plan.highlighted
                      ? 'border-[#2563EB]/50 ring-2 ring-[#2563EB]/20 md:-translate-y-0.5'
                      : 'border-slate-200'
                  }`}
                >
                  <p className="text-[13px] font-bold tracking-wide text-blue-600">{plan.name}</p>

                  <p className="mt-4 text-[38px] font-bold leading-none tracking-[-0.03em] text-slate-950 tabular-metrics">
                    {plan.priceLabel}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-slate-500">홈페이지 제작비 (VAT 별도 상담)</p>

                  <div
                    className={`mt-5 rounded-[14px] px-4 py-4 ${
                      plan.highlighted
                        ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white'
                        : 'border border-slate-200 bg-slate-50'
                    }`}
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      서비스 포인트 제공
                    </p>
                    <p className="mt-1 text-[26px] font-bold leading-tight text-blue-700 tabular-metrics">
                      {plan.pointAmountLabel}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-[1.55] text-slate-600">
                      제작비 할인이 아닌, 마케팅 서비스 이용 혜택
                    </p>
                  </div>

                  <p className="mt-5 text-[15px] leading-[1.6] text-slate-700">{plan.audienceDescription}</p>

                  <Button
                    to={planContactPath(plan.contactPlanQuery)}
                    size="md"
                    className="mt-6 w-full"
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </article>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <section
        id="service-point-guide"
        className="scroll-mt-20 border-t border-slate-200 bg-white py-14 sm:py-18"
        aria-labelledby="service-point-guide-heading"
      >
        <Container>
          <FadeIn>
            <SectionKicker>서비스 포인트</SectionKicker>
            <SectionHeading id="service-point-guide-heading" className="mt-2.5 max-w-[640px]">
              {SERVICE_POINT_SECTION.title}
            </SectionHeading>
            {SERVICE_POINT_SECTION.lead.map((line) => (
              <p key={line} className="mt-2 max-w-[640px] text-[15px] leading-[1.65] text-slate-600">
                {line}
              </p>
            ))}
            <p className="mt-4 max-w-[680px] text-[13.5px] leading-[1.6] text-slate-500">
              {SERVICE_POINT_SECTION.pointBenefitNote}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {POINT_REDEEM_SERVICE_CARDS.map((item) => (
                <PointRedeemCard key={item.id} item={item} />
              ))}
            </div>

            <p className="mt-6 text-[13px] leading-[1.55] text-slate-500">{SERVICE_POINT_SECTION.policyNote}</p>

            <div className="mt-12 border-t border-slate-200 pt-10">
              <h3 className="text-[17px] font-bold text-slate-950">이용 방법</h3>
              <ol className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {POINT_USAGE_STEPS.map((step) => (
                  <li
                    key={step.step}
                    className="rounded-[14px] border border-slate-200 bg-slate-50 px-5 py-5"
                  >
                    <span className="text-[13px] font-bold text-blue-600">{step.step}</span>
                    <p className="mt-2 text-[16px] font-bold text-slate-950">{step.title}</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
        <Container>
          <FadeIn>
            <SectionKicker>요금제 FAQ</SectionKicker>
            <SectionHeading className="mt-2">자주 묻는 질문</SectionHeading>
            <ul className="mt-6 divide-y divide-slate-200 rounded-[16px] border border-slate-200 bg-white">
              {HOMEPAGE_PLAN_FAQ.map((item, idx) => {
                const open = openFaq === idx;
                const panelId = `plan-faq-panel-${idx}`;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-slate-950"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(open ? null : idx)}
                    >
                      {item.question}
                      <span className="text-xl leading-none text-slate-400" aria-hidden="true">
                        {open ? '−' : '+'}
                      </span>
                    </button>
                    {open ? (
                      <p
                        id={panelId}
                        className="px-5 pb-4 text-[14px] leading-[1.65] text-slate-600"
                      >
                        {item.answer}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}