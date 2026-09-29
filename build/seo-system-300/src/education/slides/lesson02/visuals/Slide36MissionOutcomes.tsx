import React from 'react';
import { FileCheck, FileX, ListChecks, Package, Table2 } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { PointTiles } from '../../shared/diagrams';

export const Slide36MissionOutcomes: React.FC = () => (
  <SlideFrame
    page={36}
    lesson={2}
    kicker="OUTPUT · 결과"
    title="손에 남는 4가지"
    subtitle="근거 있는 매수 또는 패스가 수료"
    icon={Package}
  >
    <PointTiles
      points={[
        { label: '후보 3개', tone: 'blue', icon: ListChecks },
        { label: '분석표', tone: 'cyan', icon: Table2 },
        { label: '제외 근거', tone: 'amber', icon: FileX },
        { label: '결정 보고', tone: 'emerald', icon: FileCheck },
      ]}
    />
  </SlideFrame>
);
