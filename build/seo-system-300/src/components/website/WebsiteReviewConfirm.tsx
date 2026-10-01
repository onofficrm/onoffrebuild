import React, { useState } from 'react';
import { CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { Button } from '../common/Button';
import { answerWebsiteReview } from '../../services/websiteReviewService';

interface WebsiteReviewConfirmProps {
  orderId: number;
  onAnswered?: () => void;
}

/** Shown while the team waits for the customer to check the finished homepage. */
export const WebsiteReviewConfirm: React.FC<WebsiteReviewConfirmProps> = ({ orderId, onAnswered }) => {
  const [mode, setMode] = useState<'idle' | 'changes'>('idle');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (approve: boolean) => {
    if (!approve && message.trim() === '') {
      setError('수정이 필요한 내용을 적어주세요.');
      return;
    }
    if (approve && !window.confirm('제작 결과를 확인하고 제작 완료로 처리할까요?')) return;
    setBusy(true);
    setError('');
    try {
      await answerWebsiteReview(orderId, approve, message.trim());
      setMessage('');
      setMode('idle');
      onAnswered?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '전송하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 space-y-3">
      <div>
        <h3 className="text-sm font-bold text-purple-950">제작 결과를 확인해주세요</h3>
        <p className="mt-1 text-xs text-purple-900">
          담당자가 확인을 요청했습니다. 문제가 없으면 「확인 완료」를, 고칠 부분이 있으면 「수정 요청」을 눌러주세요.
        </p>
      </div>
      {mode === 'changes' ? (
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="예: 메인 배너 문구를 '상담 예약'으로 바꿔주세요."
          className="w-full rounded-2xl border border-purple-200 bg-white px-3 py-2 text-sm text-[#0F172A]"
        />
      ) : null}
      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        {mode === 'changes' ? (
          <>
            <Button size="sm" variant="primary" isLoading={busy} onClick={() => void send(false)}>
              수정 요청 보내기
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setMode('idle')}>
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="success"
              isLoading={busy}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => void send(true)}
            >
              확인 완료
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              leftIcon={<MessageSquareWarning className="w-4 h-4" />}
              onClick={() => setMode('changes')}
            >
              수정 요청
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
