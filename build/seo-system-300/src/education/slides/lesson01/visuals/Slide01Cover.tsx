import React from 'react';
import { ChartColumn, FileText, Globe, LayoutTemplate, Route, Sparkles } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { KeywordRow } from '../../shared/diagrams';

export const Slide01Cover: React.FC = () => (
  <SlideFrame
    page={1}
    lesson={1}
    kicker="LECTURE 01 · 전체 지도"
    title="8단계 실전 프로세스"
    subtitle="인프라에서 AI 인용까지, 하나의 흐름"
    icon={Route}
  >
    <KeywordRow
      words={[
        { label: '도메인', tone: 'blue', icon: Globe },
        { label: '웹사이트', tone: 'sky', icon: LayoutTemplate },
        { label: '콘텐츠', tone: 'cyan', icon: FileText },
        { label: '측정', tone: 'teal', icon: ChartColumn },
        { label: 'GEO', tone: 'purple', icon: Sparkles },
      ]}
    />
  </SlideFrame>
);
