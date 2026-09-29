import React from 'react';
import { AlertOctagon, ClipboardPen, History, LayoutDashboard, Link2, Search, Tag } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, PointTiles } from '../../shared/diagrams';

export const Slide31ToolDashboard: React.FC = () => (
  <SlideFrame
    page={31}
    lesson={2}
    kicker="TOOL · 5구역"
    title="화면은 순서로 읽습니다"
    subtitle="1차 필터 다음, 사람이 최종"
    icon={LayoutDashboard}
  >
    <div className="w-full">
      <PointTiles
        points={[
          { label: '기본 정보', tone: 'blue', icon: Search },
          { label: '운영 이력', tone: 'sky', icon: History },
          { label: '링크 품질', tone: 'cyan', icon: Link2 },
          { label: '앵커 분포', tone: 'teal', icon: Tag },
          { label: '리스크', tone: 'rose', icon: AlertOctagon },
        ]}
      />
      <OutcomeBar label="도구 분류와 다른 이유를 기록" icon={ClipboardPen} />
    </div>
  </SlideFrame>
);
