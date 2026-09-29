import React from 'react';
import { FolderCheck, GraduationCap, Hammer, Play, Rocket, ScanSearch, Target } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { StepFlow } from '../../shared/diagrams';

export const Slide16StudentJourney: React.FC = () => (
  <SlideFrame
    page={16}
    lesson={1}
    kicker="JOURNEY · 수강"
    title="1강에 자산 1개"
    subtitle="보기 전에 결과물을 남깁니다"
    icon={GraduationCap}
  >
    <StepFlow
      steps={[
        { label: '시청', tone: 'blue', icon: Play },
        { label: '미션', tone: 'sky', icon: Target },
        { label: '실행', tone: 'cyan', icon: Hammer },
        { label: '검증', tone: 'teal', icon: ScanSearch },
        { label: '기록', tone: 'indigo', icon: FolderCheck },
        { label: '다음', tone: 'purple', icon: Rocket },
      ]}
    />
  </SlideFrame>
);
