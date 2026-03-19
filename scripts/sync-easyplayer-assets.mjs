import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const possibleSourceDirs = [
  resolve(root, 'public', 'assets', 'easyplayer'),
  resolve(root, 'src', 'runtime'),
];

let sourceDir = null;
for (const dir of possibleSourceDirs) {
  if (existsSync(dir) && readdirSync(dir).length > 0) {
    sourceDir = dir;
    break;
  }
}

const targets = process.argv.slice(2);

if (targets.length === 0) {
  targets.push('public', 'playground/public', 'docs/public');
}

if (!sourceDir) {
  console.warn('[easyplayer-vue3] No EasyPlayer runtime assets found.');
  console.warn('[easyplayer-vue3] Please ensure assets are in public/assets/easyplayer/ or src/runtime/');
  console.warn('[easyplayer-vue3] Skipping asset sync...');
  process.exit(0);
}

console.log(`[easyplayer-vue3] Found assets in: ${sourceDir}`);

targets.forEach((target) => {
  const destDir = resolve(root, target, 'assets', 'easyplayer');

  mkdirSync(destDir, { recursive: true });

  const files = readdirSync(sourceDir);
  files.forEach((file) => {
    if (file.endsWith('.js') || file.endsWith('.wasm')) {
      const srcFile = resolve(sourceDir, file);
      const destFile = resolve(destDir, file);
      copyFileSync(srcFile, destFile);
      console.log(`[easyplayer-vue3] Copied: ${file} -> ${destDir}`);
    }
  });

  console.log(`[easyplayer-vue3] Assets synced to: ${destDir}\n`);
});

console.log('[easyplayer-vue3] Done!');
