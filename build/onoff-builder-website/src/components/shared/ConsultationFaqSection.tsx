import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COMMON_CONSULTATION_FAQS, type FaqEntry } from '../../data/faqs';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { SectionHeading, SectionKicker } from '../ui/Typography';

export { COMMON_CONSULTATION_FAQS, type FaqEntry };

interface ConsultationFaqSectionProps {
  id?: string;
  bgClass?: string;
  title?: string;
  description?: string;
}

export function ConsultationFaqSection({
  id = 'faq',
  bgClass = 'bg-white',
  title = '제작부터 운영·비용까지 자주 묻는 질문',
  description = '확정되지 않은 조건이나 임의 수치를 약속하지 않고, 실제 협업 기준에 맞춰 투명하게 안내합니다.',
}: ConsultationFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-slate-200 py-14 sm:py-20 ${bgClass}`}
    >
      <Container>
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문 (FAQ)</SectionKicker>
              <SectionHeading className="mt-2.5">{title}</SectionHeading>
              <p className="mt-3 text-[14.5px] leading-[1.64] text-slate-600">{description}</p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {COMMON_CONSULTATION_FAQS.map((item, idx) => {
                const isOpen = openIndex === idx;
                const panelId = `${id}-panel-${idx}`;
                return (
                  <div key={item.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="block text-[11.5px] font-semibold text-blue-600">
                          {item.topic}
                        </span>
                        <span className="block text-[14.5px] sm:text-[15.5px] font-semibold leading-snug text-slate-950">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-slate-950' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div id={panelId} className="pb-4 pr-2 sm:pr-6">
                        <p className="text-[14px] leading-[1.68] text-slate-600">{item.answer}</p>
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
  );
}
