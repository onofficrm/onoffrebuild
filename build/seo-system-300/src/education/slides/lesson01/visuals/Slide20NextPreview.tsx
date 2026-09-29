import React from 'react';
import { ArrowRightCircle, Ban, Globe, History } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { PointTiles } from '../../shared/diagrams';

export const Slide20NextPreview: React.FC = () => (
  <SlideFrame
    page={20}
    lesson={1}
    kicker="NEXT · 2강"
    title="다음: 출발점 고르기"
    subtitle="우대 신호와 스팸을 구분합니다"
    icon={ArrowRightCircle}
  >
    <PointTiles
      points={[
        { label: '정상 이력', tone: 'blue', icon: History },
        { label: '스팸 컷', tone: 'rose', icon: Ban },
        { label: '도메인 1개', tone: 'emerald', icon: Globe },
      ]}
    />
  </SlideFrame>
);
