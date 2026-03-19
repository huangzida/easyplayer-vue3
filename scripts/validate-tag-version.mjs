import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const tag = process.env.GITHUB_REF_NAME ?? process.argv[2] ?? '';
const version = packageJson.version;

if (!tag) {
  console.error('No release tag provided.');
  process.exit(1);
}

const normalizedTag = tag.startsWith('v') ? tag.slice(1) : tag;

if (normalizedTag !== version) {
  console.error(`Tag ${tag} does not match package.json version ${version}.`);
  process.exit(1);
}

console.log(`Release tag ${tag} matches package.json version ${version}.`);