import React from 'react';
import { ChartColumn, FileText, Globe, LayoutTemplate, Link2, SearchCheck, Sparkles, Users, Workflow } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { StepFlow } from '../../shared/diagrams';

export const Slide04PipelineOverview: React.FC = () => (
  <SlideFrame
    page={4}
    lesson={1}
    kicker="PIPELINE · 8단계"
    title="한 줄로 이어지는 8단계"
    subtitle="앞에서 막히면 뒤는 비효율입니다"
    icon={Workflow}
  >
    <StepFlow
      steps={[
        { label: '도메인', tone: 'blue', icon: Globe },
        { label: '웹사이트', tone: 'sky', icon: LayoutTemplate },
        { label: '콘텐츠', tone: 'cyan', icon: FileText },
        { label: '색인', tone: 'teal', icon: SearchCheck },
        { label: '백링크', tone: 'emerald', icon: Link2 },
        { label: '유입', tone: 'indigo', icon: Users },
        { label: '측정', tone: 'purple', icon: ChartColumn },
        { label: 'GEO', tone: 'amber', icon: Sparkles },
      ]}
    />
  </SlideFrame>
);
