import React from 'react';
import { Landmark, Link2, Link2Off } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide27Check03Backlinks: React.FC = () => (
  <SlideFrame
    page={27}
    lesson={2}
    kicker="CHECK 03 · 링크"
    title="링크는 양보다 출처"
    subtitle="신뢰 네트워크는 통과, 조작은 제외"
    icon={Link2}
  >
    <CompareColumns
      columns={[
        { label: '신뢰 네트워크', tone: 'teal', badge: '통과', icon: Landmark, items: ['공공·언론', '관련 업계', '자연 인용'] },
        { label: '조작 네트워크', tone: 'rose', badge: '제외', icon: Link2Off, items: ['자동 생성', '무관 급증', '유해 출처'] },
      ]}
    />
  </SlideFrame>
);
