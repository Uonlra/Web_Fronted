export type ProjectCategory = 'workbench' | 'community' | 'media' | 'other';

export type ProjectLinkType = 'github' | 'demo' | 'documentation' | 'other';

export type SkillLevel = 'familiar' | 'proficient' | 'advanced';

export type ExternalLink = {
  id: string;
  label: string;
  href: string;
  type: ProjectLinkType;
};

export type Skill = {
  id: string;
  name: string;
  level: SkillLevel;
  evidenceProjectIds: string[];
};

export type ImageAsset = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  group?: string;
};

export type ArchitectureDiagram = {
  source: string;
  description: string;
};

export type Challenge = {
  id: string;
  title: string;
  problem: string;
  decision: string;
  implementation: string;
  result: string;
};

export type QualityEvidence = {
  summary: string;
  checks: string[];
  testing: string[];
  engineering: string[];
};

export type ProjectEvidence = {
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  architectureDiagram?: ArchitectureDiagram;
  routeCount: number;
  moduleCount: number;
  highlights: Challenge[];
};

export type Profile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  availability: string;
  skills: Skill[];
  links: ExternalLink[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  featured: boolean;
  published: boolean;
  order: number;
  timeRange: string;
  stack: string[];
  role: string[];
  outcomes: string[];
  background: string;
  quality: QualityEvidence;
  evidence: ProjectEvidence;
  links: ExternalLink[];
  updatedAt: string;
};

export type PortfolioData = {
  version: 1;
  profile: Profile;
  projects: Project[];
  updatedAt: string;
};
