import React from 'react';
import { Globe, History, Link2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, PointTiles } from '../../shared/diagrams';

export const Slide05Step01Domain: React.FC = () => (
  <SlideFrame
    page={5}
    lesson={1}
    kicker="STEP 01 · 도메인"
    title="좋은 출발점을 고릅니다"
    subtitle="이력 · 링크 · 위험을 함께 봅니다"
    icon={Globe}
  >
    <div className="w-full">
      <PointTiles
        points={[
          { label: '과거 이력', tone: 'blue', icon: History },
          { label: '권위 링크', tone: 'teal', icon: Link2 },
          { label: '위험 검증', tone: 'rose', icon: ShieldAlert },
        ]}
      />
      <OutcomeBar label="산출물 · 안전 도메인 1개" icon={ShieldCheck} />
    </div>
  </SlideFrame>
);
