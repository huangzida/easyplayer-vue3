import stylesText from './style.css?raw';
const styleEl = document.createElement('style');
styleEl.textContent = stylesText;
document.head.appendChild(styleEl);

export * from './index';
export { default } from './components/EasyPlayer/index.vue';
