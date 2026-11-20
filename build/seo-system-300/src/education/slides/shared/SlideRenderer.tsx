import { SlideFrame } from './SlideFrame';
import {
  CheckList,
  CompareColumns,
  CycleLoop,
  Funnel,
  HubSpokes,
  KeywordRow,
  LayerStack,
  OutcomeBar,
  PointTiles,
  StepFlow,
} from './diagrams';
import type { SlideDiagram, SlideSpec } from './slideSpec';

function Diagram({ diagram }: { diagram: SlideDiagram }) {
  switch (diagram.type) {
    case 'StepFlow':
      return <StepFlow steps={diagram.steps} />;
    case 'CycleLoop':
      return <CycleLoop center={diagram.center} centerIcon={diagram.centerIcon} steps={diagram.steps} />;
    case 'HubSpokes':
      return <HubSpokes hub={diagram.hub} hubIcon={diagram.hubIcon} items={diagram.items} />;
    case 'CompareColumns':
      return <CompareColumns columns={diagram.columns} />;
    case 'PointTiles':
      return <PointTiles points={diagram.points} />;
    case 'KeywordRow':
      return <KeywordRow words={diagram.words} />;
    case 'CheckList':
      return <CheckList items={diagram.items} />;
    case 'Funnel':
      return <Funnel layers={diagram.layers} />;
    case 'LayerStack':
      return <LayerStack layers={diagram.layers} />;
  }
}

interface SlideRendererProps {
  spec: SlideSpec;
  page: number;
  total: number;
  lesson: number;
}

export function SlideRenderer({ spec, page, total, lesson }: SlideRendererProps) {
  return (
    <SlideFrame
      page={page}
      total={total}
      lesson={lesson}
      kicker={spec.kicker}
      title={spec.title}
      subtitle={spec.subtitle}
      icon={spec.icon}
    >
      {spec.outcome ? (
        <div className="w-full">
          <Diagram diagram={spec.diagram} />
          <OutcomeBar label={spec.outcome.label} icon={spec.outcome.icon} />
        </div>
      ) : (
        <Diagram diagram={spec.diagram} />
      )}
    </SlideFrame>
  );
}
