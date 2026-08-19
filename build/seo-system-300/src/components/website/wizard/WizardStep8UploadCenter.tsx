import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Circle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Edit2,
  Plus,
  Send,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe2,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { Button } from '../../common/Button';

export interface UploadedFileItem {
  id: string;
  categoryId: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  memo?: string;
  previewUrl?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  desc: string;
  status: 'completed' | 'needs_more' | 'pending';
  required: boolean;
  acceptedFormats: string;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'logo',
    name: '로고 (Logo)',
    desc: '고해상도 투명 배경 로고 (AI, SVG, PNG 원본 권장)',
    status: 'completed',
    required: true,
    acceptedFormats: 'PNG, JPG, WEBP, AI, PSD'
  },
  {
    id: 'company_intro',
    name: '회사소개',
    desc: '대표 인사말, 회사 연혁, 비전, 서비스 특장점 텍스트',
    status: 'completed',
    required: true,
    acceptedFormats: 'HWP, DOCX, PDF, TXT'
  },
  {
    id: 'hero_photos',
    name: '대표사진',
    desc: '메인 상단 히어로 배너에 들어갈 고화질 전경/배경 사진',
    status: 'completed',
    required: true,
    acceptedFormats: 'JPG, PNG, WEBP (최소 1920px)'
  },
  {
    id: 'product_photos',
    name: '제품 / 서비스 사진',
    desc: '상세 페이지 및 갤러리에 등록될 객실/시공/상품 사진들',
    status: 'needs_more',
    required: false,
    acceptedFormats: 'ZIP, JPG, PNG'
  },
  {
    id: 'price_table',
    name: '가격표 / 요금안내',
    desc: '이용 요금, 패키지 비용, 옵션 추가비 정리표',
    status: 'completed',
    required: false,
    acceptedFormats: 'XLSX, PDF, 이미지'
  },
  {
    id: 'business_info',
    name: '사업자정보',
    desc: '사업자등록증 사본 또는 푸터 기재용 상호/대표자/등록번호',
    status: 'completed',
    required: true,
    acceptedFormats: 'PDF, JPG'
  },
  {
    id: 'contact_channels',
    name: '연락처 / 상담 채널',
    desc: '대표전화, 고객센터 번호, 카톡 채널 링크, 이메일',
    status: 'completed',
    required: true,
    acceptedFormats: '텍스트 직접 입력'
  },
  {
    id: 'sns_links',
    name: 'SNS 링크',
    desc: '인스타그램, 유튜브, 블로그, 페이스북 계정 URL',
    status: 'needs_more',
    required: false,
    acceptedFormats: 'URL 링크'
  },
  {
    id: 'brochure',
    name: '기존 브로슈어',
    desc: '기존에 제작된 PDF 카탈로그 또는 리플렛 디자인 파일',
    status: 'pending',
    required: false,
    acceptedFormats: 'PDF, AI, PPT'
  },
  {
    id: 'other_files',
    name: '기타 참고자료',
    desc: '서치콘솔 인증파일, 협회 인증서, 보도자료 등',
    status: 'pending',
    required: false,
    acceptedFormats: '모든 형식'
  }
];

export interface WizardStep8UploadCenterProps {
  onPrev: () => void;
  onSubmitFinal: () => void;
  files?: UploadedFileItem[];
  uploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  onUploadFiles?: (categoryId: string, files: FileList) => void;
  onDeleteFile?: (id: string) => void;
}

