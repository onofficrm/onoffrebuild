import React from 'react';
import { AlertOctagon, Award, Compass, History, Link2, Radar, ShieldCheck, Tag } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { HubSpokes } from '../../shared/diagrams';

export const Slide24HolisticEvaluation: React.FC = () => (
  <SlideFrame
    page={24}
    lesson={2}
    kicker="MATRIX · 6축"
    title="품질은 종합 판정입니다"
    subtitle="한 점수만으로 사지 않습니다"
    icon={Radar}
  >
    <HubSpokes
      hub="종합 품질"
      hubIcon={Award}
      items={[
        { label: '운영 이력', tone: 'blue', icon: History },
        { label: '주제 맥락', tone: 'cyan', icon: Compass },
        { label: '링크 품질', tone: 'teal', icon: Link2 },
        { label: '앵커 분포', tone: 'indigo', icon: Tag },
        { label: '스팸 신호', tone: 'rose', icon: AlertOctagon },
        { label: '상표 리스크', tone: 'amber', icon: ShieldCheck },
      ]}
    />
  </SlideFrame>
);
