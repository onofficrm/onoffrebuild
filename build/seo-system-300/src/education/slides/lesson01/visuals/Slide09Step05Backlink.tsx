import React from 'react';
import { Link2, Link2Off, Newspaper } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide09Step05Backlink: React.FC = () => (
  <SlideFrame
    page={9}
    lesson={1}
    kicker="STEP 05 · 백링크"
    title="추천은 남이 해 줍니다"
    subtitle="개수보다 출처와 문맥입니다"
    icon={Link2}
  >
    <CompareColumns
      columns={[
        { label: '대량 링크', tone: 'rose', badge: '위험', icon: Link2Off, items: ['자동 생성', '무관 출처', '스팸 신호'] },
        { label: '신뢰 인용', tone: 'teal', badge: '신호', icon: Newspaper, items: ['관련 매체', '자연 문맥', '공공 인용'] },
      ]}
    />
  </SlideFrame>
);
