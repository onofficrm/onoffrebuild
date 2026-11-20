import { useState } from 'react';
import {
  Bot,
  Check,
  EyeOff,
  Link2,
  MessageCircle,
  PenLine,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

type CommentKind = 'inquiry' | 'question' | 'thanks' | 'spam';

interface DemoComment {
  id: string;
  author: string;
  time: string;
  body: string;
  kind: CommentKind;
  draft: string | null;
  followUp: string;
}

const KIND_META: Record<CommentKind, { label: string; className: string }> = {
  inquiry: { label: '상담 문의', className: 'border-[#2563EB]/30 bg-blue-50 text-blue-700' },
  question: { label: '기능 질문', className: 'border-slate-200 bg-slate-50 text-slate-700' },
  thanks: { label: '감사·후기', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  spam: { label: '스팸·광고', className: 'border-rose-200 bg-rose-50 text-rose-700' },
};

const DEMO_POST_TITLE = '홈페이지 리뉴얼 전 꼭 확인할 체크리스트 7가지';

const DEMO_COMMENTS: DemoComment[] = [
  {
    id: 'c1',
    author: '김*진',
    time: '3분 전',
    body: '저희는 병원인데요, 예약 기능까지 포함하면 견적이 어떻게 되나요?',
    kind: 'inquiry',
    draft:
      '김*진님, 관심 가져주셔서 감사합니다. 예약 기능은 진료 과목과 운영 방식에 따라 범위가 달라 1:1 상담으로 정확한 견적을 안내해 드리고 있어요. 아래 상담하기에서 편하게 남겨 주시면 담당자가 연락드리겠습니다.',
    followUp: '상담하기 링크 첨부 · 스텝메일 후속 안내 대기',
  },
  {
    id: 'c2',
    author: '박*호',
    time: '18분 전',
    body: '체크리스트 3번에서 말한 모바일 게시판 관리, 휴대폰으로도 글 수정이 되나요?',
    kind: 'question',
    draft:
      '박*호님, 좋은 질문 감사합니다. 네, ONOFF Builder 게시판은 모바일 관리자 화면에서 글 작성·수정이 가능합니다. 자세한 사용 방법은 자주 묻는 질문 글에 정리해 두었어요.',
    followUp: 'FAQ 게시글 링크 첨부',
  },
  {
    id: 'c3',
    author: '이*아',
    time: '1시간 전',
    body: '정리 너무 잘 돼 있어서 팀원들이랑 같이 봤어요. 감사합니다!',
    kind: 'thanks',
    draft:
      '이*아님, 팀원분들과 함께 봐 주셨다니 정말 기쁩니다. 다음 글에서는 리뉴얼 일정 짜는 법을 다룰 예정이니 기대해 주세요!',
    followUp: '다음 콘텐츠 예고 · 루틴 발행 일정 연계',
  },
  {
    id: 'c4',
    author: 'promo***',
    time: '2시간 전',
    body: '단기 고수익 보장!! 지금 바로 링크 클릭 ▶▶ bit.ly/xxxx',
    kind: 'spam',
    draft: null,
    followUp: '금칙어·외부 링크 감지 → 자동 숨김 · 관리자 확인 대기',
  },
];

interface AutoCommentDemoProps {
  compact?: boolean;
}

export function AutoCommentDemo({ compact = false }: AutoCommentDemoProps) {
  const comments = compact ? DEMO_COMMENTS.filter((c) => c.id !== 'c3') : DEMO_COMMENTS;
  const [selectedId, setSelectedId] = useState(comments[0].id);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const selected = comments.find((c) => c.id === selectedId) ?? comments[0];
  const selectedKind = KIND_META[selected.kind];
  const isApproved = approvedIds.includes(selected.id);

  return (
    <div
      role="region"
      aria-label="자동 댓글 응대 시연 화면"
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <MessageCircle className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          <p className="truncate text-[12.5px] font-semibold text-slate-950">
            댓글 응대함 · <span className="font-medium text-slate-500">{DEMO_POST_TITLE}</span>
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-slate-400">시연 화면 · 실제 게시 없음</span>
      </div>

      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'lg:grid-cols-12'}`}>
        {/* 새 댓글 목록 */}
        <div
          className={`border-b border-slate-200 p-3 sm:p-4 ${
            compact ? 'md:border-b-0 md:border-r' : 'lg:col-span-5 lg:border-b-0 lg:border-r'
          }`}
        >
          <p className="px-1 text-[11.5px] font-semibold text-slate-500">
            새 댓글 {comments.length}건 · 자동 분류 완료
          </p>
          <ul className="mt-2 space-y-1.5">
            {comments.map((comment) => {
              const active = comment.id === selected.id;
              const kind = KIND_META[comment.kind];
              const approved = approvedIds.includes(comment.id);
              return (
                <li key={comment.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedId(comment.id)}
                    className={`w-full cursor-pointer rounded-[12px] border px-3 py-2.5 text-left transition-colors duration-150 ${
                      active
                        ? 'border-[#2563EB]/40 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-slate-950">
                        {comment.author}
                        <span className="ml-1.5 font-normal text-slate-400">{comment.time}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${kind.className}`}
                      >
                        {approved ? '답변 게시됨' : kind.label}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-[12.5px] leading-[1.5] ${
                        comment.kind === 'spam' ? 'text-slate-400 line-through' : 'text-slate-600'
                      } ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}
                    >
                      {comment.body}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* AI 답변 초안 · 승인 */}
        <div className={`flex flex-col justify-between p-4 sm:p-5 ${compact ? '' : 'lg:col-span-7'}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${selectedKind.className}`}
              >
                {selectedKind.label}
              </span>
              <span className="text-[11.5px] text-slate-500">{selected.author}님의 댓글</span>
            </div>
            <p className="mt-2 rounded-[12px] bg-slate-50 px-3.5 py-3 text-[13px] leading-[1.6] text-slate-700">
              {selected.body}
            </p>

            {selected.draft ? (
              <div className="mt-3 rounded-[12px] border border-[#2563EB]/25 bg-white px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-600">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI 답변 초안 · 브랜드 응대 규칙 적용
                </p>
                <p
                  className={`mt-1.5 text-[13px] leading-[1.65] text-slate-950 ${
                    compact ? 'line-clamp-3' : ''
                  }`}
                >
                  {selected.draft}
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2.5 rounded-[12px] border border-rose-200 bg-rose-50/60 px-3.5 py-3">
                <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                <div>
                  <p className="text-[12.5px] font-semibold text-rose-700">답변 없이 자동 숨김</p>
                  <p className="mt-0.5 text-[12px] leading-[1.55] text-rose-700/80">
                    홍보·외부 링크 댓글은 방문자에게 노출하지 않고 관리자 확인 목록으로 보냅니다.
                  </p>
                </div>
              </div>
            )}

            <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
              {selected.kind === 'spam' ? (
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              {selected.followUp}
            </p>
          </div>

          {selected.draft && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3.5">
              <button
                type="button"
                disabled={isApproved}
                onClick={() => setApprovedIds((prev) => [...prev, selected.id])}
                className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-[9px] px-3.5 text-[12.5px] font-semibold transition-colors ${
                  isApproved
                    ? 'cursor-default bg-emerald-50 text-emerald-700'
                    : 'bg-[#2563EB] text-white hover:bg-blue-700'
                }`}
              >
                {isApproved ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    승인 완료 · 답변 게시 (시연)
                  </>
                ) : (
                  <>
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                    승인 후 게시
                  </>
                )}
              </button>
              {!isApproved && (
                <span className="inline-flex items-center gap-1.5 px-1 text-[12px] text-slate-500">
                  <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                  담당자 수정 가능
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
