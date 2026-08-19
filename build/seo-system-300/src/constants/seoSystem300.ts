export const WEBSITE_ORDER_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  NEED_MORE_INFO: 'need_more_info',
  MATERIAL_WAITING: 'material_waiting',
  PLANNING: 'planning',
  DESIGN: 'design',
  DEVELOPMENT: 'development',
  INTERNAL_REVIEW: 'internal_review',
  CUSTOMER_REVIEW: 'customer_review',
  REVISION: 'revision',
  COMPLETED: 'completed',
} as const;

export type WebsiteOrderStatus = (typeof WEBSITE_ORDER_STATUS)[keyof typeof WEBSITE_ORDER_STATUS];

export const WEBSITE_ORDER_STATUS_LABEL: Record<string, string> = {
  draft: '작성 중',
  submitted: '제작 요청 완료',
  need_more_info: '추가자료 필요',
  material_waiting: '자료 검토',
  planning: '기획 중',
  design: '제작 중',
  development: '제작 중',
  internal_review: '1차 확인',
  customer_review: '1차 확인',
  revision: '수정 중',
  completed: '제작 완료',
};

export const WEBSITE_PROCESS_STEPS = [
  { id: 1, title: '제작 요청 접수' },
  { id: 2, title: '자료 검토' },
  { id: 3, title: '홈페이지 기획' },
  { id: 4, title: '홈페이지 제작' },
  { id: 5, title: '1차 확인' },
  { id: 6, title: '수정 및 보완' },
  { id: 7, title: '제작 완료' },
] as const;

export const CURRENT_PROJECT_STORAGE_KEY = 'seosys300_current_project_id';

export function isDraftOrderStatus(status: string | undefined | null) {
  return status === WEBSITE_ORDER_STATUS.DRAFT;
}

export function isSubmittedOrderStatus(status: string | undefined | null) {
  return Boolean(status) && status !== WEBSITE_ORDER_STATUS.DRAFT;
}
