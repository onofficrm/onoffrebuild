import React from 'react';
import { Gauge, Layers, LayoutTemplate, MonitorSmartphone, MousePointerClick } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, PointTiles } from '../../shared/diagrams';

export const Slide06Step02Website: React.FC = () => (
  <SlideFrame
    page={6}
    lesson={1}
    kicker="STEP 02 · 웹사이트"
    title="성과가 나는 사이트를 만듭니다"
    subtitle="구조 · 속도 · 전환이 한 세트입니다"
    icon={LayoutTemplate}
  >
    <div className="w-full">
      <PointTiles
        points={[
          { label: '검색 구조', tone: 'sky', icon: Layers },
          { label: '빠른 로딩', tone: 'cyan', icon: Gauge },
          { label: '문의 동선', tone: 'emerald', icon: MousePointerClick },
        ]}
      />
      <OutcomeBar label="산출물 · 전환 사이트 1개" icon={MonitorSmartphone} />
    </div>
  </SlideFrame>
);
