import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';

const sharedGlobals = {
  URL: 'readonly',
  console: 'readonly',
  document: 'readonly',
  HTMLScriptElement: 'readonly',
  process: 'readonly',
  window: 'readonly',
  navigator: 'readonly',
  WebAssembly: 'readonly',
  setTimeout: 'readonly',
  clearInterval: 'readonly',
  fetch: 'readonly',
  btoa: 'readonly',
  Buffer: 'readonly',
  crypto: 'readonly',
  require: 'readonly',
  readline: 'readonly',
  XMLHttpRequest: 'readonly',
};

export default [
  {
    ignores: [
      'dist/**',
      'docs/.vitepress/**',
      '.vitepress/**',
      'docs/public/**',
      'playground/dist/**',
      'playground/public/**',
      'public/**',
      '.artifacts/**',
      'coverage/**',
      'node_modules/**',
      '**/assets/**/*.js',
      '**/*.min.js',
      '**/easyplayer*/**',
    ],
  },
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,mts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: sharedGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals,
    },
    rules: {
      'no-undef': 'off',
    },
  },
];
