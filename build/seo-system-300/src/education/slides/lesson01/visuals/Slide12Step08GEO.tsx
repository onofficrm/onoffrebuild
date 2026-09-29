import React from 'react';
import { Bot, Search, Sparkles } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CompareColumns } from '../../shared/diagrams';

export const Slide12Step08GEO: React.FC = () => (
  <SlideFrame
    page={12}
    lesson={1}
    kicker="STEP 08 · GEO"
    title="AI가 고르는 출처가 됩니다"
    subtitle="검색 자산을 인용 구조로 확장"
    icon={Sparkles}
  >
    <CompareColumns
      columns={[
        { label: 'SEO', tone: 'cyan', badge: '검색 노출', icon: Search, items: ['색인된 글', '신뢰 링크', '브랜드 사실'] },
        { label: 'GEO', tone: 'purple', badge: 'AI 인용', icon: Bot, items: ['명확한 답', '근거 출처', '엔티티'] },
      ]}
    />
  </SlideFrame>
);
