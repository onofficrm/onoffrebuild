import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutTemplate,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  ExternalLink,
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
  StatusType,
  Project
} from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Tabs } from '../common/Tabs';
import { WebsiteOrderWizard } from './WebsiteOrderWizard';
import { WebsiteRevisionPanel } from './WebsiteRevisionPanel';
import { WebsiteReviewConfirm } from './WebsiteReviewConfirm';
import { MaterialsAddPanel, type MaterialsAppendPayload } from './MaterialsAddPanel';
import type { ApiWebsiteOrder } from '../../services/websiteOrderService';
import type { UploadedFileItem } from './wizard/WizardStep8UploadCenter';
import { isDraftOrderStatus, isSubmittedOrderStatus, WEBSITE_ORDER_STATUS, WEBSITE_ORDER_STATUS_LABEL, WEBSITE_PROCESS_STEPS } from '../../constants/seoSystem300';
import { websitePresence, websitePreviewUrl } from '../../utils/websitePresence';

export interface WebsiteViewProps {
  activeSubTab: WebsiteSubTab;
  setActiveSubTab: (subTab: WebsiteSubTab) => void;
  order: WebsiteOrder;
  project: Project | null;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onCreateProject?: (input: { name: string; domain: string; niche: string }) => Promise<void>;
  onSubmitNewOrder: (newOrder: Partial<WebsiteOrder>) => void;
  liveOrder?: ApiWebsiteOrder | null;
  orders?: ApiWebsiteOrder[];
  draftOrder?: ApiWebsiteOrder | null;
  liveError?: string;
  onRetryLive?: () => void;
  onSaveDraft?: (payload: Record<string, unknown>) => Promise<void>;
  onSubmitLive?: (payload: Record<string, unknown>) => Promise<{ id?: number; orderNo?: string; status?: string } | void>;
  onStartNewOrder?: () => Promise<void>;
  onStartDraft?: () => Promise<void>;
  onAppendMaterials?: (payload: MaterialsAppendPayload & { orderId?: number }) => Promise<void>;
  wizardFiles?: UploadedFileItem[];
  uploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  onUploadFiles?: (categoryId: string, files: FileList, orderId?: number) => void;
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
  project,
  projects = [],
  onSelectProject,
  onCreateProject,
  onSubmitNewOrder,
  liveOrder = null,
  orders = [],
  draftOrder = null,
  liveError = '',
  onRetryLive,
  onSaveDraft,
  onSubmitLive,
  onStartNewOrder,
  onAppendMaterials,
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
  const [quickOrderNo, setQuickOrderNo] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [placingNew, setPlacingNew] = useState(false);
  const [startingNew, setStartingNew] = useState(false);
  const [hubPick, setHubPick] = useState<string | null>(null);
  const [viewOrderId, setViewOrderId] = useState<number | null>(null);
  const userPickedOrder = useRef(false);

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitLive || quickSubmitting) return;
    setQuickSubmitting(true);
    void onSubmitLive({
      siteType: orderSiteType,
      siteName: orderNiche,
      industry: orderNiche,
      businessDescription: orderRequests,
      designStyle: orderTheme,
      currentUrl: orderRefs,
      references: orderRefs ? [{ url: orderRefs, memo: '' }] : [],
      keywords: orderKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      extraRequest: orderRequests,
    })
      .then((saved) => {
        const orderNo = saved?.orderNo || '';
        if (!saved?.id || saved.status !== 'submitted' || !/^WEB-\d{4}-\d{6}$/.test(orderNo)) {
          throw new Error('주문이 저장되지 않았습니다. 다시 제출해주세요.');
        }
        setQuickOrderNo(orderNo);
        setOrderSubmittedSuccess(true);
      })
      .catch(() => {
        setOrderSubmittedSuccess(false);
      })
      .finally(() => setQuickSubmitting(false));
  };

  const handleWizardSubmit = (orderData: Record<string, unknown> | Partial<WebsiteOrder>) => {
    if (onSubmitLive) return onSubmitLive(orderData as Record<string, unknown>);
    onSubmitNewOrder(orderData as Partial<WebsiteOrder>);
  };

  const listedOrders = orders.length > 0 ? orders : liveOrder ? [liveOrder] : [];
  const previewSource =
    listedOrders.find((item) => isSubmittedOrderStatus(item.status)) || liveOrder || null;
  const previewUrl = websitePreviewUrl({
    previewUrl: previewSource?.previewUrl || liveOrder?.previewUrl,
  });
  const hasSubmittedOrder = listedOrders.some((item) => isSubmittedOrderStatus(item.status));
  const presence = useMemo(
    () =>
      websitePresence({
        hasSubmittedOrder,
        hasLivePreview: Boolean(previewUrl),
      }),
    [hasSubmittedOrder, previewUrl]
  );
  const tabs = useMemo(() => {
    if (presence === 'absent') {
      return [{ id: 'order' as WebsiteSubTab, label: '홈페이지 만들기' }];
    }
    if (presence === 'building') {
      return [
        { id: 'status' as WebsiteSubTab, label: '제작현황' },
        { id: 'order' as WebsiteSubTab, label: '추가 주문' },
      ];
    }
    return [
      { id: 'revision' as WebsiteSubTab, label: '수정하기' },
      { id: 'status' as WebsiteSubTab, label: '제작현황' },
      { id: 'order' as WebsiteSubTab, label: '새 홈페이지' },
    ];
  }, [presence]);
  const showHub = activeSubTab === 'order' && !placingNew && presence !== 'absent';
  const composeOrder =
    draftOrder && isDraftOrderStatus(draftOrder.status)
      ? draftOrder
      : listedOrders.find((item) => isDraftOrderStatus(item.status)) ||
        (liveOrder && isDraftOrderStatus(liveOrder.status) ? liveOrder : null);
  const detailOrder =
    (viewOrderId ? listedOrders.find((item) => item.id === viewOrderId) : null) ||
    listedOrders.find((item) => isSubmittedOrderStatus(item.status)) ||
    liveOrder;

  useEffect(() => {
    if (presence === 'absent' && (activeSubTab === 'revision' || activeSubTab === 'status') && !placingNew) {
      setActiveSubTab('order');
      return;
    }
    if (presence === 'building' && activeSubTab === 'revision') {
      setActiveSubTab('status');
      return;
    }
    if (presence === 'present' && activeSubTab === 'order' && !placingNew && !userPickedOrder.current) {
      setActiveSubTab('revision');
    }
  }, [presence, activeSubTab, placingNew, setActiveSubTab]);

  const startNewOrder = () => {
    if (startingNew) return;
    setStartingNew(true);
    const open = () => {
      setHubPick(null);
      setPlacingNew(true);
      setOrderMode('wizard');
    };
    if (!onStartNewOrder) {
      open();
      setStartingNew(false);
      return;
    }
    void onStartNewOrder()
      .then(open)
      .finally(() => setStartingNew(false));
  };

  const wizardValues = (source: ApiWebsiteOrder | null) =>
    source
      ? {
          wizardStep: source.wizardStep,
          siteType: source.siteType,
          purposes: source.purposes,
          industry: source.industry,
          siteName: source.siteName,
          brandName: source.brandName,
          phone: source.phone,
          email: source.email,
          region: source.region,
          businessDescription: source.businessDescription,
          currentUrl: source.currentUrl,
          designStyle: source.designStyle,
          primaryColor: source.primaryColor,
          customColor: source.customColor,
          contacts: source.contacts || {},
          extraRequest: source.extraRequest || '',
          businessInfoNote: source.businessInfoNote || '',
          boardRequests: source.boardRequests || [],
          programRequests: source.programRequests || [],
          accentColor: source.accentColor || '',
          orderNo: source.orderNo || '',
          status: source.status,
          menus: source.menus.map((m) => ({
            id: String(m.id),
            title: m.label,
            isSubItem: m.parentId > 0
          })),
          features: source.features.map((f) => f.key),
          references: source.references.map((r) => r.url)
        }
      : null;

  return (
    <div className="space-y-6">
      {!project && activeSubTab !== 'revision' ? (
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
            <p className="text-xs text-slate-500">진행 중인 주문과 별도로 신규 주문을 추가할 수 있습니다.</p>
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
            {presence === 'present' ? '내 홈페이지' : presence === 'building' ? '홈페이지 제작 중' : '홈페이지 만들기'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            {presence === 'present'
              ? '고칠 자리를 찍고 원하는 내용만 남겨 주세요. 온오프가 읽고 정리한 뒤에 작업합니다.'
              : presence === 'building'
                ? '초안이 올라오면 화면을 보고 수정 요청할 수 있습니다. 지금은 제작 현황과 자료를 확인하세요.'
                : '아직 보여 줄 화면이 없습니다. 종류와 자료를 남기면 온오프가 읽고 초안을 만듭니다.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {activeSubTab === 'order' && !placingNew && presence !== 'present' ? (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={startNewOrder}
              disabled={startingNew}
            >
              {startingNew ? '준비 중' : presence === 'building' ? '추가 주문' : '기획 시작'}
            </Button>
          ) : null}
          {activeSubTab === 'order' && placingNew ? (
            <Button variant="outline" size="md" onClick={() => setPlacingNew(false)}>
              목록으로
            </Button>
          ) : null}
          {activeSubTab === 'order' && placingNew && (
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

          {activeSubTab === 'status' && presence !== 'present' ? (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                userPickedOrder.current = true;
                setActiveSubTab('order');
                startNewOrder();
              }}
            >
              추가 주문
            </Button>
          ) : null}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      {tabs.length > 1 ? (
        <Tabs
          tabs={tabs}
          activeTab={activeSubTab}
          onChange={(tab) => {
            userPickedOrder.current = tab === 'order';
            if (tab !== 'order') setPlacingNew(false);
            setActiveSubTab(tab);
          }}
          variant="pills"
        />
      ) : null}

      {presence === 'absent' && activeSubTab === 'order' && !placingNew ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="text-base font-black text-[#0F172A]">어떤 홈페이지를 만들까요?</h2>
            <p className="text-xs text-[#64748B] mt-1">
              미리보기와 펜은 초안이 올라온 뒤에 열립니다. 지금은 기획과 자료만 남기면 됩니다.
            </p>
          </div>
          {composeOrder ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">작성 중인 기획이 있습니다.</p>
              <Button size="sm" variant="primary" onClick={() => setPlacingNew(true)}>
                이어서 작성
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="md" onClick={startNewOrder} disabled={startingNew}>
              {startingNew ? '준비 중' : '기획 시작'}
            </Button>
          )}
        </div>
      ) : null}

      {showHub ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-black text-[#0F172A]">주문 목록</h2>
            <p className="text-xs text-[#64748B] mt-0.5">주문을 누르면 아래에 상세가 열립니다.</p>
          </div>
          {listedOrders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">아직 주문이 없습니다.</p>
          ) : null}
          <ul className="divide-y divide-[#E2E8F0]">
            {listedOrders.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isDraftOrderStatus(item.status)) {
                      setPlacingNew(true);
                      setOrderMode('wizard');
                      return;
                    }
                    setViewOrderId(item.id);
                    setHubPick(`order:${item.id}`);
                  }}
                  className={`w-full text-left px-5 py-4 hover:bg-[#F8FAFC] ${hubPick === `order:${item.id}` ? 'bg-[#EFF6FF]' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#2563EB]">주문</p>
                      <p className="text-sm font-bold text-[#0F172A] truncate">
                        {item.orderNo || item.siteName || '새 홈페이지 주문서'}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">{item.siteName || project?.name || ''}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#475569] shrink-0">
                      {WEBSITE_ORDER_STATUS_LABEL[item.status] || item.status}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* Sub-Tab 1: 제작현황 (Status & Timeline) */}
      {/* ========================================================================= */}
      {(activeSubTab === 'status' || (showHub && typeof hubPick === 'string' && hubPick.startsWith('order:'))) && (
        <div className="space-y-6">
          {/* Main Status Overview Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-300">
                    주문번호: {detailOrder?.orderNo || detailOrder?.id || order.id}
                  </span>
                  <Badge variant="green" size="sm" dot>
                    {detailOrder
                      ? WEBSITE_ORDER_STATUS_LABEL[detailOrder.status] || detailOrder.status
                      : order.currentStageName}
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {detailOrder ? detailOrder.siteName || detailOrder.projectName || project?.name : order.projectName}
                </h2>
                <p className="text-xs text-slate-300">
                  {detailOrder
                    ? `자료 준비율 ${detailOrder.materialsReadiness ?? 0}% · 파일 ${(detailOrder.files || []).length}개`
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
                {presence === 'present' ? (
                  <Button
                    variant="white"
                    size="sm"
                    onClick={() => setActiveSubTab('revision')}
                  >
                    수정하기
                  </Button>
                ) : presence === 'building' ? (
                  <p className="text-xs text-slate-300">초안이 올라오면 여기서 화면을 보고 수정할 수 있습니다.</p>
                ) : null}
              </div>
            </div>

            {/* Overall Production Progress */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">제작 공정률</span>
                <span className="text-emerald-400 font-extrabold">
                  {(detailOrder ? detailOrder.progress : order.progress)}% (
                  {detailOrder
                    ? WEBSITE_ORDER_STATUS_LABEL[detailOrder.status] || detailOrder.status
                    : order.status === 'delivered'
                    ? '납품 완료'
                    : '공정 진행중'}
                  )
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${detailOrder ? detailOrder.progress : order.progress}%` }}
                />
              </div>
            </div>
          </div>

          {detailOrder && detailOrder.status === WEBSITE_ORDER_STATUS.CUSTOMER_REVIEW ? (
            <WebsiteReviewConfirm orderId={Number(detailOrder.id)} onAnswered={onRetryLive} />
          ) : null}

          {detailOrder?.customerUpdates && detailOrder.customerUpdates.length > 0 ? (
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-3">
              <h3 className="text-sm font-bold text-[#0F172A]">진행 내역</h3>
              <p className="text-xs text-[#64748B]">담당자가 처리한 작업과 진행 안내입니다.</p>
              <ol className="space-y-2">
                {[...detailOrder.customerUpdates].reverse().map((update) => (
                  <li key={update.id || update.createdAt} className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3">
                    <div className="text-[11px] text-[#64748B]">{update.createdAt || '피드백'}</div>
                    <p className="mt-1 text-sm text-[#0F172A] whitespace-pre-wrap">{update.message}</p>
                    {update.files && update.files.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {update.files.map((file) => (
                          <a
                            key={file.id}
                            href={`/plugin/seo-system-300/api/website/download.php?id=${file.id}`}
                            className="rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold text-[#2563EB]"
                          >
                            {file.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {/* 5-Stage Milestone Timeline Visualizer */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A]">제작 공정 타임라인 및 마일스톤</h3>
              <span className="text-xs text-[#64748B]">실제 상태 기록 기준</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {WEBSITE_PROCESS_STEPS.map((ms) => {
                const current = detailOrder?.processStep || 0;
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

          {detailOrder &&
          onAppendMaterials &&
          isSubmittedOrderStatus(detailOrder.status) &&
          detailOrder.status !== WEBSITE_ORDER_STATUS.COMPLETED &&
          detailOrder.status !== 'cancelled' ? (
            <MaterialsAddPanel
              order={detailOrder}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              saveError={saveError}
              onAppend={(payload) => onAppendMaterials({ ...payload, orderId: detailOrder.id })}
              onUploadFiles={
                onUploadFiles
                  ? (categoryId, files) => onUploadFiles(categoryId, files, detailOrder.id)
                  : undefined
              }
            />
          ) : null}

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
      {activeSubTab === 'order' && placingNew && (
        <div>
          {orderMode === 'wizard' ? (
            <WebsiteOrderWizard
              key={composeOrder ? `order-${composeOrder.id}` : 'order-new'}
              onSubmitOrder={handleWizardSubmit}
              onCancel={() => setPlacingNew(false)}
              onSaveDraft={onSaveDraft}
              saveError={saveError}
              initialValues={wizardValues(composeOrder)}
              files={wizardFiles}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              onUploadFiles={
                onUploadFiles
                  ? (categoryId, files) => onUploadFiles(categoryId, files, composeOrder?.id)
                  : undefined
              }
              onDeleteFile={onDeleteFile}
              onUpdateFileMemo={onUpdateFileMemo}
              onReplaceFile={onReplaceFile}
              saveStatus={saveStatus}
            />
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
              <div className="border-b border-[#F1F5F9] pb-4">
                <h2 className="text-base font-bold text-[#0F172A]">SEO 전용 웹사이트 직접 주문서</h2>
                <p className="text-xs text-[#64748B]">
                  직접 세부 기획 사항을 입력하여 사이트 제작을 요청합니다.
                </p>
                <p className="mt-3 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 text-xs text-sky-900 leading-relaxed">
                  온오프가 홈페이지를 제작해 드리면, 납품 후 매년 50만 포인트를 충전해 주셔야 합니다.
                  이 금액은 연 유지보수비가 아니고, 충전한 포인트로 콘텐츠·백링크·트래픽 등 서비스 요금을 결제할 수 있습니다.
                </p>
              </div>

              {orderSubmittedSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">주문서가 성공적으로 접수되었습니다!</h3>
                  <p className="text-sm font-bold text-[#0F172A]">주문번호 {quickOrderNo}</p>
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

                  {saveError ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                      {saveError}
                    </p>
                  ) : null}

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
                    <Button type="submit" variant="primary" size="md" disabled={quickSubmitting} rightIcon={<Send className="w-4 h-4" />}>
                      {quickSubmitting ? '접수 저장 중' : '홈페이지 주문서 접수하기'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'revision' && presence === 'present' ? (
        <WebsiteRevisionPanel
          projectId={project ? Number(project.id) : null}
          orderId={liveOrder?.id || previewSource?.id || null}
          projects={projects}
          onSelectProject={onSelectProject || (() => undefined)}
          onCreateProject={onCreateProject || (async () => undefined)}
          onRegisterHomepage={() => {
            userPickedOrder.current = true;
            setPlacingNew(true);
            setActiveSubTab('order');
          }}
          presence={presence}
          previewUrl={previewUrl}
        />
      ) : null}
    </div>
  );
};
