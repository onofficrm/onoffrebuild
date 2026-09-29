import { useEffect, useState, type ReactNode } from 'react';
import {
  BookOpenText,
  Building2,
  ChevronDown,
  CircleHelp,
  Lightbulb,
  Target,
} from 'lucide-react';
import type { SlideLearningContent } from './content';
import { ExpiredDomainTipsPanel } from './ExpiredDomainTipsPanel';

type SectionId = 'details' | 'summary' | 'why' | 'onoffUse' | 'action';

interface SlideExplanationPanelProps {
  content: SlideLearningContent;
  onRelated?: () => void;
}

interface Section {
  id: SectionId;
  label: string;
  icon: ReactNode;
  body: string[];
}

export function SlideExplanationPanel({
  content,
  onRelated,
}: SlideExplanationPanelProps) {
  const hasDetails = (content.explanation.details?.length ?? 0) > 0;
  const [openSection, setOpenSection] = useState<SectionId>(hasDetails ? 'details' : 'summary');

  useEffect(() => {
    setOpenSection((content.explanation.details?.length ?? 0) > 0 ? 'details' : 'summary');
  }, [content.id]);

  const allSections: Section[] = [
    {
      id: 'summary',
      label: '핵심 설명',
      icon: <Lightbulb className="h-4 w-4" />,
      body: [content.explanation.summary],
    },
    {
      id: 'why',
      label: '왜 중요한가',
      icon: <CircleHelp className="h-4 w-4" />,
      body: content.explanation.why ?? [],
    },
    {
      id: 'onoffUse',
      label: '온오프마케팅 활용',
      icon: <Building2 className="h-4 w-4" />,
      body: content.explanation.onoffUse ?? [],
    },
    {
      id: 'action',
      label: '실행 포인트',
      icon: <Target className="h-4 w-4" />,
      body: content.explanation.action ?? [],
    },
  ];
  const sections = allSections.filter((section) => section.body.length > 0);

  return (
    <section
      aria-labelledby="slide-explanation-title"
      className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#2563EB]">
                Knowledge
              </span>
              <span className="text-xs font-semibold text-[#94A3B8]">
                {content.lessonId === 'lesson-1' ? '1강' : '2강'} · Slide {String(content.order).padStart(2, '0')}
              </span>
            </div>
            <h2 id="slide-explanation-title" className="mt-2 text-base font-black text-[#334155]">
              {content.shortTitle} 설명
            </h2>
          </div>
          <p className="font-mono text-[10px] font-black tracking-wider text-[#94A3B8]">
            SEE → UNDERSTAND → DO
          </p>
        </div>

        <div className="w-full space-y-2">
          {hasDetails ? (
            <div
              className={`overflow-hidden rounded-2xl border transition ${
                openSection === 'details' ? 'border-[#BFDBFE] bg-[#F8FBFF]' : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenSection('details')}
                aria-expanded={openSection === 'details'}
                className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
              >
                <span className={`flex items-center gap-2 text-sm font-black ${
                  openSection === 'details' ? 'text-[#1D4ED8]' : 'text-[#334155]'
                }`}>
                  <BookOpenText className="h-4 w-4" />
                  슬라이드 상세 설명
                </span>
                <ChevronDown className={`h-4 w-4 text-[#94A3B8] transition ${openSection === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'details' ? (
                <div className="space-y-4 border-t border-[#DBEAFE] px-4 py-4">
                  {content.explanation.details?.map((block) => (
                    <div key={block.heading}>
                      <h3 className="text-sm font-black text-[#1E293B]">{block.heading}</h3>
                      <ul className="mt-2 space-y-2">
                        {block.body.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#475569]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
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
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div
                key={section.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen ? 'border-[#BFDBFE] bg-[#F8FBFF]' : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(section.id)}
                  aria-expanded={isOpen}
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
                >
                  <span className={`flex items-center gap-2 text-sm font-black ${
                    isOpen ? 'text-[#1D4ED8]' : 'text-[#334155]'
                  }`}>
                    {section.icon}
                    {section.label}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-[#94A3B8] transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen ? (
                  <div className="border-t border-[#DBEAFE] px-4 py-4">
                    {section.id === 'summary' ? (
                      <p className="text-sm leading-7 text-[#475569]">{section.body[0]}</p>
                    ) : (
                      <ul className="space-y-2">
                        {section.body.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#475569]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}

          {content.relatedLabel && onRelated ? (
            <button
              type="button"
              onClick={onRelated}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#0F172A] px-4 text-xs font-bold text-white transition hover:bg-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {content.relatedLabel}
            </button>
          ) : null}
        </div>

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
