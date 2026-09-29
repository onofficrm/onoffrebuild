import React from 'react';
import { History, Scale, Sprout } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide23WhyAnalyze: React.FC = () => (
  <SlideFrame
    page={23}
    lesson={2}
    kicker="WHY · 비교"
    title="신규와 낙장은 출발이 다릅니다"
    subtitle="이력은 가능성일 뿐, 결과는 비보장"
    icon={Scale}
  >
    <CompareColumns
      columns={[
        { label: '신규 도메인', tone: 'rose', badge: '0에서 시작', icon: Sprout, items: ['이력 없음', '색인에 시간', '링크 0'] },
        { label: '검증된 낙장', tone: 'emerald', badge: '가능성', icon: History, items: ['과거 신호', '상대적 출발', '공공·언론 링크'] },
      ]}
    />
  </SlideFrame>
);
