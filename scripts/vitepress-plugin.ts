import type { Plugin } from 'vite';
import { resolve } from 'path';
import { existsSync, copyFileSync, mkdirSync } from 'fs';

export const easyPlayerVue3Plugin = (
  options: { assetBaseUrl?: string } = {},
): Plugin => {
  return {
    name: 'easyplayer-vue3:runtime-inject',
    enforce: 'pre',

    closeBundle() {
      const srcDir = '/root/git/screen-recording/apps/web-antd/public/js/easyplayer';
      const destDir = resolve(process.cwd(), '.vitepress/dist/assets/easyplayer');

      if (existsSync(srcDir)) {
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }

        const files = ['EasyPlayer-lib.js', 'EasyPlayer-pro.js', 'EasyPlayer-pro.wasm'];
        files.forEach((file) => {
          const srcFile = resolve(srcDir, file);
          const destFile = resolve(destDir, file);
          if (existsSync(srcFile)) {
            copyFileSync(srcFile, destFile);
            console.log(`[easyplayer-vue3] Copied ${file} to .vitepress/dist/assets/easyplayer/`);
          }
        });
      }
    },
  };
};