export const WizardStep8UploadCenter: React.FC<WizardStep8UploadCenterProps> = ({
  onPrev,
  onSubmitFinal,
  files,
  uploading = false,
  uploadProgress = 0,
  uploadError = '',
  onUploadFiles,
  onDeleteFile
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<MaterialCategory[]>(
    MATERIAL_CATEGORIES.map((c) => ({ ...c, status: 'pending' as const }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('logo');
  const [localFiles, setLocalFiles] = useState<UploadedFileItem[]>([]);
  const uploadedFiles = files || localFiles;

  const [contactPhone, setContactPhone] = useState('');
  const [contactKakao, setContactKakao] = useState('');
  const [contactTelegram, setContactTelegram] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactMapUrl, setContactMapUrl] = useState('');

  // Active editing memo
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoDraft, setMemoDraft] = useState('');

  // Drag over state
  const [isDragOver, setIsDragOver] = useState(false);

  // Calculate readiness percentage dynamically
  const completedCount = categories.filter((c) => c.status === 'completed').length;
  const needsMoreCount = categories.filter((c) => c.status === 'needs_more').length;
  const readinessPercent = Math.round(
    ((completedCount * 1.0 + needsMoreCount * 0.5) / categories.length) * 100
  );

  const handleIncomingFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    if (onUploadFiles) {
      onUploadFiles(selectedCategory, list);
      return;
    }
    const currentCatObj = categories.find((c) => c.id === selectedCategory);
    const extra: UploadedFileItem[] = Array.from(list).map((file, idx) => ({
      id: `local-${Date.now()}-${idx}`,
      categoryId: selectedCategory,
      fileName: file.name,
      fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: '방금 전'
    }));
    const next = [...localFiles, ...extra];
    setLocalFiles(next);
    setCategories(
      categories.map((c) => (c.id === selectedCategory ? { ...c, status: 'completed' } : c))
    );
    void currentCatObj;
  };

  const handleDropOrSelect = (e?: React.DragEvent) => {
    if (e) {
      e.preventDefault();
      setIsDragOver(false);
      handleIncomingFiles(e.dataTransfer?.files || null);
      return;
    }
    fileInputRef.current?.click();
  };

  // Delete file
  const handleDeleteFile = (id: string) => {
    if (onDeleteFile) {
      onDeleteFile(id);
      return;
    }
    const remaining = localFiles.filter((f) => f.id !== id);
    setLocalFiles(remaining);

    const hasFilesForCat = remaining.some((f) => f.categoryId === selectedCategory);
    if (!hasFilesForCat) {
      setCategories(
        categories.map((c) => (c.id === selectedCategory ? { ...c, status: 'pending' } : c))
      );
    }
  };

  // Save memo
  const handleSaveMemo = (id: string) => {
    setLocalFiles(
      localFiles.map((f) => (f.id === id ? { ...f, memo: memoDraft } : f))
    );
    setEditingMemoId(null);
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const categoryFiles = uploadedFiles.filter((f) => f.categoryId === selectedCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. All-in-one Upload Center Banner & Readiness Indicator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>SEO SYSTEM 300 올인원 자료 제출 센터</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              카카오톡이나 이메일 전송 없이, 플랫폼에서 한 번에 제출!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              로고, 사진, 사업자등록증, 연락처 등 홈페이지 제작에 필요한 모든 자료를 이곳에 올려주시면 전담 퍼블리셔가 즉시 확인하고 작업을 진행합니다.
            </p>
          </div>

          {/* Readiness Circle / Progress Summary */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[200px] shrink-0 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">전체 자료 준비율</span>
            <div className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <span>{readinessPercent}%</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              총 10개 항목 중 <strong className="text-white">{completedCount}개 완료</strong>
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>최소 필수 항목만 제출하셔도 제작을 바로 착수할 수 있습니다.</span>
            <span className="text-emerald-400 font-bold">제작 착수 가능 상태</span>
          </div>
        </div>
      </div>

      {/* 2. Category Navigation & File Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Categories List (4 Cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-2 text-xs font-bold text-[#64748B] border-b border-[#E2E8F0]">
            <span>자료 카테고리 (10개)</span>
            <span>준비 현황</span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const filesCount = uploadedFiles.filter((f) => f.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#0F172A] shadow-xs'
                      : 'border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold truncate">{cat.name}</h5>
                      {cat.required && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          필수
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">{cat.desc}</p>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {cat.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>제출완료 {filesCount > 0 && `(${filesCount})`}</span>
                      </span>
                    )}
                    {cat.status === 'needs_more' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>추가필요</span>
                      </span>
                    )}
                    {cat.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-200">
                        <Circle className="w-2.5 h-2.5 text-slate-400" />
                        <span>아직 없음</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Category Upload Dropzone & Files Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#F8FAFC] p-5 rounded-3xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <span>{currentCategoryObj?.name} 업로드 관리</span>
                  {currentCategoryObj?.required && (
                    <span className="text-[10px] font-bold text-rose-500">• 필수 제출 항목</span>
                  )}
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">{currentCategoryObj?.desc}</p>
              </div>

              <span className="text-[11px] font-mono font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#DBEAFE]">
                {currentCategoryObj?.acceptedFormats}
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => handleDropOrSelect(e)}
              onClick={() => handleDropOrSelect()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                isDragOver
                  ? 'border-[#2563EB] bg-[#EFF6FF]'
                  : 'border-[#CBD5E1] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF]/30'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
                  파일을 여기로 드래그하거나 <span className="text-[#2563EB] underline">클릭하여 선택</span>하세요
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  지원 형식: {currentCategoryObj?.acceptedFormats} (최대 12MB, SVG/실행파일 불가)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  handleIncomingFiles(e.target.files);
                  e.currentTarget.value = '';
                }}
              />
            </div>
            {uploadError ? (
              <p className="text-xs text-rose-600 font-semibold">{uploadError}</p>
            ) : null}
            {uploading ? (
              <p className="text-xs text-blue-600 font-semibold">업로드 중 {uploadProgress}%</p>
            ) : null}

            {/* Uploaded Files List for Selected Category */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#64748B] block">
                등록된 파일 ({categoryFiles.length}개)
              </span>

              {categoryFiles.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-center text-xs text-[#94A3B8]">
                  아직 등록된 파일이 없습니다. 상단 드롭존에 파일을 업로드해주세요.
                </div>
              ) : (
                categoryFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#0F172A] truncate">{file.fileName}</p>
                          <p className="text-[10px] text-[#64748B]">
                            {file.fileSize} • {file.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDropOrSelect()}
                          className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#2563EB]"
                          title="교체"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMemoId(file.id);
                            setMemoDraft(file.memo || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#2563EB]"
                          title="메모 추가"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Memo Display or Inline Edit Form */}
                    {editingMemoId === file.id ? (
                      <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2">
                        <input
                          type="text"
                          value={memoDraft}
                          onChange={(e) => setMemoDraft(e.target.value)}
                          placeholder="퍼블리셔에게 전달할 메모 입력 (예: 2페이지 우측에 배치)"
                          className="flex-1 px-3 py-1.5 text-xs border border-[#2563EB] rounded-lg focus:outline-hidden bg-white"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSaveMemo(file.id)}
                        >
                          저장
                        </Button>
                      </div>
                    ) : (
                      file.memo && (
                        <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569] flex items-center gap-1.5">
                          <Info className="w-3 h-3 text-[#2563EB] shrink-0" />
                          <span className="truncate">{file.memo}</span>
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Integrated Contact Channels Section (연락처 통합 입력) */}
      <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2563EB]" />
            <span>홈페이지에 노출될 대표 연락처 & 고객센터 채널 통합 등록</span>
          </h4>
          <p className="text-xs text-[#64748B]">
            헤더, 푸터, 플로팅 상담 위젯에 자동으로 연결될 주요 채널 정보를 입력해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 전화번호 */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">대표 전화번호</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* 카카오톡 */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">카카오톡 채널 / ID</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <MessageCircle className="w-4 h-4 text-[#F59E0B]" />
              <input
                type="text"
                value={contactKakao}
                onChange={(e) => setContactKakao(e.target.value)}
                placeholder="@cebutrip_official"
                className="w-full bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">대표 이메일</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@cebutrip.co.kr"
                className="w-full bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Telegram */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">Telegram ID / 채널</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <Send className="w-4 h-4 text-[#0284C7]" />
              <input
                type="text"
                value={contactTelegram}
                onChange={(e) => setContactTelegram(e.target.value)}
                placeholder="@cebu_reservation"
                className="w-full bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">WhatsApp 번호</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <Globe2 className="w-4 h-4 text-[#10B981]" />
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                placeholder="+63-917-123-4567"
                className="w-full bg-transparent focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Google Map / 주소 */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#0F172A]">사업장 주소 / 지도 링크</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              <MapPin className="w-4 h-4 text-[#EF4444]" />
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="필리핀 세부 막탄 리조트 지구"
                className="w-full bg-transparent focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Final Submission Summary & CTA */}
      <div className="wizard-cta-bar">
        <Button
          variant="outline"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrev}
        >
          이전 (STEP 7 기능 선택)
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<Send className="w-5 h-5" />}
            onClick={onSubmitFinal}
            className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 font-bold px-8 py-3.5 shadow-sm text-sm"
          >
            기획 & 자료 완비 홈페이지 제작 주문서 최종 접수 →
          </Button>
        </div>
      </div>
    </div>
  );
};
