import React from 'react';
import { Construction, Crosshair, MapPin, Rocket } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CheckList } from '../../shared/diagrams';

export const Slide18Lesson1Mission: React.FC = () => (
  <SlideFrame
    page={18}
    lesson={1}
    kicker="MISSION · 1강"
    title="지금 위치를 찾습니다"
    subtitle="위치 · 병목 · 다음 행동 하나"
    icon={Crosshair}
  >
    <CheckList
      items={[
        { label: '현재 단계', tone: 'blue', icon: MapPin, badge: '01~08' },
        { label: '최대 병목', tone: 'amber', icon: Construction, badge: '1개' },
        { label: '이번 주 1액션', tone: 'cyan', icon: Rocket, badge: '1개' },
      ]}
    />
  </SlideFrame>
);
