import React from 'react';
import { Gavel, Handshake, Siren } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide30ExpiredDomainAbuse: React.FC = () => (
  <SlideFrame
    page={30}
    lesson={2}
    kicker="POLICY · 사용"
    title="재등록 자체가 위반은 아닙니다"
    subtitle="목적과 사용 방식이 갈립니다"
    icon={Gavel}
  >
    <CompareColumns
      columns={[
        { label: '정상 활용', tone: 'emerald', badge: '사용자 가치', icon: Handshake, items: ['주제 연속', '정식 서비스', '장기 운영'] },
        { label: '정책 악용', tone: 'rose', badge: '평판 편취', icon: Siren, items: ['무관 전환', '순위만 노림', '가치 없음'] },
      ]}
    />
  </SlideFrame>
);
