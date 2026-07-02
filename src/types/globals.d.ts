import type { PortfolioData } from './profile';

declare global {
  interface Window {
    INJECTED_PORTFOLIO_DATA?: PortfolioData;
    lucide?: { createIcons?: () => void };
    html2canvas?: unknown;
    JSZip?: unknown;
    PptxGenJS?: unknown;
    [key: string]: unknown;
  }
}

export {};
