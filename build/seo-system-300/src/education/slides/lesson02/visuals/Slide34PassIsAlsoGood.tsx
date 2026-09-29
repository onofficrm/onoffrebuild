import React from 'react';
import { Filter, History, Search, ShieldCheck, Sprout } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { Funnel, OutcomeBar } from '../../shared/diagrams';

export const Slide34PassIsAlsoGood: React.FC = () => (
  <SlideFrame
    page={34}
    lesson={2}
    kicker="PASS · 선별"
    title="거르는 것도 실력입니다"
    subtitle="애매하면 사지 않고 신규를 봅니다"
    icon={Filter}
  >
    <div className="w-full">
      <Funnel
        layers={[
          { label: '다수 후보', tone: 'blue', icon: Search },
          { label: '지표 필터', tone: 'sky', icon: Filter },
          { label: '이력 검증', tone: 'cyan', icon: History },
          { label: '안전 후보만', tone: 'emerald', icon: ShieldCheck },
        ]}
      />
      <OutcomeBar label="애매하면 PASS → 신규" icon={Sprout} />
    </div>
  </SlideFrame>
);
