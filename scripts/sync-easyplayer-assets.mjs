import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const sourceDir = '/root/git/screen-recording/apps/web-antd/public/js/easyplayer';

const targets = process.argv.slice(2);

if (targets.length === 0) {
  targets.push('public', 'playground/public', 'docs/public');
}

targets.forEach((target) => {
  const destDir = resolve(root, target, 'assets', 'easyplayer');

  if (!existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  mkdirSync(destDir, { recursive: true });

  const files = readdirSync(sourceDir);
  files.forEach((file) => {
    const srcFile = resolve(sourceDir, file);
    const destFile = resolve(destDir, file);
    copyFileSync(srcFile, destFile);
    console.log(`Copied: ${file} -> ${destFile}`);
  });

  console.log(`Assets synced to: ${destDir}\n`);
});

console.log('Done!');
