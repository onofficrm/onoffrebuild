import { LESSON_1_EXPLANATIONS } from './lesson1Explanations';
import { LESSON_2_EXPLANATIONS } from './lesson2Explanations';

export type {
  DomainFieldAvailability,
  DomainMetricMapItem,
  DomainMetricPriority,
  DomainMetricSourceKind,
  DomainPriorityItem,
  DomainSearchTarget,
  DomainTargetTip,
  DomainWhereToCheck,
  ExpiredDomainTips,
  SlideExplanationSections,
  SlideLearningContent,
} from './types';
export { DOMAIN_METRIC_MAP, DOMAIN_WHERE_TO_CHECK } from './domainMetricMap';

export const SLIDE_LEARNING_CONTENT = {
  ...LESSON_1_EXPLANATIONS,
  ...LESSON_2_EXPLANATIONS,
};
