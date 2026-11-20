import React, { useEffect, useState } from 'react';
import { apiJson } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export type ClassStep = {
  key: string;
  title: string;
  toolUrl: string;
  toolLabel: string;
  capLabel: string;
  beforeNote: string;
  duringScreen: string;
  afterResult: string;
  status: 'open' | 'doing' | 'done';
};

export type ClassJourney = {
  projectId: number;
  prep: { business: boolean; domain: boolean; website: boolean; meet: boolean; complete: boolean };
  business: { name: string; businessType: string; summary: string; keywords: string[] };
  domain: { candidates: string[]; chosen: string };
  website: { ordered: boolean; status: string; statusLabel?: string; siteName: string; orderId: number };
  meet: { at: string; screen: string; nextAction: string };
  steps: ClassStep[];
  mission: { stepKey: string; title: string; prompt: string } | null;
  screens: { id: string; label: string }[];
  sessions: { id: number; heldAt: string; screen: string; stepKey: string; resultNote: string; nextAction: string }[];
  budget: {
    domain: { cap: number; chosen: boolean; label: string };
    website: { included: boolean; status: string; statusLabel: string };
    backlink: ServiceAmount;
    traffic: ServiceAmount;
  };
};

type ServiceAmount = {
  cap: number;
  connected: boolean;
  known: boolean;
  spent: number | null;
  remaining: number | null;
  nearCap: boolean;
};

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function classTodayScreen(data: {
  meet: { screen: string };
  mission: { stepKey: string } | null;
}) {
  if (data.meet.screen) return data.meet.screen;
  const key = data.mission?.stepKey || '';
  if (key === 'domain') return 'catchdomain';
  if (key === 'website' || key === 'content' || key === 'backlink' || key === 'traffic') return key;
  return '';
}

function serviceLine(label: string, item: ServiceAmount) {
  if (!item.known) return `${label} 한도 ${won(item.cap)} · 연결 전`;
  return `${label} 사용 ${won(item.spent || 0)} · 남음 ${won(item.remaining || 0)}${item.nearCap ? ' · 한도에 가까움' : ''}`;
}

