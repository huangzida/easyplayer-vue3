import type { App } from 'vue';

import EasyPlayer from './components/EasyPlayer/index.vue';

export * from './types';
export { EasyPlayer };
export { default } from './components/EasyPlayer/index.vue';

import { ensureEasyPlayerRuntime } from './runtime/asset-loader';

import './style.css';

export const install = async (app: App) => {
  app.component('EasyPlayer', EasyPlayer);
};

export { ensureEasyPlayerRuntime };
