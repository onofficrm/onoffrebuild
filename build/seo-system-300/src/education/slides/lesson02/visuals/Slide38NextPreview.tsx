import React from 'react';
import { ChartColumn, Hammer, Rocket, Scale, Workflow } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { KeywordRow } from '../../shared/diagrams';

export const Slide38NextPreview: React.FC = () => (
  <SlideFrame
    page={38}
    lesson={2}
    kicker="COMPLETE · 기초"
    title="기초 과정이 끝났습니다"
    subtitle="이제 실행하고 측정합니다"
    icon={Rocket}
  >
    <KeywordRow
      words={[
        { label: '프로세스', tone: 'blue', icon: Workflow },
        { label: '도메인 판단', tone: 'cyan', icon: Scale },
        { label: '실행', tone: 'teal', icon: Hammer },
        { label: '측정', tone: 'purple', icon: ChartColumn },
      ]}
    />
  </SlideFrame>
);
