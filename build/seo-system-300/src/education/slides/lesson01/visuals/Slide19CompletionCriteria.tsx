import React from 'react';
import { Award, Crosshair, Flag, Workflow } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CheckList } from '../../shared/diagrams';

export const Slide19CompletionCriteria: React.FC = () => (
  <SlideFrame
    page={19}
    lesson={1}
    kicker="DONE · 1강"
    title="무엇을 할지 알면 완료"
    subtitle="설명 · 위치 · 다음 과제"
    icon={Award}
  >
    <CheckList
      items={[
        { label: '8단계 설명', tone: 'cyan', icon: Workflow, badge: 'PASS' },
        { label: '현재 병목', tone: 'teal', icon: Crosshair, badge: 'PASS' },
        { label: '최우선 과제', tone: 'emerald', icon: Flag, badge: 'PASS' },
      ]}
    />
  </SlideFrame>
);
