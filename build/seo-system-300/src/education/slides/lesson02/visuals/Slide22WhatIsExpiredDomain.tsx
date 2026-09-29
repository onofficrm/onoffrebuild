import React from 'react';
import { Clock, Globe, Hourglass, RefreshCw, Trash2 } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { StepFlow } from '../../shared/diagrams';

export const Slide22WhatIsExpiredDomain: React.FC = () => (
  <SlideFrame
    page={22}
    lesson={2}
    kicker="DEFINE · 정의"
    title="만료 후 다시 등록되는 이름"
    subtitle="운영 → 만료 → 삭제 → 재등록"
    icon={Hourglass}
  >
    <StepFlow
      steps={[
        { label: '운영', tone: 'blue', icon: Globe },
        { label: '만료', tone: 'amber', icon: Clock },
        { label: '삭제', tone: 'rose', icon: Trash2 },
        { label: '재등록', tone: 'emerald', icon: RefreshCw },
      ]}
    />
  </SlideFrame>
);
