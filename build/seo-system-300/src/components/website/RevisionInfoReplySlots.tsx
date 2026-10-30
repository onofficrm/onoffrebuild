import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '../common/Button';
import type { RevisionInfoRequest } from '../../types/revisionWork';
import type { ApiRevisionFile } from '../../services/revisionService';

type Draft = { text: string; files: File[] };

type Props = {
  items: RevisionInfoRequest[];
  files?: ApiRevisionFile[];
  busy?: boolean;
  onReply: (items: { id: string; answerText: string }[], uploads: { id: string; files: File[] }[]) => Promise<void> | void;
};

export const RevisionInfoReplySlots: React.FC<Props> = ({ items, files = [], busy = false, onReply }) => {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  if (!items.length) return null;

  const requested = items.filter((item) => item.status !== 'answered');
  const answered = items.filter((item) => item.status === 'answered');

  const draftOf = (id: string): Draft => drafts[id] || { text: '', files: [] };

  const submitOne = async (item: RevisionInfoRequest) => {
    const draft = draftOf(item.id);
    if (!draft.text.trim() && draft.files.length === 0) return;
    await onReply([{ id: item.id, answerText: draft.text.trim() }], [{ id: item.id, files: draft.files }]);
    setDrafts((prev) => ({ ...prev, [item.id]: { text: '', files: [] } }));
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <div>
        <p className="text-sm font-bold text-amber-900">요청한 자료</p>
        <p className="text-[11px] text-amber-800">새 요청을 만들지 말고, 아래 칸에만 답하거나 파일을 올려 주세요.</p>
      </div>
      {requested.map((item) => {
        const draft = draftOf(item.id);
        return (
          <div key={item.id} className="rounded-lg border border-amber-200 bg-white p-3 space-y-2">
            <p className="text-xs font-bold text-slate-800">
              {item.label}
              {item.required ? <span className="ml-1 text-rose-500">필수</span> : null}
            </p>
            {item.hint ? <p className="text-[11px] text-slate-500">{item.hint}</p> : null}
            <textarea
              value={draft.text}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [item.id]: { ...draftOf(item.id), text: e.target.value } }))
              }
              rows={2}
              placeholder="이 칸에 답변"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
            />
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center justify-center px-3 py-1.5 text-[11px] border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                <Paperclip className="w-3.5 h-3.5 mr-1" />
                파일
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.svg,.pdf,.zip,.doc,.docx,.txt"
                  multiple
                  onChange={(e) => {
                    const next = Array.from(e.target.files || []);
                    setDrafts((prev) => ({
                      ...prev,
                      [item.id]: { ...draftOf(item.id), files: [...draftOf(item.id).files, ...next] },
                    }));
                    e.target.value = '';
                  }}
                />
              </label>
              {draft.files.length ? (
                <span className="text-[11px] text-slate-500">{draft.files.map((f) => f.name).join(', ')}</span>
              ) : null}
              <Button
                size="sm"
                variant="primary"
                disabled={busy || (!draft.text.trim() && draft.files.length === 0)}
                onClick={() => void submitOne(item)}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                이 칸 보내기
              </Button>
            </div>
          </div>
        );
      })}
      {answered.map((item) => (
        <div key={item.id} className="rounded-lg border border-emerald-200 bg-white p-3 space-y-1">
          <p className="text-xs font-bold text-emerald-800">{item.label} · 보냄</p>
          {item.answerText ? <p className="text-xs text-slate-700 whitespace-pre-wrap">{item.answerText}</p> : null}
          {item.fileIds.length ? (
            <ul className="text-[11px] text-slate-500">
              {item.fileIds.map((id) => {
                const file = files.find((f) => f.id === id);
                return <li key={id}>{file ? file.originalName : `파일 #${id}`}</li>;
              })}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
};
