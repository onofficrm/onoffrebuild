/**
 * Legacy named exports for the deprecated EducationSlidesView only.
 * Slides are data in ./lessons; the active viewer uses slideDeckRegistry.
 */
import { EDUCATION_DECKS } from '../../components/slides/slideDeckRegistry';

const [
  Slide01Cover,
  Slide02WhyProcess,
  Slide03Philosophy,
  Slide04PipelineOverview,
  Slide05Step01Domain,
  Slide06Step02Website,
  Slide07Step03Content,
  Slide08Step04Indexing,
  Slide09Step05Backlink,
  Slide10Step06Traffic,
  Slide11Step07Analytics,
  Slide12Step08GEO,
  Slide13SEOAndGEO,
  Slide14FlywheelLoop,
  Slide15PlatformEcosystem,
  Slide16StudentJourney,
  Slide17ProjectOutcomes,
  Slide18Lesson1Mission,
  Slide19CompletionCriteria,
  Slide20NextPreview,
] = EDUCATION_DECKS[0].slides.map((slide) => slide.component);

export {
  Slide01Cover,
  Slide02WhyProcess,
  Slide03Philosophy,
  Slide04PipelineOverview,
  Slide05Step01Domain,
  Slide06Step02Website,
  Slide07Step03Content,
  Slide08Step04Indexing,
  Slide09Step05Backlink,
  Slide10Step06Traffic,
  Slide11Step07Analytics,
  Slide12Step08GEO,
  Slide13SEOAndGEO,
  Slide14FlywheelLoop,
  Slide15PlatformEcosystem,
  Slide16StudentJourney,
  Slide17ProjectOutcomes,
  Slide18Lesson1Mission,
  Slide19CompletionCriteria,
  Slide20NextPreview,
};
