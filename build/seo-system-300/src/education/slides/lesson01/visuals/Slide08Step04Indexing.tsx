import React from 'react';
import { Bug, Database, Map, SearchCheck, Send } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, StepFlow } from '../../shared/diagrams';

export const Slide08Step04Indexing: React.FC = () => (
  <SlideFrame
    page={8}
    lesson={1}
    kicker="STEP 04 · 색인"
    title="써야 검색되는 것이 아닙니다"
    subtitle="발행 → 크롤 → 색인 → 노출"
    icon={SearchCheck}
  >
    <div className="w-full">
      <StepFlow
        steps={[
          { label: '발행', tone: 'blue', icon: Send },
          { label: '사이트맵', tone: 'sky', icon: Map },
          { label: '크롤링', tone: 'cyan', icon: Bug },
          { label: '색인', tone: 'teal', icon: Database },
        ]}
      />
      <OutcomeBar label="GSC URL 검사로 색인 확인" icon={SearchCheck} />
    </div>
  </SlideFrame>
);
