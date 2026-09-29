import React from 'react';
import { Compass } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide25Check01Relevance: React.FC = () => (
  <SlideFrame
    page={25}
    lesson={2}
    kicker="CHECK 01 · 주제"
    title="과거 주제가 먼저입니다"
    subtitle="글자보다 업종의 연결"
    icon={Compass}
  >
    <CompareColumns
      columns={[
        { label: '주제 일치', tone: 'emerald', badge: '채택 후보', items: ['골프 리뷰', '골프 레슨', '맥락 승계'] },
        { label: '주제 단절', tone: 'rose', badge: '즉시 기각', items: ['중고차 매매', '피부과 계획', '기대 불일치'] },
      ]}
    />
  </SlideFrame>
);
