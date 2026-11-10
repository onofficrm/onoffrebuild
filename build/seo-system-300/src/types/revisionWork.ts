export type RevisionTriageState =
  | 'needs_triage'
  | 'waiting_info'
  | 'info_returned'
  | 'ready'
  | 'confirm'
  | 'in_progress'
  | 'done'
  | string;

export type RevisionInfoRequest = {
  id: string;
  label: string;
  hint: string;
  required: boolean;
  status: 'requested' | 'answered' | string;
  answerText: string;
  fileIds: number[];
  createdAt: string;
  answeredAt?: string | null;
};

export type RevisionWorkPackage = {
  assignee: string;
  constraints: string;
  scope: 'page' | 'site' | string;
  readyForAgent: boolean;
};

export type RevisionResultPreview = {
  url: string;
  note: string;
  snapshotFileId?: number;
  snapshotUrl?: string;
  at?: string;
  cwd?: string;
  changedFiles?: string[];
  diffStat?: string;
};

export type RevisionDeployChecklist = {
  ready?: boolean;
  items?: { id: string; ok: boolean; label: string }[];
  changedFiles?: string[];
  cwd?: string;
  confirmUrl?: string;
  diffStat?: string;
};

export type RevisionDeployPlan = {
  ready?: boolean;
  status?: string;
  cwd?: string;
  domain?: string;
  confirmUrl?: string;
  changedFiles?: string[];
  fileCount?: number;
  previewCommand?: string;
  deployCommand?: string;
  /** true/false when CRM can see credentials; null when verify on operator Mac */
  ftpConfigured?: boolean | null;
  ftpScope?: 'local' | 'server' | string;
  ftpPaths?: string[];
  operatorAt?: string;
  workerAlive?: boolean;
  note?: string;
  deployNote?: string;
  queuedAt?: string;
  error?: string;
};

export type RevisionSla = {
  ok?: boolean;
  code?: string;
  label?: string;
  hours?: number;
  ageHours?: number;
};

export const TRIAGE_PRESETS: { label: string; brief: string; constraints: string }[] = [
  {
    label: '문구 교체',
    brief: '요청한 자리의 문구만 교체하세요. 레이아웃·색·버튼은 그대로 두고, PC·모바일 모두 확인하세요.',
    constraints: '다른 섹션 금지. 버튼·링크 유지. 폰트·색 변경 금지.',
  },
  {
    label: '정렬/간격',
    brief: '표시한 영역의 정렬·간격만 고치세요. 콘텐츠 문구는 바꾸지 마세요.',
    constraints: '문구 변경 금지. 인접 섹션 레이아웃 유지.',
  },
  {
    label: '이미지 교체',
    brief: '표시한 이미지를 첨부 파일로 교체하세요. 비율이 다르면 잘리지 않게 맞추세요.',
    constraints: '다른 이미지·문구 건드리지 말 것. alt 텍스트는 유지하거나 짧게 갱신.',
  },
  {
    label: '모바일만',
    brief: '모바일 화면에서만 보이는 문제를 고치세요. 데스크톱 레이아웃은 바꾸지 마세요.',
    constraints: '데스크톱 CSS/레이아웃 변경 금지. 브레이크포인트 밖 영향 최소화.',
  },
];

export type RevisionCustomerProgress = {
  id: string;
  label: string;
  hint: string;
  confirmUrl?: string;
  /** Short list/detail CTA label for the customer's next action */
  cta?: string;
};

export const INFO_REQUEST_PRESETS: { label: string; hint: string }[] = [
  { label: '로고 SVG', hint: '가능하면 투명 배경 SVG. PNG도 됩니다.' },
  { label: '새 문구', hint: '교체할 제목·본문을 그대로 적어 주세요.' },
  { label: '모바일 캡처', hint: '휴대폰에서 해당 화면을 찍어 올려 주세요.' },
  { label: '브랜드 색/폰트', hint: '쓸 색 코드나 글꼴 이름을 알려 주세요.' },
];
