import {
  EDUCATION_DECKS,
  type EducationDeck,
} from './slideDeckRegistry';

interface SlideLibrarySidebarProps {
  currentDeckId: EducationDeck['id'];
  currentIndex: number;
  onSelect: (deck: EducationDeck, index: number) => void;
}

export function SlideLibrarySidebar({
  currentDeckId,
  currentIndex,
  onSelect,
}: SlideLibrarySidebarProps) {
  const deck = EDUCATION_DECKS.find((item) => item.id === currentDeckId) ?? EDUCATION_DECKS[0];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xs">
      <div className="border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-sm font-black text-[#0F172A]">{deck.lessonNumber}강 목차</h2>
        <p className="mt-0.5 text-xs text-[#64748B]">{currentIndex + 1} / {deck.slides.length}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 custom-scrollbar">
        {deck.slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.slug}
              type="button"
              onClick={() => onSelect(deck, index)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isActive ? 'bg-[#0F172A] text-white' : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className={`w-5 shrink-0 text-xs font-bold ${isActive ? 'text-cyan-300' : 'text-[#94A3B8]'}`}>
                {index + 1}
              </span>
              <span className="min-w-0 truncate text-sm font-bold">{slide.learningContent.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
