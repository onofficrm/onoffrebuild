import React from 'react';
import { BadgeCheck, FilePen, FileText, Network, Search } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, PointTiles } from '../../shared/diagrams';

export const Slide07Step03Content: React.FC = () => (
  <SlideFrame
    page={7}
    lesson={1}
    kicker="STEP 03 · 콘텐츠"
    title="질문에 답하는 글을 만듭니다"
    subtitle="의도 · 구조 · 연결이 자산이 됩니다"
    icon={FileText}
  >
    <div className="w-full">
      <PointTiles
        points={[
          { label: '검색 의도', tone: 'blue', icon: Search },
          { label: '완결 구조', tone: 'cyan', icon: BadgeCheck },
          { label: '주제 연결', tone: 'teal', icon: Network },
        ]}
      />
      <OutcomeBar label="산출물 · 완결형 글 1편" icon={FilePen} />
    </div>
  </SlideFrame>
);
