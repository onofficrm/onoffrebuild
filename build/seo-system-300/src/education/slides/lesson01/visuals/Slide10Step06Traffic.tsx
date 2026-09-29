import React from 'react';
import { Activity, MessageSquare, MousePointerClick, Search, Timer, Users } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, StepFlow } from '../../shared/diagrams';

export const Slide10Step06Traffic: React.FC = () => (
  <SlideFrame
    page={10}
    lesson={1}
    kicker="STEP 06 · 유입"
    title="실제 사용자가 들어와야 합니다"
    subtitle="검색 → 체류 → 탐색 → 문의"
    icon={Users}
  >
    <div className="w-full">
      <StepFlow
        steps={[
          { label: '검색', tone: 'blue', icon: Search },
          { label: '클릭', tone: 'sky', icon: MousePointerClick },
          { label: '체류', tone: 'cyan', icon: Timer },
          { label: '전환', tone: 'emerald', icon: MessageSquare },
        ]}
      />
      <OutcomeBar label="체류와 행동이 있는 유입만 신호" icon={Activity} />
    </div>
  </SlideFrame>
);
