import React from 'react';
import { AlertOctagon, Compass, Filter, Gavel, History, Link2, Scale, Search, Tag } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { StepFlow } from '../../shared/diagrams';

export const Slide32AnalysisPipeline: React.FC = () => (
  <SlideFrame
    page={32}
    lesson={2}
    kicker="PIPELINE · 검증"
    title="같은 순서로 걸러 냅니다"
    subtitle="치명 사유면 바로 다음 후보"
    icon={Filter}
  >
    <StepFlow
      steps={[
        { label: '후보', tone: 'blue', icon: Search },
        { label: '주제', tone: 'sky', icon: Compass },
        { label: '이력', tone: 'cyan', icon: History },
        { label: '링크', tone: 'teal', icon: Link2 },
        { label: '앵커', tone: 'indigo', icon: Tag },
        { label: '스팸', tone: 'rose', icon: AlertOctagon },
        { label: '비교', tone: 'amber', icon: Scale },
        { label: '판정', tone: 'emerald', icon: Gavel },
      ]}
    />
  </SlideFrame>
);
