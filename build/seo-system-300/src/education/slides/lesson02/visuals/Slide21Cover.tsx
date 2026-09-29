import React from 'react';
import { Globe, Scale, ScanSearch, ShieldAlert } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { PointTiles } from '../../shared/diagrams';

export const Slide21Cover: React.FC = () => (
  <SlideFrame
    page={21}
    lesson={2}
    kicker="LECTURE 02 · 도메인"
    title="낙장도메인 실전 분석"
    subtitle="좋음과 위험을 스스로 가립니다"
    icon={Globe}
  >
    <PointTiles
      points={[
        { label: '검증 도구', tone: 'cyan', icon: ScanSearch },
        { label: '위험 점검', tone: 'amber', icon: ShieldAlert },
        { label: '스스로 판단', tone: 'emerald', icon: Scale },
      ]}
    />
  </SlideFrame>
);
