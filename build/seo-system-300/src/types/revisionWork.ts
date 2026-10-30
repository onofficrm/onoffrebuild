export type RevisionTriageState =
  | 'needs_triage'
  | 'waiting_info'
  | 'info_returned'
  | 'ready'
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
};

export const INFO_REQUEST_PRESETS: { label: string; hint: string }[] = [
  { label: '로고 SVG', hint: '가능하면 투명 배경 SVG. PNG도 됩니다.' },
  { label: '새 문구', hint: '교체할 제목·본문을 그대로 적어 주세요.' },
  { label: '모바일 캡처', hint: '휴대폰에서 해당 화면을 찍어 올려 주세요.' },
  { label: '브랜드 색/폰트', hint: '쓸 색 코드나 글꼴 이름을 알려 주세요.' },
];
