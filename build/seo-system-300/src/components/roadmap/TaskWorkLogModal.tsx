import React, { useState, useEffect } from 'react';
import {
  FileText,
  Link,
  Target,
  Calendar,
  Image as ImageIcon,
  Wrench,
  CheckCircle2,
  UploadCloud,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { TaskWorkLog, ToolSubTab } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface TaskWorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | string;
  taskTitle: string;
  defaultKeyword?: string;
  defaultTool?: TaskWorkLog['relatedTool'];
  existingLog?: TaskWorkLog;
  onSaveLog: (log: Omit<TaskWorkLog, 'id' | 'createdAt' | 'status'>) => void;
  onUploadScreenshot?: (file: File) => Promise<number>;
}

export const TaskWorkLogModal: React.FC<TaskWorkLogModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  defaultKeyword = '',
  defaultTool = 'content',
  existingLog,
  onSaveLog,
  onUploadScreenshot
}) => {
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotFileId, setScreenshotFileId] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [relatedTool, setRelatedTool] = useState<TaskWorkLog['relatedTool']>('content');

  useEffect(() => {
    if (existingLog) {
      setUrl(existingLog.url || '');
      setTargetKeyword(existingLog.targetKeyword || '');
      setPublishDate(existingLog.publishDate || new Date().toISOString().slice(0, 10));
      setNotes(existingLog.notes || '');
      setScreenshotUrl(existingLog.screenshotUrl || '');
      setScreenshotFileId(existingLog.screenshotFileId || 0);
      setRelatedTool(existingLog.relatedTool || 'content');
    } else {
      setUrl('');
      setTargetKeyword(defaultKeyword);
      setPublishDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setScreenshotUrl('');
      setScreenshotFileId(0);
      setRelatedTool(defaultTool);
      setUploadError('');
    }
  }, [isOpen, existingLog, defaultKeyword, defaultTool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !targetKeyword.trim()) {
      alert('URL과 목표 키워드는 필수 항목입니다.');
      return;
    }

    onSaveLog({
      taskId,
      taskTitle,
      url: url.trim(),
      targetKeyword: targetKeyword.trim(),
            publishDate: publishDate.trim(),
      notes: notes.trim(),
      screenshotUrl: screenshotUrl.trim() || undefined,
      screenshotFileId: screenshotFileId || undefined,
      relatedTool
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="작업 결과 기록 (Proof of Work)"
      subtitle={`[STEP ${taskId}] ${taskTitle} 작업 증빙 및 실행 결과를 프로젝트 성장일지에 기록합니다.`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Task Title Banner */}
        <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase">실행 미션</span>
              <h4 className="font-bold text-[#0F172A] truncate">{taskTitle}</h4>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#2563EB] font-bold border border-[#DBEAFE] shrink-0">
            결과 저장 시 자동 완료 처리
          </span>
        </div>

        {/* 1. URL */}
        <div className="space-y-1.5">
          <label className="block font-bold text-[#0F172A] flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>작업 URL (등록/발행 주소) <strong className="text-rose-500">*</strong></span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="예: https://cebutrip.co.kr/cebu-travel-guide-2026"
            className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
            required
          />
        </div>

        {/* 2. Target Keyword & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>목표 키워드 <strong className="text-rose-500">*</strong></span>
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="예: 세부여행, 세부 풀빌라"
              className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>발행일 / 작업 완료일</span>
            </label>
            <input
              type="text"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              placeholder="2026.08.19"
              className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
            />
          </div>
        </div>

        {/* 3. Related Tool */}
        <div className="space-y-1.5">
          <label className="block font-bold text-[#0F172A] flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>관련 Tool</span>
          </label>
          <select
            value={relatedTool}
            onChange={(e) => setRelatedTool(e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white font-medium"
          >
            <option value="content">Content Automation (콘텐츠 자동화 엔진)</option>
            <option value="catchdomain">CatchDomain (만료도메인 발굴기)</option>
            <option value="backlink">Backlink Builder (백링크 주입/분석)</option>
            <option value="traffic">Traffic Booster (트래픽 관리)</option>
            <option value="gsc">Google Search Console (구글 서치콘솔)</option>
            <option value="direct">직접 수동 작업 (수동 포스팅/설정)</option>
            <option value="other">기타 외부 도구</option>
          </select>
        </div>

        {/* 4. Notes */}
        <div className="space-y-1.5">
          <label className="block font-bold text-[#0F172A]">작업 메모 / 특이사항</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="예: 롱테일 키워드 3건 배치, Silo 내부링크 연결, LCP 1.1초 최적화 완료"
            className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
          />
        </div>

        {/* 5. Screenshot */}
        <div className="space-y-1.5">
          <label className="block font-bold text-[#0F172A] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Screenshot (jpg / png / webp)</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-xs"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !onUploadScreenshot) return;
              setUploadError('');
              try {
                const uploaded = await onUploadScreenshot(file);
                setScreenshotFileId(uploaded);
              } catch (err) {
                setUploadError(err instanceof Error ? err.message : '스크린샷 업로드에 실패했습니다.');
              }
            }}
          />
          {screenshotFileId > 0 ? (
            <p className="text-[11px] text-emerald-700 font-bold">스크린샷 업로드 완료 (#{screenshotFileId})</p>
          ) : null}
          {uploadError ? <p className="text-[11px] text-rose-600">{uploadError}</p> : null}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
              placeholder="https://... 또는 스크린샷 이미지 주소"
              className="w-full px-3.5 py-2 text-xs font-mono border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
            />
          </div>
          {screenshotUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border border-[#E2E8F0] h-28 bg-slate-100 relative group">
              <img
                src={screenshotUrl}
                alt="Screenshot preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                미리보기 이미지 등록됨
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            rightIcon={<CheckCircle2 className="w-4 h-4" />}
            className="bg-[#2563EB] hover:bg-blue-700 font-bold"
          >
            작업 완료 저장
          </Button>
        </div>
      </form>
    </Modal>
  );
};
