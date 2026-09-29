import React from 'react';
import { Eye, Hammer, RefreshCw, ScanSearch, Target, Trophy } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CycleLoop } from '../../shared/diagrams';

export const Slide03Philosophy: React.FC = () => (
  <SlideFrame
    page={3}
    lesson={1}
    kicker="ACTION · 실행"
    title="결과물이 있어야 수료"
    subtitle="듣기만으로는 아무것도 남지 않습니다"
    icon={Target}
  >
    <CycleLoop
      center="결과물 = 수료"
      centerIcon={Trophy}
      steps={[
        { label: '이해', tone: 'blue', icon: Eye },
        { label: '실행', tone: 'cyan', icon: Hammer },
        { label: '검증', tone: 'teal', icon: ScanSearch },
        { label: '개선', tone: 'purple', icon: RefreshCw },
      ]}
    />
  </SlideFrame>
);
