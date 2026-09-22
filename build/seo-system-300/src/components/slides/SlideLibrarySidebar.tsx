import { CheckCircle2, Layers3 } from 'lucide-react';
import {
  EDUCATION_DECKS,
  type EducationDeck,
} from './slideDeckRegistry';

interface SlideLibrarySidebarProps {
  currentDeckId: EducationDeck['id'];
  currentIndex: number;
  getDeckIndex: (deck: EducationDeck) => number;
  onSelect: (deck: EducationDeck, index: number) => void;
}

const TOTAL_SLIDES = EDUCATION_DECKS.reduce((total, deck) => total + deck.slides.length, 0);

export function SlideLibrarySidebar({
  currentDeckId,
  currentIndex,
  getDeckIndex,
  onSelect,
}: SlideLibrarySidebarProps) {
  const activeDeck = EDUCATION_DECKS.find((deck) => deck.id === currentDeckId);
  const globalCurrent = activeDeck?.slides[currentIndex]?.globalId ?? 1;
  const totalProgress = Math.round((globalCurrent / TOTAL_SLIDES) * 100);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xs">
      <div className="border-b border-[#E2E8F0] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <Layers3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#2563EB]">Course Index</p>
              <h2 className="text-sm font-black text-[#0F172A]">교육 슬라이드 목록</h2>
            </div>
          </div>
          <span className="font-mono text-xs font-black text-[#64748B]">{globalCurrent}/{TOTAL_SLIDES}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${totalProgress}%` }} />
        </div>
        <p className="mt-2 text-[11px] font-semibold text-[#64748B]">전체 과정 진행 위치 {totalProgress}%</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 custom-scrollbar">
        {EDUCATION_DECKS.map((deck) => {
          const deckIndex = getDeckIndex(deck);
          const isCurrentDeck = deck.id === currentDeckId;
          return (
            <section key={deck.id} className="mb-3 last:mb-0">
              <div className={`sticky top-0 z-10 rounded-xl border px-3 py-2.5 backdrop-blur ${
                isCurrentDeck
                  ? 'border-[#BFDBFE] bg-[#EFF6FF]/95'
                  : 'border-[#E2E8F0] bg-[#F8FAFC]/95'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#2563EB]">
                      Lecture {String(deck.lessonNumber).padStart(2, '0')}
                    </p>
                    <h3 className="mt-0.5 text-xs font-black text-[#0F172A]">{deck.shortTitle}</h3>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] font-bold text-[#64748B]">
                    {deckIndex + 1}/{deck.slides.length}
                  </span>
                </div>
              </div>

              <div className="mt-1 space-y-0.5">
                {deck.slides.map((slide, index) => {
                  const isActive = isCurrentDeck && index === currentIndex;
                  const isViewed = index <= deckIndex;
                  return (
                    <button
                      key={slide.slug}
                      type="button"
                      onClick={() => onSelect(deck, index)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                        isActive
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'text-[#475569] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <span className={`flex h-7 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-black ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}>
                        {String(slide.globalId).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[9px] font-black uppercase tracking-wider ${
                          isActive ? 'text-cyan-300' : 'text-[#94A3B8]'
                        }`}>
                          {slide.category}
                        </span>
                        <span className={`mt-0.5 block line-clamp-2 text-[11px] font-bold leading-snug ${
                          isActive ? 'text-white' : 'text-[#334155]'
                        }`}>
                          {slide.learningContent.shortTitle}
                        </span>
                      </span>
                      {isViewed && !isActive ? (
                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
