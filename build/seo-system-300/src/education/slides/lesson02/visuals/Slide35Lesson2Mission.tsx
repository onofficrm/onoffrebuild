import React from 'react';
import { AlertOctagon, ClipboardCheck, Gavel, History, Link2, Tag } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CheckList } from '../../shared/diagrams';

export const Slide35Lesson2Mission: React.FC = () => (
  <SlideFrame
    page={35}
    lesson={2}
    kicker="MISSION · 2강"
    title="후보 3개를 직접 판정"
    subtitle="5개 체크 후 활용 · 보류 · 제외"
    icon={ClipboardCheck}
  >
    <CheckList
      items={[
        { label: '이력', tone: 'blue', icon: History },
        { label: '백링크', tone: 'teal', icon: Link2 },
        { label: '앵커', tone: 'indigo', icon: Tag },
        { label: '스팸', tone: 'rose', icon: AlertOctagon },
        { label: '근거 판정', tone: 'emerald', icon: Gavel, badge: '판정' },
      ]}
    />
  </SlideFrame>
);
