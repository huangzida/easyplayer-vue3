import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

const sourceDir = resolve(root, 'public', 'assets', 'easyplayer');
const playgroundPublicDir = resolve(root, 'playground', 'public');

if (!existsSync(sourceDir)) {
  console.warn('[easyplayer-vue3] Source assets not found:', sourceDir);
  process.exit(0);
}

console.log('[easyplayer-vue3] Syncing assets for playground dev server...');

const files = readdirSync(sourceDir);
files.forEach((file) => {
  if (file.endsWith('.js') || file.endsWith('.wasm')) {
    const srcFile = resolve(sourceDir, file);
    const destFile = resolve(playgroundPublicDir, file);
    copyFileSync(srcFile, destFile);
    console.log(`[easyplayer-vue3] Copied: ${file} -> ${playgroundPublicDir}`);
  }
});

console.log('[easyplayer-vue3] Done!');
