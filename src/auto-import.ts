import stylesText from './style.css?raw';

let cssInjected = false;

export * from './index';
export { default } from './components/EasyPlayer/index.vue';

if (typeof window !== 'undefined' && !cssInjected) {
  const styleEl = document.createElement('style');
  styleEl.textContent = stylesText;
  document.head.appendChild(styleEl);
  cssInjected = true;
}
