import React, { useEffect, useState } from 'react';
import { Sparkles, Send, ShieldCheck } from 'lucide-react';
import { Project, NavigationTab } from '../../types';
import { Button } from '../common/Button';
import { ApiRequestError } from '../../services/apiClient';
import { addAiMission, getAiAnalysis, runAiAnalyze, runAiChat, toolCtaTab } from '../../services/toolsService';

export interface AiCoachViewProps {
  project: Project;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

type Action = { title: string; reason: string; priority: string; tool: string; roadmapTaskKey?: string | null };

export const AiCoachView: React.FC<AiCoachViewProps> = ({ project, onNavigate }) => {
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [health, setHealth] = useState<Record<string, number | null>>({});
  const [reasons, setReasons] = useState<Record<string, string[]>>({});
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [dataAsOf, setDataAsOf] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<{ role: string; text: string }>>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError('');
    try {
      const a = await getAiAnalysis(project.id);
      setConfigured(a.configured);
      setSummary(a.data?.summary || '');
      setActions(a.data?.actions || []);
      setInsights(a.data?.insights || []);
      const rb = (a.healthRuleBased || {}) as Record<string, unknown>;
      setHealth((a.data?.health || (rb as Record<string, number | null>)) as Record<string, number | null>);
      setReasons((rb.reasons || {}) as Record<string, string[]>);
      setCreatedAt(a.createdAt);
      setDataAsOf(a.dataAsOf);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    void load();
  }, [project.id]);

  const analyze = async () => {
    setBusy(true);
    setError('');
    try {
      await runAiAnalyze(Number(project.id), true);
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'AI 분석을 불러오지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setChat((c) => [...c, { role: 'user', text: msg }]);
    setBusy(true);
    try {
      const res = await runAiChat(Number(project.id), msg);
      setChat((c) => [...c, { role: 'ai', text: res.data?.summary || '응답이 비어 있습니다.' }]);
      if (res.data?.actions?.length) setActions(res.data.actions);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'AI 응답을 불러오지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const scoreLabel = (v: number | null | undefined) => (v == null ? '데이터 부족' : `${v}`);

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-3xl p-6">
        <h1 className="text-xl font-black flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2563EB]" /> AI SEO Coach
        </h1>
        <p className="text-sm text-slate-500 mt-1">제공된 실제 데이터만 사용합니다. 숫자는 만들지 않습니다.</p>
        <p className="text-xs text-slate-400 mt-2">
          {project.name} · {project.domain}
          {dataAsOf ? ` · 데이터 기준 ${dataAsOf}` : ''}
          {createdAt ? ` · 분석 ${createdAt}` : ''}
        </p>
      </div>
      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-sm flex justify-between gap-2">
          <span>{error}</span>
          <button type="button" className="font-bold underline" onClick={() => void analyze()}>
            다시 시도
          </button>
        </div>
      ) : null}
      {!configured ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 font-bold text-amber-900">AI Coach 준비중 — Provider 설정이 필요합니다.</div>
      ) : (
        <Button onClick={() => void analyze()} disabled={busy}>
          {busy ? '분석 중…' : '다시 분석'}
        </Button>
      )}

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Rule-based Health Score
        </h2>
        <p className="text-sm">종합: {scoreLabel(health.overall as number | null)}</p>
        {(['technical', 'content', 'backlink', 'traffic'] as const).map((k) => (
          <div key={k} className="text-xs">
            <span className="font-bold uppercase">{k}</span>: {scoreLabel(health[k] as number | null)}
            {reasons[k]?.length ? <span className="text-slate-500"> — {reasons[k].join(', ')}</span> : null}
          </div>
        ))}
      </div>

      {summary ? <div className="bg-white border rounded-3xl p-6 text-sm whitespace-pre-wrap">{summary}</div> : null}
      {insights.map((i) => (
        <p key={i} className="text-sm text-slate-600">
          {i}
        </p>
      ))}

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black">이번 주 우선 작업</h2>
        {actions.length === 0 ? <p className="text-sm text-slate-400">추천이 없습니다. Provider 연결 후 분석을 실행하세요.</p> : null}
        {actions.map((a, idx) => {
          const cta = toolCtaTab(a.tool);
          return (
            <div key={`${a.title}-${idx}`} className="border rounded-2xl p-3 space-y-2">
              <div className="text-xs font-black text-blue-700">{a.priority}</div>
              <div className="font-bold text-sm">{a.title}</div>
              <p className="text-xs text-slate-500">{a.reason}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => onNavigate(cta.tab, cta.sub)}>
                  도구 열기
                </Button>
                {a.roadmapTaskKey ? (
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await addAiMission(Number(project.id), a.roadmapTaskKey as string);
                        onNavigate('missions');
                      } catch (err) {
                        setError(err instanceof ApiRequestError ? err.message : '미션 추가 실패');
                      }
                    }}
                  >
                    오늘의 미션에 추가
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black">질문</h2>
        {chat.map((m, i) => (
          <p key={i} className={`text-sm ${m.role === 'user' ? 'font-bold' : ''}`}>
            {m.role === 'user' ? '나: ' : '코치: '}
            {m.text}
          </p>
        ))}
        <div className="flex gap-2">
          <input className="flex-1 border rounded-xl px-3 py-2 text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="지금 가장 먼저 해야 할 일은?" />
          <Button size="sm" disabled={!configured || busy} onClick={() => void send()} leftIcon={<Send className="w-3.5 h-3.5" />}>
            보내기
          </Button>
        </div>
      </div>
    </div>
  );
};
