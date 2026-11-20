import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  LayoutTemplate,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  FileText,
  Palette,
  Sparkles,
  ShieldAlert,
  Save,
  Check
} from 'lucide-react';
import { WebsiteKanbanCard, WebsiteKanbanStage, RequestChecklistStatus } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BOARD_REQUEST_OPTIONS, PROGRAM_REQUEST_OPTIONS } from '../website/wizard/WizardStep9Review';

export interface WebsiteOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: WebsiteKanbanCard | null;
  onUpdateCard: (updated: WebsiteKanbanCard) => void;
  onRequestMoreInfo?: (payload: { title: string; body: string; adminMemo?: string }) => void;
  onSaveChecklist?: (checklist: {
    board: Record<string, string>;
    program: Record<string, string>;
  }) => Promise<void> | void;
  onSavePreviewUrl?: (previewUrl: string) => Promise<void> | void;
}

const STAGE_OPTIONS: { id: WebsiteKanbanStage; label: string }[] = [
  { id: 'new_order', label: '접수 (신규 주문)' },
  { id: 'awaiting_materials', label: '자료 대기' },
  { id: 'planning', label: '기획' },
  { id: 'design', label: '디자인' },
  { id: 'development', label: '개발' },
  { id: 'qa', label: '1차 검수' },
  { id: 'revision', label: '고객 검수 & 수정' },
  { id: 'completed', label: '완료 (납품)' }
];

const CHECKLIST_STATUSES: { id: RequestChecklistStatus; label: string }[] = [
  { id: 'pending', label: '대기' },
  { id: 'included', label: '포함' },
  { id: 'quote', label: '견적' },
  { id: 'done', label: '완료' },
  { id: 'skip', label: '제외' },
];

function labelForKey(group: 'board' | 'program', key: string): string {
  const list = group === 'board' ? BOARD_REQUEST_OPTIONS : PROGRAM_REQUEST_OPTIONS;
  return list.find((o) => o.key === key)?.label || key;
}

