import React from 'react';
import { Ban, Copy, Flame, ScanSearch, ShieldAlert, Shuffle, TrendingUp } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, PointTiles } from '../../shared/diagrams';

export const Slide29Check05SpamSignals: React.FC = () => (
  <SlideFrame
    page={29}
    lesson={2}
    kicker="CHECK 05 · 스팸"
    title="레드 플래그 5"
    subtitle="하나라도 보이면 멈추고 검증"
    icon={ShieldAlert}
  >
    <div className="w-full">
      <PointTiles
        points={[
          { label: '도박·성인', tone: 'rose', icon: Flame },
          { label: '문서 복제', tone: 'amber', icon: Copy },
          { label: '링크 급증', tone: 'rose', icon: TrendingUp },
          { label: '주제 변조', tone: 'amber', icon: Shuffle },
          { label: '상표·이동', tone: 'rose', icon: Ban },
        ]}
      />
      <OutcomeBar label="탐지 → 검증 → 보류 또는 제외" icon={ScanSearch} />
    </div>
  </SlideFrame>
);
