import React from 'react';
import { Award, BookOpen, Gavel, ListChecks, Scale } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { CheckList } from '../../shared/diagrams';

export const Slide37CompletionCriteria: React.FC = () => (
  <SlideFrame
    page={37}
    lesson={2}
    kicker="DONE · 2강"
    title="스스로 판단하면 완료"
    subtitle="찾기에서 판단으로"
    icon={Award}
  >
    <CheckList
      items={[
        { label: '정의', tone: 'blue', icon: BookOpen, badge: 'PASS' },
        { label: '5개 체크', tone: 'cyan', icon: ListChecks, badge: 'PASS' },
        { label: '비교 설명', tone: 'teal', icon: Scale, badge: 'PASS' },
        { label: '구매 결정', tone: 'emerald', icon: Gavel, badge: 'PASS' },
      ]}
    />
  </SlideFrame>
);
