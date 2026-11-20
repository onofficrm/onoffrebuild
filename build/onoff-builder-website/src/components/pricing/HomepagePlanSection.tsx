import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  HOMEPAGE_COMMON_INCLUDES,
  HOMEPAGE_PLAN_COMPARISON,
  HOMEPAGE_PLAN_FAQ,
  HOMEPAGE_PRICING_PLANS,
  planContactPath,
} from '../../data/homepagePricingPlans';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { SectionHeading, SectionKicker } from '../ui/Typography';

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
                자동화 기능과 서비스 포인트로 선택하세요
              </SectionHeading>
              <p className="mt-3 text-[15px] leading-[1.65] text-slate-600">
                제작 품질은 동일하고, 필요한 운영 자동화와 마케팅 서비스 포인트 총액만 다릅니다.
              </p>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2 text-[13px] text-slate-600">
              {HOMEPAGE_COMMON_INCLUDES.map((line) => (
                <li
                  key={line}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5"
                >
                  <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {HOMEPAGE_PRICING_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex h-full flex-col rounded-[18px] border bg-white p-6 shadow-[var(--shadow-subtle)] ${
                    plan.highlighted
                      ? 'border-[#2563EB]/40 ring-1 ring-[#2563EB]/15'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-bold tracking-wide text-blue-600">{plan.name}</p>
                      <p className="mt-0.5 text-[12.5px] font-semibold text-slate-500">{plan.subtitle}</p>
                    </div>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                        마케팅 자동화
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-[34px] font-bold leading-none tracking-[-0.03em] text-slate-950 tabular-metrics">
                    {plan.priceLabel}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.55] text-slate-600">{plan.description}</p>

                  <div className="mt-5 rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[12px] font-semibold text-slate-500">서비스 포인트</p>
                    <p className="mt-1 text-[15px] font-bold text-slate-950">{plan.pointLabel}</p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-slate-500">
                      온오프마케팅 지정 서비스에 사용 가능 (세부 정책은 상담·약관 확인)
                    </p>
                  </div>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-[13.5px] text-slate-700">
                    {plan.features.map((f) => (
                      <li key={`${plan.id}-${f.slug ?? f.label}`} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                        <span>
                          <span className="font-semibold text-slate-950">{f.label}</span>
                          {f.statusNote ? (
                            <span className="ml-1.5 text-[12px] font-medium text-slate-500">
                              ({f.statusNote})
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>

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

            <div className="mt-14">
              <h3 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">
                기능 비교
              </h3>
              <p className="mt-1 text-[13.5px] text-slate-600">
                자동화 항목은 플랫폼 직접 연동이 준비 중인 경우 표에 표기했습니다.
              </p>

              <div className="mt-5 hidden overflow-hidden rounded-[16px] border border-slate-200 bg-white md:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                        항목
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-slate-950">
                        STARTER
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-slate-950">
                        BUSINESS
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-slate-950">
                        PREMIUM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOMEPAGE_PLAN_COMPARISON.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 last:border-0">
                        <th scope="row" className="px-4 py-3.5 font-medium text-slate-700">
                          {row.label}
                        </th>
                        <td className="px-4 py-3.5 text-slate-800">{row.starter}</td>
                        <td className="px-4 py-3.5 text-slate-800">{row.business}</td>
                        <td className="px-4 py-3.5 text-slate-800">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 space-y-3 md:hidden">
                {HOMEPAGE_PLAN_COMPARISON.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[14px] border border-slate-200 bg-white p-4"
                  >
                    <p className="text-[14px] font-semibold text-slate-950">{row.label}</p>
                    <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px]">
                      <div className="flex justify-between gap-3">
                        <dt className="font-medium text-slate-500">STARTER</dt>
                        <dd className="text-right text-slate-800">{row.starter}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="font-medium text-slate-500">BUSINESS</dt>
                        <dd className="text-right text-slate-800">{row.business}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="font-medium text-slate-500">PREMIUM</dt>
                        <dd className="text-right text-slate-800">{row.premium}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
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
                      <span className="text-slate-400 text-xl leading-none" aria-hidden="true">
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