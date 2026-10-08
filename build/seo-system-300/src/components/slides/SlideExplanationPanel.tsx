import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SlideLearningContent } from './content';
import { ExpiredDomainTipsPanel } from './ExpiredDomainTipsPanel';

interface SlideExplanationPanelProps {
  content: SlideLearningContent;
  onRelated?: () => void;
}

export function SlideExplanationPanel({
  content,
  onRelated,
}: SlideExplanationPanelProps) {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setShowMore(false);
  }, [content.id]);

  const extraSections = [
    { label: '왜 중요한가', body: content.explanation.why ?? [] },
    { label: '온오프마케팅 활용', body: content.explanation.onoffUse ?? [] },
    { label: '실행 포인트', body: content.explanation.action ?? [] },
  ].filter((section) => section.body.length > 0);

  return (
    <section
      aria-labelledby="slide-explanation-title"
      className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6"
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-[#2563EB]">
            {content.lessonNumber ?? content.lessonId.replace(/\D/g, '')}강 · {content.order}장
          </p>
          <h2 id="slide-explanation-title" className="mt-1 text-lg font-black text-[#0F172A]">
            {content.shortTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#475569]">{content.explanation.summary}</p>
        </div>

        {content.explanation.details?.length ? (
          <div className="space-y-4 border-t border-[#E2E8F0] pt-4">
            {content.explanation.details.map((block) => (
              <div key={block.heading}>
                <h3 className="text-sm font-black text-[#1E293B]">{block.heading}</h3>
                <ul className="mt-2 space-y-1.5">
                  {block.body.map((item) => (
                    <li key={item} className="text-sm leading-6 text-[#475569]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {extraSections.length > 0 ? (
          <div className="border-t border-[#E2E8F0] pt-3">
            <button
              type="button"
              onClick={() => setShowMore((open) => !open)}
              aria-expanded={showMore}
              className="flex min-h-11 items-center gap-1.5 text-sm font-bold text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {showMore ? '추가 설명 닫기' : '추가 설명 보기'}
              <ChevronDown className={`h-4 w-4 transition ${showMore ? 'rotate-180' : ''}`} />
            </button>
            {showMore ? (
              <div className="mt-3 space-y-4">
                {extraSections.map((section) => (
                  <div key={section.label}>
                    <h3 className="text-sm font-black text-[#1E293B]">{section.label}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {section.body.map((item) => (
                        <li key={item} className="text-sm leading-6 text-[#475569]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {content.relatedLabel && onRelated ? (
          <button
            type="button"
            onClick={onRelated}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F172A] px-4 text-xs font-bold text-white transition hover:bg-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            {content.relatedLabel}
          </button>
        ) : null}

        {content.expiredDomainTips ? (
          <ExpiredDomainTipsPanel
            tips={content.expiredDomainTips}
            mode={content.expiredDomainTipsMode}
          />
        ) : null}
      </div>
    </section>
  );
}