async function saveClass(action: string, body: Record<string, unknown>) {
  return apiJson<ClassJourney>(`${API_ENDPOINTS.classJourney}?action=${action}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export const ClassHome: React.FC<{
  focus: 'home' | 'roadmap' | 'mission';
  projectId?: string;
  onPrepChange?: (complete: boolean) => void;
  onOpenWebsite?: () => void;
  onOpenScreen?: (screenId: string) => void;
  onTodayScreen?: (screenId: string) => void;
  onProjectSaved?: (projectId: number) => void;
}> = ({ focus, projectId, onPrepChange, onOpenWebsite, onOpenScreen, onTodayScreen, onProjectSaved }) => {
  const [data, setData] = useState<ClassJourney | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [candidates, setCandidates] = useState('');
  const [chosen, setChosen] = useState('');

  const load = async () => {
    const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const next = await apiJson<ClassJourney>(`${API_ENDPOINTS.classJourney}${query}`);
    setData(next);
    setName(next.business.name);
    setBusinessType(next.business.businessType);
    setSummary(next.business.summary);
    setKeywords(next.business.keywords.join('\n'));
    setCandidates(next.domain.candidates.join('\n'));
    setChosen(next.domain.chosen);
    onPrepChange?.(next.prep.complete);
    const screen = classTodayScreen(next);
    if (screen) onTodayScreen?.(screen);
    if (next.projectId) onProjectSaved?.(next.projectId);
  };

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || '수업 정보를 불러오지 못했습니다.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const run = async (work: () => Promise<ClassJourney>) => {
    setBusy(true);
    setError('');
    try {
      const next = await work();
      setData(next);
      onPrepChange?.(next.prep.complete);
      const screen = classTodayScreen(next);
      if (screen) onTodayScreen?.(screen);
      if (next.projectId) onProjectSaved?.(next.projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  if (!data && !error) {
    return <p className="text-sm text-slate-500">수업 정보를 불러오는 중입니다.</p>;
  }
  if (!data) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  const pid = data.projectId;
  const showPrep = focus === 'home' && !data.prep.complete;
  const showMission = data.prep.complete && focus === 'home';
  const currentStep = data.steps.find((step) => step.key === data.mission?.stepKey) || null;
  const todayScreen = classTodayScreen(data);
  const todayLabel = data.screens.find((screen) => screen.id === todayScreen)?.label || '오늘 화면';
  const showBudget = focus === 'home' && data.prep.complete;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-[11px] font-bold tracking-widest text-sky-600 uppercase">1:1 실전 수업</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          {data.prep.complete ? '다음 수업' : '첫 수업 전에 준비만 합니다'}
        </h1>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {focus === 'home' && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-bold text-slate-400">다음 Google Meet</p>
          <p className="mt-1 text-lg font-black text-slate-900">
            {data.meet.at ? data.meet.at.replace('T', ' ') : '일정은 강사가 정합니다'}
          </p>
          <p className="mt-1 text-sm text-slate-600">열 화면: {data.meet.screen ? todayLabel : '강사가 정합니다'}</p>
          {data.meet.nextAction && <p className="mt-2 text-sm text-slate-800">다음 행동: {data.meet.nextAction}</p>}
          <p className="mt-2 text-xs text-slate-500">
            {data.prep.complete
              ? '일정과 열 화면은 강사가 바꿉니다.'
              : '일정은 강사가 정합니다. 정해지면 오늘 열 화면이 열립니다.'}
          </p>
        </section>
      )}

      {showMission && data.mission && currentStep && (
        <section className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-[11px] font-bold text-sky-700">오늘의 할 일</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">{data.mission.title}</h2>
          <p className="mt-1 text-sm text-slate-600 [word-break:keep-all]">{data.mission.prompt}</p>
          <button
            type="button"
            onClick={() => {
              if (todayScreen === 'website') onOpenWebsite?.();
              else if (todayScreen) onOpenScreen?.(todayScreen);
            }}
            className="mt-4 min-h-[44px] rounded-full bg-slate-900 px-5 text-sm font-bold text-white"
          >
            {todayLabel} 열기
          </button>
        </section>
      )}
      {showMission && !data.mission && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">
          다섯 단계 수업 기록이 모두 끝났습니다.
        </section>
      )}

      {showPrep && (
        <form
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void run(() =>
              saveClass('prep', {
                projectId: pid,
                businessName: name,
                businessType,
                businessSummary: summary,
                keywords,
                domainCandidates: candidates,
                chosenDomain: chosen,
              })
            );
          }}
        >
          <h2 className="font-black text-slate-900">1–2. 사업, 키워드, 도메인 후보</h2>
          <label className="block text-xs font-bold text-slate-600">
            사업 이름
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            업종
            <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            한 줄 설명
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            목표 키워드 (줄마다 하나)
            <textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            도메인 후보
            <textarea value={candidates} onChange={(e) => setCandidates(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            고른 도메인
            <input value={chosen} onChange={(e) => setChosen(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <button disabled={busy} className="min-h-[44px] rounded-full bg-slate-900 px-5 text-sm font-bold text-white disabled:opacity-60">
            저장
          </button>
        </form>
      )}

      {showPrep && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="font-black text-slate-900">3. 홈페이지 주문</h2>
          <p className="mt-1 text-sm text-slate-500 [word-break:keep-all]">
            {data.website.ordered
              ? `${data.website.siteName || '주문'} · ${data.website.status || '작성중'}`
              : '사이트 이름까지 저장해야 이 단계가 끝납니다.'}
          </p>
          <button type="button" onClick={onOpenWebsite} className="mt-3 min-h-[44px] rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-800">
            홈페이지 주문으로 이동
          </button>
        </section>
      )}

      {focus === 'home' && data.sessions.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="font-black text-slate-900">지난 수업</h2>
          <ul className="mt-3 space-y-3">
            {data.sessions.map((session) => {
              const screen = data.screens.find((item) => item.id === session.screen);
              return (
                <li key={session.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">{session.heldAt} · {screen?.label || session.screen || '화면 미정'}</p>
                  <p className="mt-1 [word-break:keep-all]">{session.resultNote || '결과 한 줄이 아직 없습니다.'}</p>
                  {session.nextAction && <p className="mt-1 text-slate-500">다음 행동 · {session.nextAction}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {showMission && currentStep && (
          <form
            key={`${currentStep.key}:${currentStep.beforeNote}:${currentStep.afterResult}`}
            className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              void run(() =>
                saveClass('step', {
                  projectId: pid,
                  stepKey: currentStep.key,
                  beforeNote: String(form.get('beforeNote') || ''),
                  duringScreen: todayScreen,
                  afterResult: String(form.get('afterResult') || ''),
                  status: currentStep.status === 'done' ? 'done' : 'doing',
                })
              );
            }}
          >
            <h2 className="font-black text-slate-900">{currentStep.title}</h2>
            <p className="text-xs text-slate-500">{currentStep.capLabel}</p>
            <label className="block text-xs font-bold text-slate-600">
              수업 전 메모
              <textarea name="beforeNote" defaultValue={currentStep.beforeNote} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              수업 후 결과 한 줄
              <textarea name="afterResult" defaultValue={currentStep.afterResult} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <button disabled={busy || pid < 1} className="min-h-[44px] rounded-full bg-slate-900 px-5 text-sm font-bold text-white disabled:opacity-60">
              이 단계만 저장
            </button>
          </form>
      )}

      {showBudget && (
        <section className="space-y-2 rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="font-black text-slate-900">실행 금액</h2>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>도메인 {data.budget.domain.chosen ? `선택됨 · ${data.budget.domain.label}` : '아직 없음'} · 지원 {won(data.budget.domain.cap)}</li>
            <li>홈페이지 제작 포함 · {data.budget.website.statusLabel}</li>
            <li className={data.budget.backlink.nearCap ? 'font-bold text-amber-700' : ''}>{serviceLine('백링크', data.budget.backlink)}</li>
            <li className={data.budget.traffic.nearCap ? 'font-bold text-amber-700' : ''}>{serviceLine('트래픽', data.budget.traffic)}</li>
          </ul>
          <p className="text-xs text-slate-500 [word-break:keep-all]">사용액은 연결된 백링크·트래픽 서비스에서만 가져옵니다. 직접 입력하지 않습니다.</p>
        </section>
      )}
    </div>
  );
};
