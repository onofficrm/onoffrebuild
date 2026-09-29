import React from 'react';
import { Scale } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide33CompareThreeCandidates: React.FC = () => (
  <SlideFrame
    page={33}
    lesson={2}
    kicker="COMPARE · 3후보"
    title="세 후보를 한눈에 판정"
    subtitle="A 활용 · B 제외 · C 보류"
    icon={Scale}
  >
    <CompareColumns
      columns={[
        { label: 'A 활용', tone: 'emerald', badge: '추천', items: ['주제 일치', '정상 이력', '공공·언론'] },
        { label: 'B 제외', tone: 'rose', badge: '탈락', items: ['주제 단절', '스팸 이력', '도박 앵커'] },
        { label: 'C 보류', tone: 'amber', badge: '재검토', items: ['주제 보통', '공백 2년', '추가 확인'] },
      ]}
    />
  </SlideFrame>
);
