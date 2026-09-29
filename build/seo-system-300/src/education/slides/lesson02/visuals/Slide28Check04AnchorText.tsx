import React from 'react';
import { BadgeCheck, Flame, Tag } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide28Check04AnchorText: React.FC = () => (
  <SlideFrame
    page={28}
    lesson={2}
    kicker="CHECK 04 · 앵커"
    title="앵커가 조작을 드러냅니다"
    subtitle="브랜드 중심은 통과, 스팸 중심은 제외"
    icon={Tag}
  >
    <CompareColumns
      columns={[
        { label: '자연 앵커', tone: 'cyan', badge: '통과', icon: BadgeCheck, items: ['브랜드명', 'URL', '일반 문구'] },
        { label: '스팸 앵커', tone: 'rose', badge: '제외', icon: Flame, items: ['도박·대출', '상업 폭주', '무관 키워드'] },
      ]}
    />
  </SlideFrame>
);
