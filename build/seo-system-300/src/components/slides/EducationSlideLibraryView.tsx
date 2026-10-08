import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  List,
  Maximize2,
  Minimize2,
  PanelLeftClose,
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { Button } from '../common/Button';
import { FixedSlideCanvas } from './FixedSlideCanvas';
import { SlideExplanationPanel } from './SlideExplanationPanel';
import { SlideLibrarySidebar } from './SlideLibrarySidebar';
import {
  EDUCATION_DECKS,
  getEducationDeck,
  getNextDeck,
  getPreviousDeck,
  type EducationDeck,
} from './slideDeckRegistry';

export interface EducationSlideLibraryViewProps {
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

function progressKey(deckId: string) {
  return `seosys300_slide_progress_${deckId}`;
}

function storedSlideIndex(deck: EducationDeck): number {
  try {
    const value = Number(window.localStorage.getItem(progressKey(deck.id)));
    return Number.isInteger(value) && value >= 0 && value < deck.slides.length ? value : 0;
  } catch {
    return 0;
  }
}

export function EducationSlideLibraryView({ onNavigate }: EducationSlideLibraryViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const route = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const deck = getEducationDeck(parts[1]);
    const requested = Number(parts[2]);
    const index =
      Number.isInteger(requested) && requested >= 1 && requested <= deck.slides.length
        ? requested - 1
        : storedSlideIndex(deck);
    return { deck, index };
  }, [location.pathname]);

  const { deck, index: currentIndex } = route;
  const currentSlide = deck.slides[currentIndex] ?? deck.slides[0];
  const CurrentSlide = currentSlide.component;
  const progress = Math.round(((currentIndex + 1) / deck.slides.length) * 100);

  const goTo = useCallback(
    (index: number, targetDeck = deck) => {
      const nextIndex = Math.max(0, Math.min(targetDeck.slides.length - 1, index));
      navigate(`/slides/${targetDeck.id}/${nextIndex + 1}`);
    },
    [deck, navigate],
  );

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
      return;
    }
    const previousDeck = getPreviousDeck(deck);
    if (previousDeck) goTo(previousDeck.slides.length - 1, previousDeck);
  }, [currentIndex, deck, goTo]);

  const next = useCallback(() => {
    if (currentIndex < deck.slides.length - 1) {
      goTo(currentIndex + 1);
      return;
    }
    const nextDeck = getNextDeck(deck);
    if (nextDeck) goTo(0, nextDeck);
  }, [currentIndex, deck, goTo]);

  useEffect(() => {
    try {
      window.localStorage.setItem(progressKey(deck.id), String(currentIndex));
    } catch {
      // Progress persistence is optional.
    }

    const canonicalPath = `/slides/${deck.id}/${currentIndex + 1}`;
    if (location.pathname !== canonicalPath) navigate(canonicalPath, { replace: true });
  }, [currentIndex, deck.id, location.pathname, navigate]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await viewerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        previous();
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(deck.slides.length - 1);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        void toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deck.slides.length, goTo, next, previous, toggleFullscreen]);

  const selectDeck = (targetDeck: EducationDeck) => {
    goTo(storedSlideIndex(targetDeck), targetDeck);
    setSidebarOpen(false);
  };

  const selectSlide = useCallback(
    (targetDeck: EducationDeck, slideIndex: number) => {
      goTo(slideIndex, targetDeck);
      setSidebarOpen(false);
    },
    [goTo],
  );

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current == null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) next();
    else previous();
  };

  const hasPrevious = currentIndex > 0 || Boolean(getPreviousDeck(deck));
  const hasNext = currentIndex < deck.slides.length - 1 || Boolean(getNextDeck(deck));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black tracking-tight text-[#0F172A] sm:text-xl">
            {deck.lessonNumber}강 · {deck.shortTitle}
          </h1>
          <p className="mt-0.5 text-xs text-[#64748B]">{currentIndex + 1}/{deck.slides.length} · {deck.duration}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {EDUCATION_DECKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectDeck(item)}
              aria-current={item.id === deck.id ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                item.id === deck.id
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-[#475569] ring-1 ring-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {item.lessonNumber}강
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-[#334155] ring-1 ring-[#E2E8F0] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <List className="h-3.5 w-3.5" />
            목차
          </button>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
          <div
            ref={viewerRef}
            className={`relative overflow-hidden border border-slate-800 bg-[#03070E] shadow-xl ${
              isFullscreen ? 'flex h-screen w-screen flex-col rounded-none' : 'rounded-3xl'
            }`}
          >
        {sidebarOpen ? (
          <>
            <button
              type="button"
              className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-[1px]"
              onClick={() => setSidebarOpen(false)}
              aria-label="슬라이드 목록 닫기"
            />
            <aside className="absolute inset-y-0 left-0 z-40 w-[min(340px,90vw)] p-2 shadow-2xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-5 top-5 z-10 rounded-lg bg-white p-2 text-[#64748B] shadow-sm hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-label="슬라이드 목록 닫기"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
              <SlideLibrarySidebar
                currentDeckId={deck.id}
                currentIndex={currentIndex}
                onSelect={selectSlide}
              />
            </aside>
          </>
        ) : null}

        <div className="flex items-center justify-between border-b border-slate-800 bg-[#07111F] px-3 py-2.5 text-white sm:px-4">
          <p className="min-w-0 truncate text-xs font-bold text-white">{currentSlide.title}</p>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={isFullscreen ? '전체화면 종료' : '전체화면 보기'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        <div
          className={`min-h-0 bg-[#03070E] ${isFullscreen ? 'flex-1 p-2 sm:p-4' : 'p-2 sm:p-4 lg:p-5'}`}
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
        >
          <FixedSlideCanvas
            className={`mx-auto max-w-[1600px] rounded-xl border border-slate-800 ${
              isFullscreen ? 'h-full' : 'aspect-video'
            }`}
          >
            <CurrentSlide />
          </FixedSlideCanvas>
        </div>

        <div className="border-t border-slate-800 bg-[#07111F] px-3 py-3 text-white sm:px-4">
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasPrevious}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={previous}
              className="text-slate-200 hover:bg-white/10 hover:text-white"
            >
              이전
            </Button>
            <p className="font-mono text-sm font-black text-white">
              {currentIndex + 1}
              <span className="text-xs font-bold text-slate-500"> / {deck.slides.length}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={next}
              className="text-slate-200 hover:bg-white/10 hover:text-white"
            >
              {currentIndex === deck.slides.length - 1 && hasNext ? '다음 강의' : '다음'}
            </Button>
          </div>
        </div>
      </div>

      <SlideExplanationPanel
        content={currentSlide.learningContent}
        onRelated={
          currentSlide.learningContent.relatedLabel
            ? () => {
                const nextDeck = getNextDeck(deck);
                if (!currentSlide.learningContent.relatedTab && nextDeck) {
                  goTo(0, nextDeck);
                } else if (currentSlide.learningContent.relatedTab) {
                  onNavigate(
                    currentSlide.learningContent.relatedTab,
                    currentSlide.learningContent.relatedSubTab,
                  );
                }
              }
            : undefined
        }
      />
      </div>
    </div>
  );
}
