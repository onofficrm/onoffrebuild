import React from 'react';
import { BadgeCheck, ChartColumn, Eye, MousePointerClick, Timer } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { Funnel } from '../../shared/diagrams';

export const Slide11Step07Analytics: React.FC = () => (
  <SlideFrame
    page={11}
    lesson={1}
    kicker="STEP 07 · 측정"
    title="느낌이 아니라 숫자입니다"
    subtitle="가장 크게 떨어진 구간이 다음 작업"
    icon={ChartColumn}
  >
    <Funnel
      layers={[
        { label: '노출', tone: 'blue', icon: Eye },
        { label: '클릭', tone: 'sky', icon: MousePointerClick },
        { label: '체류', tone: 'cyan', icon: Timer },
        { label: '전환', tone: 'emerald', icon: BadgeCheck },
      ]}
    />
  </SlideFrame>
);
