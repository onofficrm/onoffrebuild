import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { INFO_REQUEST_PRESETS } from '../../types/revisionWork';

export type InfoRequestDraft = { label: string; hint: string; required: boolean };

type Props = {
  items: InfoRequestDraft[];
  onChange: (items: InfoRequestDraft[]) => void;
};

export const RevisionInfoRequestEditor: React.FC<Props> = ({ items, onChange }) => {
  const [custom, setCustom] = useState('');

  const add = (item: InfoRequestDraft) => {
    if (items.some((row) => row.label === item.label)) return;
    onChange([...items, item]);
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
      <p className="text-xs font-bold text-amber-900">고객에게 받을 자료 칸</p>
      <div className="flex flex-wrap gap-1.5">
        {INFO_REQUEST_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="px-2 py-1 text-[11px] font-bold rounded-lg border border-amber-300 bg-white text-amber-900"
            onClick={() => add({ ...preset, required: true })}
          >
            <Plus className="inline w-3 h-3 mr-0.5" />
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="flex-1 text-xs border border-amber-300 rounded-lg px-2 py-1.5 bg-white"
          placeholder="직접 칸 이름"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!custom.trim()}
          onClick={() => {
            add({ label: custom.trim(), hint: '', required: true });
            setCustom('');
          }}
        >
          추가
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-start gap-2 rounded-lg bg-white border border-amber-200 px-2 py-1.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800">{item.label}</p>
            <input
              value={item.hint}
              onChange={(e) => {
                const next = items.slice();
                next[index] = { ...item, hint: e.target.value };
                onChange(next);
              }}
              className="w-full text-[11px] border-0 px-0 py-0.5 text-slate-500"
              placeholder="고객에게 보일 안내 (선택)"
            />
          </div>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-rose-600"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="칸 삭제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
