import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
} from 'lucide-react';
import type { NavigationTab } from '../../types';
import { Button } from '../common/Button';
import { FixedSlideCanvas } from './FixedSlideCanvas';
import { SlideExplanationPanel } from './SlideExplanationPanel';
import { SlideLibrarySidebar } from './SlideLibrarySidebar';
import {
  DEFAULT_DECK,
  EDUCATION_DECKS,
  TOTAL_EDUCATION_SLIDES,
  getEducationDeck,
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
  const overallProgress = Math.round(
    (currentSlide.globalId / TOTAL_EDUCATION_SLIDES) * 100,
  );

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
    const previousDeck = EDUCATION_DECKS[deck.lessonNumber - 2];
    if (previousDeck) goTo(previousDeck.slides.length - 1, previousDeck);
  }, [currentIndex, deck.lessonNumber, goTo]);

  const next = useCallback(() => {
    if (currentIndex < deck.slides.length - 1) {
      goTo(currentIndex + 1);
      return;
    }
    const nextDeck = EDUCATION_DECKS[deck.lessonNumber];
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

  const getDeckIndex = useCallback(
    (targetDeck: EducationDeck) =>
      targetDeck.id === deck.id ? currentIndex : storedSlideIndex(targetDeck),
    [currentIndex, deck.id],
  );

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

  const hasPrevious = currentIndex > 0 || deck !== DEFAULT_DECK;
  const hasNext =
    currentIndex < deck.slides.length - 1 || deck.lessonNumber < EDUCATION_DECKS.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <section className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
              <Presentation className="h-3.5 w-3.5" />
              교육 슬라이드
            </div>
            <h1 className="mt-3 text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">
              {deck.lessonNumber}강 · {deck.title}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">{deck.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-[#64748B]">
              <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1">{deck.slides.length}장</span>
              <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1">{deck.duration}</span>
              <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1">진행률 {progress}%</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" leftIcon={<BookOpen className="h-4 w-4" />} onClick={() => onNavigate('curriculum')}>
              강의실
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Compass className="h-4 w-4" />} onClick={() => onNavigate('roadmap')}>
              로드맵
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {EDUCATION_DECKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectDeck(item)}
              aria-current={item.id === deck.id ? 'page' : undefined}
              className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                item.id === deck.id
                  ? 'border-[#93C5FD] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#BFDBFE] hover:bg-white'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB]">
                Lesson {String(item.lessonNumber).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-sm font-black text-[#0F172A]">{item.shortTitle}</span>
              <span className="mt-1 block text-[11px] text-[#64748B]">{item.slides.length}장 · {item.duration}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
        <aside className="hidden xl:sticky xl:top-5 xl:block xl:h-[calc(100vh-2.5rem)] xl:min-h-[640px] xl:max-h-[900px]">
          <SlideLibrarySidebar
            currentDeckId={deck.id}
            currentIndex={currentIndex}
            getDeckIndex={getDeckIndex}
            onSelect={selectSlide}
          />
        </aside>

        <div className="min-w-0 space-y-5">
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
                getDeckIndex={getDeckIndex}
                onSelect={selectSlide}
              />
            </aside>
          </>
        ) : null}

        <div className="flex items-center justify-between border-b border-slate-800 bg-[#07111F] px-3 py-2.5 text-white sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={sidebarOpen ? '슬라이드 목록 닫기' : '슬라이드 목록 열기'}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {deck.lessonNumber}강 · {currentSlide.category}
              </p>
              <p className="truncate text-xs font-bold text-white">{currentSlide.title}</p>
            </div>
          </div>
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
            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${overallProgress}%` }} />
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
            <div className="text-center">
              <span className="font-mono text-sm font-black text-white">{currentSlide.globalId}</span>
              <span className="font-mono text-xs text-slate-500"> / {TOTAL_EDUCATION_SLIDES}</span>
              <p className="text-[10px] font-bold text-cyan-400">{deck.lessonNumber}강 {currentIndex + 1}/{deck.slides.length}</p>
              <p className="hidden text-[10px] text-slate-500 sm:block">← → 이동 · F 전체화면 · 모바일 스와이프</p>
            </div>
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
                if (currentSlide.slug === 'next-preview') {
                  goTo(0, EDUCATION_DECKS[1]);
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
    </div>
  );
}
