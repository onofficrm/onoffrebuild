import React, { useState } from 'react';
import {
  LayoutTemplate,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  Send,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Wrench,
  Compass
} from 'lucide-react';
import {
  WebsiteSubTab,
  WebsiteOrder,
  RevisionTicket,
  StatusType,
  Project
} from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Tabs } from '../common/Tabs';
import { Modal } from '../common/Modal';
import { WebsiteOrderWizard } from './WebsiteOrderWizard';
import type { ApiWebsiteOrder } from '../../services/websiteOrderService';
import type { UploadedFileItem } from './wizard/WizardStep8UploadCenter';
import { isDraftOrderStatus, isSubmittedOrderStatus, WEBSITE_ORDER_STATUS, WEBSITE_ORDER_STATUS_LABEL, WEBSITE_PROCESS_STEPS } from '../../constants/seoSystem300';

export interface WebsiteViewProps {
  activeSubTab: WebsiteSubTab;
  setActiveSubTab: (subTab: WebsiteSubTab) => void;
  order: WebsiteOrder;
  revisions: RevisionTicket[];
  project: Project | null;
  onAddRevision: (revision: Omit<RevisionTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onSubmitNewOrder: (newOrder: Partial<WebsiteOrder>) => void;
  liveOrder?: ApiWebsiteOrder | null;
  liveError?: string;
  onRetryLive?: () => void;
  onSaveDraft?: (payload: Record<string, unknown>) => Promise<void>;
  onSubmitLive?: (payload: Record<string, unknown>) => Promise<void>;
  onStartDraft?: () => Promise<void>;
  wizardFiles?: UploadedFileItem[];
  uploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  onUploadFiles?: (categoryId: string, files: FileList) => void;
  onDeleteFile?: (id: string) => void;
  onUpdateFileMemo?: (id: string, memo: string) => void;
  onReplaceFile?: (id: string, file: File) => void;
  saveError?: string;
  saveStatus?: 'idle' | 'saving' | 'saved';
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  activeSubTab,
  setActiveSubTab,
  order,
  revisions,
  project,
  onAddRevision,
  onSubmitNewOrder,
  liveOrder = null,
  liveError = '',
  onRetryLive,
  onSaveDraft,
  onSubmitLive,
  onStartDraft,
  wizardFiles,
  uploading,
  uploadProgress,
  uploadError,
  onUploadFiles,
  onDeleteFile,
  onUpdateFileMemo,
  onReplaceFile,
  saveError,
  saveStatus
}) => {
  // Modal states
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionTitle, setRevisionTitle] = useState('');
  const [revisionCategory, setRevisionCategory] = useState<RevisionTicket['category']>('design');
  const [revisionPriority, setRevisionPriority] = useState<RevisionTicket['priority']>('medium');
  const [revisionDesc, setRevisionDesc] = useState('');

  // Order mode state: 'wizard' vs 'quick'
  const [orderMode, setOrderMode] = useState<'wizard' | 'quick'>('wizard');

  // Quick Order Form State
  const [orderSiteType, setOrderSiteType] = useState<WebsiteOrder['siteType']>('blog');
  const [orderNiche, setOrderNiche] = useState('해외여행 / 액티비티 / 호텔 리뷰');
  const [orderKeywords, setOrderKeywords] = useState('세부 자유여행 코스, 세부 호핑투어, 막탄 리조트');
  const [orderTheme, setOrderTheme] = useState('모던 매거진형 여행 테마 (고속 SEO 최적화)');
  const [orderRefs, setOrderRefs] = useState('https://sample-travel.com');
  const [orderRequests, setOrderRequests] = useState('구글 코어 웹 바이탈 최적화, 자동 목차 플러그인 포함');
  const [orderSubmittedSuccess, setOrderSubmittedSuccess] = useState(false);

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionTitle.trim() || !revisionDesc.trim()) return;

    onAddRevision({
      orderId: order.id,
      title: revisionTitle,
      category: revisionCategory,
      priority: revisionPriority,
      description: revisionDesc
    });

    setRevisionTitle('');
    setRevisionDesc('');
    setIsRevisionModalOpen(false);
  };

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitNewOrder({
      siteType: orderSiteType,
      targetNiche: orderNiche,
      targetKeywords: orderKeywords.split(',').map((k) => k.trim()),
      theme: orderTheme,
      referenceUrls: [orderRefs],
      specialRequests: orderRequests
    });
    setOrderSubmittedSuccess(true);
    setTimeout(() => {
      setOrderSubmittedSuccess(false);
      setActiveSubTab('status');
    }, 1200);
  };

  const handleWizardSubmit = (orderData: Record<string, unknown> | Partial<WebsiteOrder>) => {
    if (onSubmitLive) void onSubmitLive(orderData as Record<string, unknown>);
    else onSubmitNewOrder(orderData as Partial<WebsiteOrder>);
  };

  const tabs = [
    { id: 'status' as WebsiteSubTab, label: '제작현황 및 타임라인' },
    { id: 'order' as WebsiteSubTab, label: '홈페이지 신규 주문' },
    { id: 'revision' as WebsiteSubTab, label: '수정요청 관리', count: revisions.length }
  ];

  return (
    <div className="space-y-6">
      {!project ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] text-center space-y-3">
          <h2 className="text-lg font-black">프로젝트를 먼저 선택해주세요.</h2>
          <p className="text-sm text-slate-500">홈페이지 주문은 선택된 SEO 프로젝트에 저장됩니다.</p>
        </div>
      ) : null}
      {liveError ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-800 flex items-center justify-between gap-3">
          <span>불러오기 실패. {liveError}</span>
          {onRetryLive ? (
            <Button size="sm" variant="outline" onClick={onRetryLive}>
              다시 시도
            </Button>
          ) : null}
        </div>
      ) : null}
      {liveOrder && isDraftOrderStatus(liveOrder.status) ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">작성 중인 홈페이지 기획이 있습니다.</p>
            <p className="text-xs text-slate-500">임시저장된 내용을 이어서 작성할 수 있습니다.</p>
          </div>
          <Button size="sm" variant="primary" onClick={() => setActiveSubTab('order')}>
            계속 작성하기
          </Button>
        </div>
      ) : null}
      {liveOrder && liveOrder.status === WEBSITE_ORDER_STATUS.NEED_MORE_INFO ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-amber-900">⚠ 추가자료 필요</p>
            <p className="text-xs text-amber-800">
              {liveOrder.materialsRequest?.title || '관리자가 추가 자료를 요청했습니다.'}
            </p>
            {liveOrder.materialsRequest?.body ? (
              <p className="text-xs text-amber-800 mt-1">{liveOrder.materialsRequest.body}</p>
            ) : null}
          </div>
          <Button size="sm" variant="primary" onClick={() => setActiveSubTab('order')}>
            자료 업로드
          </Button>
        </div>
      ) : null}
      {liveOrder &&
      isSubmittedOrderStatus(liveOrder.status) &&
      liveOrder.status !== WEBSITE_ORDER_STATUS.NEED_MORE_INFO ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">
              홈페이지 주문이 {WEBSITE_ORDER_STATUS_LABEL[liveOrder.status] || liveOrder.status} 상태입니다.
            </p>
            <p className="text-xs text-slate-500">새 위저드 대신 제작현황에서 진행 상태를 확인하세요.</p>
          </div>
          <Button size="sm" variant="primary" onClick={() => setActiveSubTab('status')}>
            제작현황 보기
          </Button>
        </div>
      ) : null}
      {/* Top Title Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>SEO SYSTEM 300 전담 퍼블리싱 관제</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            홈페이지 제작 관제소
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            비전문가도 쉬운 질문형 위저드로 홈페이지를 기획하고, 제작 타임라인 및 수정 요청을 실시간으로 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {activeSubTab === 'order' && (
            <div className="p-1 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setOrderMode('wizard')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  orderMode === 'wizard'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                ✨ 쉬운 기획 위저드
              </button>
              <button
                onClick={() => setOrderMode('quick')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  orderMode === 'quick'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                빠른 직접 작성 Form
              </button>
            </div>
          )}

          {activeSubTab === 'revision' && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setIsRevisionModalOpen(true)}
            >
              수정요청 티켓 등록
            </Button>
          )}

          {activeSubTab === 'status' && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setActiveSubTab('order');
                setOrderMode('wizard');
              }}
            >
              새 홈페이지 주문하기
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <Tabs tabs={tabs} activeTab={activeSubTab} onChange={setActiveSubTab} variant="pills" />

      {/* ========================================================================= */}
      {/* Sub-Tab 1: 제작현황 (Status & Timeline) */}
      {/* ========================================================================= */}
      {activeSubTab === 'status' && (
        <div className="space-y-6">
          {/* Main Status Overview Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-300">
                    주문번호: {liveOrder?.orderNo || liveOrder?.id || order.id}
                  </span>
                  <Badge variant="green" size="sm" dot>
                    {liveOrder
                      ? WEBSITE_ORDER_STATUS_LABEL[liveOrder.status] || liveOrder.status
                      : order.currentStageName}
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {liveOrder ? liveOrder.siteName || liveOrder.projectName || project?.name : order.projectName}
                </h2>
                <p className="text-xs text-slate-300">
                  {liveOrder
                    ? `자료 준비율 ${liveOrder.materialsReadiness ?? 0}% · 파일 ${(liveOrder.files || []).length}개`
                    : `담당 퍼블리셔: ${order.assignedEngineer} | 예상 일정: ${order.eta}`}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {order.liveUrl && (
                  <a
                    href={order.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <span>라이브 사이트 열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setActiveSubTab('revision')}
                >
                  수정요청 남기기
                </Button>
              </div>
            </div>

            {/* Overall Production Progress */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">제작 공정률</span>
                <span className="text-emerald-400 font-extrabold">
                  {(liveOrder ? liveOrder.progress : order.progress)}% (
                  {liveOrder
                    ? WEBSITE_ORDER_STATUS_LABEL[liveOrder.status] || liveOrder.status
                    : order.status === 'delivered'
                    ? '납품 완료'
                    : '공정 진행중'}
                  )
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${liveOrder ? liveOrder.progress : order.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 5-Stage Milestone Timeline Visualizer */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A]">제작 공정 타임라인 및 마일스톤</h3>
              <span className="text-xs text-[#64748B]">실제 상태 기록 기준</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {WEBSITE_PROCESS_STEPS.map((ms) => {
                const current = liveOrder?.processStep || 0;
                const isDone = current >= ms.id;
                const isNow = current === ms.id;
                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-2xl border relative transition-all ${
                      isDone ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#0F172A]' : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-70'
                    } ${isNow ? 'ring-2 ring-[#2563EB]/30' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider">
                        {ms.id} / 7
                      </span>
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Clock className="w-4 h-4 text-[#94A3B8]" />}
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A] mb-1">{ms.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-2">{isNow ? '진행 중' : isDone ? '완료' : '대기'}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Site Specs & Quality Checklist Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
                적용된 SEO 스펙 & 기술 사양
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">사이트 테마:</span>
                  <span className="font-bold text-[#0F172A]">{order.theme}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">코어 웹 바이탈 최적화:</span>
                  <span className="font-bold text-[#10B981]">DEMO 연동 전</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">구조화 데이터(Schema):</span>
                  <span className="font-bold text-[#0F172A]">Article, FAQPage, Organization</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#64748B]">색인 제어 파일:</span>
                  <span className="font-bold text-[#0F172A]">Robots.txt, Sitemap.xml 자동 갱신</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
                타겟 니치 및 키워드 구조
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#64748B] block mb-1">타겟 니치:</span>
                  <p className="font-semibold text-[#0F172A] p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    {order.targetNiche}
                  </p>
                </div>
                <div>
                  <span className="text-[#64748B] block mb-1">설정된 메인 키워드군:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {order.targetKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold text-xs border border-[#DBEAFE]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-Tab 2: 홈페이지 주문 (Wizard vs Quick Form) */}
      {/* ========================================================================= */}
      {activeSubTab === 'order' && (
        <div>
          {orderMode === 'wizard' ? (
            liveOrder &&
            isSubmittedOrderStatus(liveOrder.status) &&
            liveOrder.status !== WEBSITE_ORDER_STATUS.NEED_MORE_INFO ? (
              <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] text-center space-y-3">
                <h2 className="text-lg font-black">이미 제출된 주문이 있습니다.</h2>
                <p className="text-sm text-slate-500">제작현황 화면에서 진행 상태를 확인하세요.</p>
                <Button variant="primary" onClick={() => setActiveSubTab('status')}>
                  제작현황으로 이동
                </Button>
              </div>
            ) : (
            <WebsiteOrderWizard
              key={liveOrder ? `order-${liveOrder.id}` : 'order-new'}
              onSubmitOrder={handleWizardSubmit}
              onCancel={() => setActiveSubTab('status')}
              onSaveDraft={onSaveDraft}
              saveError={saveError}
              initialValues={
                liveOrder
                  ? {
                      wizardStep: liveOrder.wizardStep,
                      siteType: liveOrder.siteType,
                      purposes: liveOrder.purposes,
                      industry: liveOrder.industry,
                      siteName: liveOrder.siteName,
                      brandName: liveOrder.brandName,
                      phone: liveOrder.phone,
                      email: liveOrder.email,
                      region: liveOrder.region,
                      businessDescription: liveOrder.businessDescription,
                      currentUrl: liveOrder.currentUrl,
                      designStyle: liveOrder.designStyle,
                      primaryColor: liveOrder.primaryColor,
                      customColor: liveOrder.customColor,
                      contacts: liveOrder.contacts || {},
                      extraRequest: liveOrder.extraRequest || '',
                      accentColor: liveOrder.accentColor || '',
                      orderNo: liveOrder.orderNo || '',
                      status: liveOrder.status,
                      menus: liveOrder.menus.map((m) => ({
                        id: String(m.id),
                        title: m.label,
                        isSubItem: m.parentId > 0
                      })),
                      features: liveOrder.features.map((f) => f.key),
                      references: liveOrder.references.map((r) => r.url)
                    }
                  : null
              }
              files={wizardFiles}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              onUploadFiles={onUploadFiles}
              onDeleteFile={onDeleteFile}
              onUpdateFileMemo={onUpdateFileMemo}
              onReplaceFile={onReplaceFile}
              saveStatus={saveStatus}
            />
            )
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
              <div className="border-b border-[#F1F5F9] pb-4">
                <h2 className="text-base font-bold text-[#0F172A]">SEO 전용 웹사이트 직접 주문서</h2>
                <p className="text-xs text-[#64748B]">
                  직접 세부 기획 사항을 입력하여 사이트 제작을 요청합니다.
                </p>
              </div>

              {orderSubmittedSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">주문서가 성공적으로 접수되었습니다!</h3>
                  <p className="text-xs text-[#64748B]">
                    SYSTEM 300 전담 퍼블리셔가 배정되어 24시간 이내에 기획 검토를 시작합니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuickOrderSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                        웹사이트 유형 <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={orderSiteType}
                        onChange={(e) => setOrderSiteType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                      >
                        <option value="blog">수익형 정보성 블로그 (애드센스/제휴마케팅)</option>
                        <option value="affiliate">전문 상품/호텔 비교 어필리에이트 사이트</option>
                        <option value="landing">DB 수집 및 전문 서비스 랜딩페이지</option>
                        <option value="business">기업/브랜드 포트폴리오 사이트</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                        적용 희망 테마 스킨 <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={orderTheme}
                        onChange={(e) => setOrderTheme(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                      >
                        <option value="모던 매거진형 여행 테마 (고속 SEO 최적화)">모던 매거진형 테마 (SEO 95+ 최적화)</option>
                        <option value="심플 미니멀 테크/IT 블로그 스킨">심플 미니멀 테크/IT 블로그 스킨</option>
                        <option value="고전환율 DB 수집형 랜딩 스킨">고전환율 DB 수집형 랜딩 스킨</option>
                        <option value="비교 차트 특화 리뷰 포털 스킨">비교 차트 특화 리뷰 포털 스킨</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      타겟 니치(주제) 및 타겟 오디언스 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderNiche}
                      onChange={(e) => setOrderNiche(e.target.value)}
                      placeholder="예: 동남아 필리핀 세부 자유여행, 호핑투어, 리조트 가이드"
                      className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      핵심 타겟 키워드 (쉼표로 구분) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderKeywords}
                      onChange={(e) => setOrderKeywords(e.target.value)}
                      placeholder="예: 세부 자유여행 코스, 세부 호핑투어 추천, 막탄 리조트 가성비"
                      className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      벤치마킹 참고 사이트 URL (선택)
                    </label>
                    <input
                      type="text"
                      value={orderRefs}
                      onChange={(e) => setOrderRefs(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      특별 요청사항 및 SEO 요구조건
                    </label>
                    <textarea
                      value={orderRequests}
                      onChange={(e) => setOrderRequests(e.target.value)}
                      rows={3}
                      placeholder="예: 모바일 상단 배너 여백 최소화, 자동 목차(TOC) 포함, 구글 서치콘솔 사전 인증 파일 첨부"
                      className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
                    <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>
                      홈페이지 주문서 접수하기
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-Tab 3: 수정요청 (Revisions Ticket System) */}
      {/* ========================================================================= */}
      {activeSubTab === 'revision' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              홈페이지 배포 후 레이아웃, 디자인, SEO 태그 관련 수정 요청 사항을 기록하고 처리 현황을 확인합니다.
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setIsRevisionModalOpen(true)}
            >
              새 수정요청 작성
            </Button>
          </div>

          <div className="space-y-3">
            {revisions.map((rev) => {
              const isCompleted = rev.status === 'completed';
              const isInProgress = rev.status === 'in_progress';

              return (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3 hover:border-[#CBD5E1] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-[#94A3B8] font-bold">#{rev.id}</span>
                      <h4 className="text-sm font-bold text-[#0F172A]">{rev.title}</h4>
                      <Badge
                        status={
                          isCompleted
                            ? 'completed'
                            : isInProgress
                            ? 'in_progress'
                            : 'pending'
                        }
                        size="sm"
                      >
                        {isCompleted ? '수정완료' : isInProgress ? '작업진행중' : '접수대기'}
                      </Badge>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium">
                        {rev.category.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8] shrink-0">접수일: {rev.createdAt}</span>
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    {rev.description}
                  </p>

                  {rev.devReply && (
                    <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-start gap-2.5 text-xs">
                      <div className="p-1 rounded-md bg-[#2563EB] text-white shrink-0 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#1E40AF]">퍼블리셔 답변:</span>
                          <span className="text-[10px] text-[#2563EB]">{rev.updatedAt}</span>
                        </div>
                        <p className="text-[#1E3A8A] font-medium">{rev.devReply}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title="홈페이지 수정 요청서 작성"
        subtitle="원활한 반영을 위해 수정이 필요한 페이지 위치와 상세 내용을 작성해주세요."
      >
        <form onSubmit={handleCreateRevision} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              수정 요청 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={revisionTitle}
              onChange={(e) => setRevisionTitle(e.target.value)}
              placeholder="예: 모바일 상단 로고 크기 축소 및 패딩 조정"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">수정 분야</label>
              <select
                value={revisionCategory}
                onChange={(e) => setRevisionCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="layout">레이아웃 / 구조</option>
                <option value="design">디자인 / 색상 / 여백</option>
                <option value="seo_tag">SEO 태그 / 메타데이터</option>
                <option value="speed">로딩 속도 / 이미지 최적화</option>
                <option value="content">문구 및 푸터 정보</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">긴급도</label>
              <select
                value={revisionPriority}
                onChange={(e) => setRevisionPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="low">일반 (1~2일 내 처리)</option>
                <option value="medium">중간 (24시간 내 처리)</option>
                <option value="high">긴급 (오류/깨짐 수정)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              상세 수정 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={revisionDesc}
              onChange={(e) => setRevisionDesc(e.target.value)}
              rows={4}
              placeholder="수정이 필요한 구체적인 URL, 디바이스 환경(모바일/PC), 변경 전/후 내용을 적어주세요."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRevisionModalOpen(false)}>
              취소
            </Button>
            <Button type="submit" variant="primary" size="sm">
              수정요청 접수
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
