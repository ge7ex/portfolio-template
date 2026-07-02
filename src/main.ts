import type { PortfolioData } from './types/profile';

/**
 * V2 TypeScript entrypoint.
 *
 * The current UI runtime intentionally remains in `public/legacy/v49-app.js`
 * to preserve v49 parity first. Future Codex tasks should migrate one
 * feature at a time from the legacy runtime into typed modules.
 */

export interface AppRuntimeMeta {
  version: string;
  baseline: string;
  migrationStage: 'parity-shell' | 'typed-modules';
}

export const runtimeMeta: AppRuntimeMeta = {
  version: '0.1.0',
  baseline: 'v49-corrective',
  migrationStage: 'parity-shell'
};

declare global {
  interface Window {
    __PORTFOLIO_V2_TS_META__?: AppRuntimeMeta;
    INJECTED_PORTFOLIO_DATA?: PortfolioData;
  }
}

window.__PORTFOLIO_V2_TS_META__ = runtimeMeta;
