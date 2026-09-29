import React from 'react';
import { ChartColumn, FileText, FolderCheck, Globe, LayoutTemplate } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { PointTiles } from '../../shared/diagrams';

export const Slide17ProjectOutcomes: React.FC = () => (
  <SlideFrame
    page={17}
    lesson={1}
    kicker="ASSETS · 자산"
    title="만든 것이 프로젝트에 남습니다"
    subtitle="도메인부터 측정 데이터까지"
    icon={FolderCheck}
  >
    <PointTiles
      points={[
        { label: '도메인', tone: 'blue', icon: Globe },
        { label: '사이트', tone: 'sky', icon: LayoutTemplate },
        { label: '콘텐츠', tone: 'cyan', icon: FileText },
        { label: '측정 데이터', tone: 'purple', icon: ChartColumn },
      ]}
    />
  </SlideFrame>
);
