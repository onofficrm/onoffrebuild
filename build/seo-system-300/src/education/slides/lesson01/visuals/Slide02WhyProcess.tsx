import React from 'react';
import { Unplug, Workflow } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide02WhyProcess: React.FC = () => (
  <SlideFrame
    page={2}
    lesson={1}
    kicker="SYSTEM · 연결"
    title="프로세스가 먼저입니다"
    subtitle="끊긴 작업은 성과가 0에 가깝습니다"
    icon={Workflow}
  >
    <CompareColumns
      columns={[
        { label: '파편 작업', tone: 'rose', badge: '단절', icon: Unplug, items: ['도메인만', '글만 양산', '링크만 구매'] },
        { label: '연결 파이프', tone: 'cyan', badge: '흐름', icon: Workflow, items: ['앞단계 준비', '병목 확인', '다음 실행'] },
      ]}
    />
  </SlideFrame>
);
