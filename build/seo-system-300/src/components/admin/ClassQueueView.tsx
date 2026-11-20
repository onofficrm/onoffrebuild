import React, { useEffect, useState } from 'react';
import { apiJson } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';

type ClassQueueItem = {
  projectId: number;
  studentName: string;
  businessName: string;
  meet: { at: string; screen: string; nextAction: string };
  mission: { stepKey: string; title: string; prompt: string } | null;
  domain: { candidates: string[]; chosen: string };
  website: { ordered: boolean; status: string; statusLabel?: string; siteName: string };
  step: {
    key: string;
    title: string;
    beforeNote: string;
    afterResult: string;
    status: 'open' | 'doing' | 'done';
    duringScreen: string;
  } | null;
  sessions: { id: number; heldAt: string; resultNote: string; nextAction: string }[];
  screens: { id: string; label: string }[];
};

function screenLabel(screens: { id: string; label: string }[], id: string) {
  return screens.find((item) => item.id === id)?.label || '화면 미정';
}

const ClassQueueCard: React.FC<{ item: ClassQueueItem; onSaved: (next: ClassQueueItem) => void }> = ({ item, onSaved }) => {
  const [beforeNote, setBeforeNote] = useState(item.step?.beforeNote || '');
  const [afterResult, setAfterResult] = useState(item.step?.afterResult || '');
  const [nextAction, setNextAction] = useState(item.meet.nextAction || '');
  const [meetAt, setMeetAt] = useState('');
  const [meetScreen, setMeetScreen] = useState(item.meet.screen || item.screens[0]?.id || 'catchdomain');
  const [recordHeld, setRecordHeld] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setBeforeNote(item.step?.beforeNote || '');
    setAfterResult(item.step?.afterResult || '');
    setNextAction(item.meet.nextAction || '');
    setMeetScreen(item.meet.screen || item.screens[0]?.id || 'catchdomain');
  }, [item]);

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const next = await apiJson<ClassQueueItem>(`${API_ENDPOINTS.admin}?action=class-save`, {
        method: 'POST',
        body: JSON.stringify({
          projectId: item.projectId,
          stepKey: item.step?.key || item.mission?.stepKey || '',
          beforeNote,
          afterResult,
          duringScreen: item.step?.duringScreen || item.meet.screen,
          status: item.step?.status === 'done' ? 'done' : afterResult.trim() ? 'doing' : item.step?.status || 'open',
          nextAction,
          meetAt: recordHeld ? meetAt : '',
          meetScreen,
          recordHeld,
        }),
      });
      setMeetAt('');
      setRecordHeld(false);
      onSaved(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
      <div>
        <p className="text-[11px] font-bold tracking-widest text-sky-600 uppercase">{item.studentName}</p>
        <h2 className="mt-1 text-lg font-black text-slate-900">{item.businessName || '사업 이름 없음'}</h2>
      </div>
      <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <p>다음 Meet · {item.meet.at ? item.meet.at.replace('T', ' ') : '아직 없음'}</p>
        <p>열 화면 · {screenLabel(item.screens, item.meet.screen)}</p>
        <p>남은 단계 · {item.mission?.title || '다섯 단계 완료'}</p>
        <p>홈페이지 · {item.website.ordered ? (item.website.siteName || '주문') : '주문 전'} · {item.website.statusLabel || '주문 전'}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">도메인 후보</p>
        <p className="mt-1 text-sm text-slate-800 [word-break:keep-all]">
          {item.domain.candidates.length ? item.domain.candidates.join(', ') : '후보 없음'}
          {item.domain.chosen ? ` · 선택 ${item.domain.chosen}` : ''}
        </p>
      </div>
      <label className="block text-xs font-bold text-slate-600">
        수업 전 메모
        <textarea value={beforeNote} onChange={(e) => setBeforeNote(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-600">
        수업 후 결과
        <textarea value={afterResult} onChange={(e) => setAfterResult(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-600">
        다음 행동
        <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </label>
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input type="checkbox" checked={recordHeld} onChange={(e) => setRecordHeld(e.target.checked)} />
        이 수업을 일지에 남기고 다음 일정으로 넘기기
      </label>
      {recordHeld && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold text-slate-600">
            다음 수업 일시
            <input type="datetime-local" value={meetAt} onChange={(e) => setMeetAt(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            다음에 열 화면
            <select value={meetScreen} onChange={(e) => setMeetScreen(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {item.screens.map((screen) => (
                <option key={screen.id} value={screen.id}>{screen.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {item.sessions.length > 0 && (
        <ul className="space-y-1 text-xs text-slate-500">
          {item.sessions.map((session) => (
            <li key={session.id}>{session.heldAt} · {session.resultNote || '결과 없음'}</li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="button" disabled={busy} onClick={() => void save()} className="min-h-[44px] rounded-full bg-slate-900 px-5 text-sm font-bold text-white disabled:opacity-60">
        저장
      </button>
    </article>
  );
};

export const ClassQueueView: React.FC = () => {
  const [items, setItems] = useState<ClassQueueItem[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiJson<{ items: ClassQueueItem[] }>(`${API_ENDPOINTS.admin}?action=classes`)
      .then((data) => {
        if (!cancelled) setItems(data.items || []);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '수업 목록을 불러오지 못했습니다.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!items) return <p className="text-sm text-slate-500">다음 수업을 불러오는 중입니다.</p>;
  if (!items.length) return <p className="text-sm text-slate-500">진행 중인 수강생 프로젝트가 없습니다.</p>;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold tracking-widest text-sky-600 uppercase">Instructor</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">다음 수업</h1>
        <p className="mt-1 text-sm text-slate-500 [word-break:keep-all]">수강생마다 다음 Meet, 열 화면, 끝나지 않은 단계 하나만 봅니다.</p>
      </div>
      {items.map((item) => (
        <ClassQueueCard
          key={item.projectId}
          item={item}
          onSaved={(next) => setItems((current) => (current || []).map((row) => (row.projectId === next.projectId ? next : row)))}
        />
      ))}
    </div>
  );
};
