export type LayoutMode = 'portfolio' | 'resume';
export type Language = 'th' | 'en';
export type ColorMode = 'dark' | 'light';
export type PortfolioTheme =
  | 'tech'
  | 'educ'
  | 'gov'
  | 'creative'
  | 'minimal'
  | 'eco'
  | 'bold'
  | 'luxury'
  | 'health'
  | 'esports';

export interface ExperienceItem {
  title?: string;
  company?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
  description?: string;
  highlights?: string;
  image?: string;
}

export interface PortfolioData {
  name?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  skills?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  exp?: ExperienceItem[];
  layout?: LayoutMode;
  lang?: Language;
  colorMode?: ColorMode;
  portfolioStyle?: PortfolioTheme;
  resumeVisibility?: Record<string, boolean>;
  [key: string]: unknown;
}
