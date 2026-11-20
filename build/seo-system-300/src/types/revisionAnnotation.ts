export type RevisionAnnotateTool = 'block' | 'box' | 'pen';

export type RevisionAnnotationBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type RevisionAnnotation = {
  tool: RevisionAnnotateTool;
  label: string;
  device: 'pc' | 'mobile' | 'both' | string;
  pageUrl: string;
  box?: RevisionAnnotationBox;
  snapshotFileId?: number;
  snapshotUrl?: string;
};
