import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import { EasyPlayer } from '../../../src';
import FeatureShowcase from '../../../playground/src/demos/FeatureShowcase.vue';
import '../../../src/style.css';
import './tailwind.css';
import './custom.css';

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('FeatureShowcase', FeatureShowcase);
    app.component('EasyPlayer', EasyPlayer);
  },
};

export default theme;