export const WebsiteOrderDetailModal: React.FC<WebsiteOrderDetailModalProps> = ({
  isOpen,
  onClose,
  card,
  onUpdateCard,
  onRequestMoreInfo,
  onSaveChecklist,
  onSavePreviewUrl,
}) => {
  const [currentStage, setCurrentStage] = useState<WebsiteKanbanStage>('new_order');
  const [assignee, setAssignee] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqBody, setReqBody] = useState('');
  const [checklist, setChecklist] = useState({
    board: {} as Record<string, string>,
    program: {} as Record<string, string>,
  });
  const [checklistBusy, setChecklistBusy] = useState(false);
  const [checklistMsg, setChecklistMsg] = useState('');
  const [previewUrlDraft, setPreviewUrlDraft] = useState('');
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewMsg, setPreviewMsg] = useState('');

  useEffect(() => {
    if (!card) return;
    setCurrentStage(card.stage);
    setAssignee(card.assignee);
    setNewNoteText('');
    setIsSaved(false);
    setReqTitle('');
    setReqBody('');
    setPreviewUrlDraft(card.previewUrl || '');
    setPreviewMsg('');
    const board: Record<string, string> = { ...(card.brief.requestChecklist?.board || {}) };
    const program: Record<string, string> = { ...(card.brief.requestChecklist?.program || {}) };
    (card.brief.boardRequests || []).forEach((k) => {
      if (!board[k]) board[k] = 'pending';
    });
    (card.brief.programRequests || []).forEach((k) => {
      if (!program[k]) program[k] = 'pending';
    });
    setChecklist({ board, program });
  }, [card?.id]);

  if (!isOpen || !card) return null;

  const handleSave = () => {
    let updatedNotes = card.notes;
    if (newNoteText.trim()) {
      updatedNotes = [
        ...card.notes,
        {
          id: `n-${Date.now()}`,
          author: '관리자 (Super Admin)',
          date: '2026.08.19 (방금)',
          content: newNoteText.trim()
        }
      ];
    }

    const updated: WebsiteKanbanCard = {
      ...card,
      stage: currentStage,
      assignee,
      notes: updatedNotes,
      progress:
        currentStage === 'completed'
          ? 100
          : currentStage === 'qa' || currentStage === 'revision'
          ? 85
          : currentStage === 'development'
          ? 70
          : currentStage === 'design'
          ? 50
          : currentStage === 'planning'
          ? 30
          : currentStage === 'awaiting_materials'
          ? 20
          : 10
    };

    onUpdateCard(updated);
    setNewNoteText('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#E2E8F0] shadow-2xl w-full max-w-6xl max-h-[min(92dvh,100%)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#0F172A] break-words">
                  홈페이지 주문 상세 관리: {card.projectName}
                </h2>
                <Badge variant={card.priority === 'high' ? 'red' : 'blue'} size="sm">
                  {card.priority === 'high' ? '긴급' : '보통'}
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] font-mono">
                주문번호: {card.orderNo || card.id} | mb_id: {card.mbId || card.studentId} | 주문일: {card.orderDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Column Body Layout (좌측: 수강생 정보 / 중앙: 제작 요청서 / 우측: 상태 & 메모) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ========================================================================= */}
          {/* Left Panel: 수강생 정보 (3 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3.5">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>수강생 정보</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#64748B] block">이름</span>
                  <span className="font-bold text-[#0F172A] text-sm">{card.studentName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">수강 기수</span>
                  <span className="font-bold text-[#2563EB]">SEO SYSTEM 300기</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">연락처</span>
                  <span className="font-mono text-[#0F172A]">{card.studentName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">이메일</span>
                  <span className="font-mono text-[#0F172A]">{card.studentId}</span>
                </div>
              </div>
            </div>

            {/* Material Readiness Card */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">제출 자료</h3>
              <p className="text-sm font-black text-[#0F172A]">{card.materialsStatus}</p>
              <p className="text-xs text-[#64748B]">카테고리 준비율을 임의 퍼센트로 표시하지 않습니다.</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Center Panel: 제작 요청서 본문 (5 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-4">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>제작 요청서 및 기획 명세</span>
              </h3>

              {/* Site Type */}
              <div className="space-y-1">
                <span className="text-xs text-[#64748B]">홈페이지 종류</span>
                <div className="text-sm font-bold text-[#0F172A]">{card.brief.siteType}</div>
              </div>

              {card.brief.businessDescription ? (
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">사업 설명</span>
                  <p className="text-xs text-[#0F172A] whitespace-pre-wrap">{card.brief.businessDescription}</p>
                </div>
              ) : null}

              {card.brief.businessInfoNote ? (
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">사업자 정보</span>
                  <p className="text-xs text-[#0F172A] whitespace-pre-wrap">{card.brief.businessInfoNote}</p>
                </div>
              ) : null}

              {(card.brief.boardRequests || []).length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-xs text-[#64748B]">게시판 요청</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(card.brief.boardRequests || []).map((item) => (
                      <span key={item} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {{ notice: '공지사항', faq: 'FAQ', gallery: '갤러리', download: '자료실', qna: '문의 게시판' }[item] || item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {(card.brief.programRequests || []).length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-xs text-[#64748B]">프로그램 요청</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(card.brief.programRequests || []).map((item) => (
                      <span key={item} className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
                        {{
                          inquiry_form: '상담·견적 문의폼',
                          reservation: '예약·신청',
                          membership: '회원가입·로그인',
                          payment: '결제',
                          admin: '관리자 기능',
                          map: '지도',
                          kakao: '카카오톡 연결',
                        }[item] || item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {(Object.keys(checklist.board).length > 0 || Object.keys(checklist.program).length > 0) && onSaveChecklist ? (
                <div className="space-y-3 pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">요청 작업 체크리스트</span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={checklistBusy}
                      onClick={() => {
                        setChecklistBusy(true);
                        setChecklistMsg('');
                        Promise.resolve(onSaveChecklist(checklist))
                          .then(() => setChecklistMsg('체크리스트 저장됨'))
                          .catch(() => setChecklistMsg('저장 실패'))
                          .finally(() => setChecklistBusy(false));
                      }}
                    >
                      체크리스트 저장
                    </Button>
                  </div>
                  {(['board', 'program'] as const).map((group) => {
                    const entries = Object.entries(checklist[group]);
                    if (!entries.length) return null;
                    return (
                      <div key={group} className="space-y-1.5">
                        <p className="text-[11px] font-bold text-[#64748B]">
                          {group === 'board' ? '게시판' : '프로그램'}
                        </p>
                        {entries.map(([key, status]) => (
                          <div key={`${group}-${key}`} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-[#0F172A]">{labelForKey(group, key)}</span>
                            <select
                              value={status}
                              onChange={(e) =>
                                setChecklist((prev) => ({
                                  ...prev,
                                  [group]: { ...prev[group], [key]: e.target.value },
                                }))
                              }
                              className="text-[11px] border border-[#E2E8F0] rounded-lg px-2 py-1 bg-white"
                            >
                              {CHECKLIST_STATUSES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {checklistMsg ? <p className="text-[11px] text-emerald-700 font-bold">{checklistMsg}</p> : null}
                </div>
              ) : null}

              {card.brief.extraRequest ? (
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">기타 요청사항</span>
                  <p className="text-xs text-[#0F172A] whitespace-pre-wrap rounded-xl bg-amber-50 border border-amber-100 p-3">
                    {card.brief.extraRequest}
                  </p>
                </div>
              ) : null}

              {card.brief.contacts && Object.keys(card.brief.contacts).length > 0 ? (
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">연락처</span>
                  <div className="text-xs text-[#475569] space-y-0.5">
                    {Object.entries(card.brief.contacts).map(([key, value]) =>
                      value ? (
                        <p key={key}>
                          {key}: {value}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              ) : null}

              {/* Structure */}
              <div className="space-y-1.5">
                <span className="text-xs text-[#64748B]">홈페이지 메뉴 구조</span>
                <div className="flex flex-wrap gap-1.5">
                  {card.brief.structure.map((menu, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-xs font-medium border border-[#E2E8F0]"
                    >
                      {idx + 1}. {menu}
                    </span>
                  ))}
                </div>
              </div>

              {/* Design Style & Brand Color */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">디자인 스타일</span>
                  <div className="text-xs font-bold text-[#0F172A]">{card.brief.designStyle}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#64748B]">브랜드 컬러</span>
                  <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB] border border-black/10 inline-block" />
                    <span>{card.brief.brandColor}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#64748B]">업로드 파일</span>
                {(card.files || []).length === 0 ? (
                  <p className="text-xs text-slate-400">업로드된 파일이 없습니다.</p>
                ) : (
                  <ul className="space-y-1">
                    {(card.files || []).map((f) => (
                      <li key={f.id} className="text-xs">
                        <a className="text-[#2563EB] font-bold" href={f.downloadUrl} target="_blank" rel="noreferrer">
                          {f.originalName}
                        </a>
                        <span className="text-slate-500"> · {f.category}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Features */}
              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#64748B]">필요 기능</span>
                <div className="flex flex-wrap gap-1.5">
                  {card.brief.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#64748B]">핵심 타겟 SEO 키워드</span>
                <div className="flex flex-wrap gap-1.5">
                  {card.brief.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* References */}
              {card.brief.referenceUrls.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#F1F5F9]">
                  <span className="text-xs text-[#64748B]">참고 사이트</span>
                  <div className="space-y-1">
                    {card.brief.referenceUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Right Panel: 진행 상태 변경 & 관리자 메모 (4 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            {/* Status Change Selector */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                제작 상태 변경
              </h3>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value as WebsiteKanbanStage)}
                className="w-full p-2.5 text-xs font-bold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
              >
                {STAGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {onSavePreviewUrl ? (
                <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B]">고객 미리보기 주소</span>
                  <input
                    type="url"
                    value={previewUrlDraft}
                    onChange={(e) => {
                      setPreviewUrlDraft(e.target.value);
                      if (previewMsg) setPreviewMsg('');
                    }}
                    placeholder="https://예고편.주소"
                    className="w-full p-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
                  />
                  <p className="text-[11px] text-[#64748B]">
                    이 주소가 있으면 고객 화면에 수정하기가 열립니다. 도메인만으로는 열리지 않습니다.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={previewBusy}
                    onClick={() => {
                      setPreviewBusy(true);
                      setPreviewMsg('');
                      Promise.resolve(onSavePreviewUrl(previewUrlDraft.trim()))
                        .then(() => setPreviewMsg('미리보기 주소를 저장했습니다.'))
                        .catch(() => setPreviewMsg('저장에 실패했습니다.'))
                        .finally(() => setPreviewBusy(false));
                    }}
                  >
                    {previewBusy ? '저장 중' : '미리보기 주소 저장'}
                  </Button>
                  {previewMsg ? (
                    <p className={`text-[11px] font-bold ${previewMsg.includes('실패') ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {previewMsg}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-1 pt-2">
                <span className="text-xs text-[#64748B]">담당 엔지니어 배정</span>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full p-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
                >
                  <option value="디자이너 최">디자이너 최 (UI/UX)</option>
                  <option value="개발자 박">개발자 박 (Full-Stack)</option>
                  <option value="디렉터 정">디렉터 정 (SEO 총괄)</option>
                </select>
              </div>
            </div>

            {/* Admin Notes History */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>관리자 내부 메모 ({card.notes.length}건)</span>
              </h3>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {card.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-[#64748B]">
                      <strong className="text-[#0F172A]">{note.author}</strong>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-[#334155] leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="새 메모 작성 (진행 이슈, 수강생 요청 등)..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h3 className="text-xs font-bold text-amber-900">추가자료 요청 (학생에게 표시)</h3>
              <input
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="제목"
                className="w-full p-2 text-xs border border-amber-200 rounded-xl"
              />
              <textarea
                value={reqBody}
                onChange={(e) => setReqBody(e.target.value)}
                placeholder="요청 내용"
                rows={3}
                className="w-full p-2 text-xs border border-amber-200 rounded-xl"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={!reqTitle.trim() || !reqBody.trim()}
                onClick={() => {
                  onRequestMoreInfo?.({ title: reqTitle.trim(), body: reqBody.trim(), adminMemo: newNoteText.trim() || undefined });
                  setReqTitle('');
                  setReqBody('');
                }}
              >
                추가자료 요청
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-bold">
            닫기
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            className="text-xs font-bold px-6 shadow-xs"
          >
            {isSaved ? '저장 완료!' : '상태 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
};
