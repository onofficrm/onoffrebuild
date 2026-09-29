import React from 'react';
import { AlertOctagon, Ban, CheckCircle2, History, PauseCircle, Trash2 } from 'lucide-react';
import { SlideFrame } from '../../shared/SlideFrame';
import { OutcomeBar, StepFlow } from '../../shared/diagrams';

export const Slide26Check02History: React.FC = () => (
  <SlideFrame
    page={26}
    lesson={2}
    kicker="CHECK 02 · 이력"
    title="시간을 따라 화면을 봅니다"
    subtitle="스팸 변조가 한 번이면 제외"
    icon={History}
  >
    <div className="w-full">
      <StepFlow
        steps={[
          { label: '정상 운영', tone: 'emerald', icon: CheckCircle2 },
          { label: '운영 중단', tone: 'amber', icon: PauseCircle },
          { label: '스팸 변조', tone: 'rose', icon: AlertOctagon },
          { label: '삭제', tone: 'blue', icon: Trash2 },
        ]}
      />
      <OutcomeBar label="변조 발견 → 즉시 탈락" icon={Ban} />
    </div>
  </SlideFrame>
);
