import React from 'react';
import { Bot, FileText, Globe, Layers } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { LayerStack } from '../../shared/diagrams';

export const Slide13SEOAndGEO: React.FC = () => (
  <SlideFrame
    page={13}
    lesson={1}
    kicker="SEO → GEO"
    title="SEO 위에 GEO가 올라갑니다"
    subtitle="자산이 없으면 인용할 근거가 없습니다"
    icon={Layers}
  >
    <LayerStack
      layers={[
        { label: 'GEO · AI 인용', tone: 'purple', icon: Bot, badge: '답변 출처' },
        { label: '콘텐츠 · 색인', tone: 'cyan', icon: FileText, badge: '사실 자산' },
        { label: '도메인 · 사이트', tone: 'blue', icon: Globe, badge: '기초 체력' },
      ]}
    />
  </SlideFrame>
);
