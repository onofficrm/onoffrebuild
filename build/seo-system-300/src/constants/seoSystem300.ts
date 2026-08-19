export const WEBSITE_ORDER_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
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
  draft: '작성중',
  submitted: '접수완료',
  material_waiting: '자료대기',
  planning: '기획',
  design: '디자인',
  development: '개발',
  internal_review: '내부검수',
  customer_review: '고객검수',
  revision: '수정중',
  completed: '완료',
};

export const CURRENT_PROJECT_STORAGE_KEY = 'seosys300_current_project_id';

export function isDraftOrderStatus(status: string | undefined | null) {
  return status === WEBSITE_ORDER_STATUS.DRAFT;
}

export function isSubmittedOrderStatus(status: string | undefined | null) {
  return Boolean(status) && status !== WEBSITE_ORDER_STATUS.DRAFT;
}
