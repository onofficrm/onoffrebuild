import React from 'react';
import { Blocks, FileText, Globe, LayoutTemplate, Link2, SearchCheck, Sparkles } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { HubSpokes } from '../../shared/diagrams';

export const Slide15PlatformEcosystem: React.FC = () => (
  <SlideFrame
    page={15}
    lesson={1}
    kicker="PLATFORM · 도구"
    title="강의와 도구가 한 흐름입니다"
    subtitle="보고, 실행하고, 기록합니다"
    icon={Blocks}
  >
    <HubSpokes
      hub="실습실"
      hubIcon={Blocks}
      items={[
        { label: '도메인', tone: 'blue', icon: Globe },
        { label: '빌더', tone: 'sky', icon: LayoutTemplate },
        { label: '콘텐츠', tone: 'cyan', icon: FileText },
        { label: '색인', tone: 'teal', icon: SearchCheck },
        { label: '백링크', tone: 'emerald', icon: Link2 },
        { label: '측정·GEO', tone: 'purple', icon: Sparkles },
      ]}
    />
  </SlideFrame>
);
