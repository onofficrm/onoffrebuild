import React from 'react';
import { ChartColumn, Play, RefreshCw, RotateCw, TrendingUp, Wrench } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CycleLoop } from '../../shared/diagrams';

export const Slide14FlywheelLoop: React.FC = () => (
  <SlideFrame
    page={14}
    lesson={1}
    kicker="FLYWHEEL · 반복"
    title="8단계는 직선이 아닙니다"
    subtitle="돌릴수록 근거가 쌓입니다"
    icon={RefreshCw}
  >
    <CycleLoop
      center="플라이휠"
      centerIcon={TrendingUp}
      steps={[
        { label: '실행', tone: 'blue', icon: Play },
        { label: '측정', tone: 'cyan', icon: ChartColumn },
        { label: '개선', tone: 'teal', icon: Wrench },
        { label: '재실행', tone: 'purple', icon: RotateCw },
      ]}
    />
  </SlideFrame>
);
