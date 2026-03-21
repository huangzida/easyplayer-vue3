import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const VITE_PLUGIN_NAME = 'vite-plugin-easyplayer-vue3';
const EASYPLAYER_MODULE = 'easyplayer-vue3';
const EASYPLAYER_ASSETS_PATH = 'public/assets/easyplayer';
const BUILD_ASSETS_PATH = 'assets/easyplayer';

function copyDirectory(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);

    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      const destDir = dirname(destPath);
      mkdirSync(destDir, { recursive: true });
      copyFileSync(srcPath, destPath);
    }
  }
}

export interface EasyPlayerVue3PluginOptions {
  enabled?: boolean;
  verbose?: boolean;
}

export function easyplayerVue3Plugin(
  options: EasyPlayerVue3PluginOptions = {}
): Plugin {
  const { enabled = true, verbose = true } = options;

  let root: string;
  let publicDir: string;
  let command: 'build' | 'serve';

  const log = (message: string) => {
    if (verbose) {
      console.log(`[${VITE_PLUGIN_NAME}] ${message}`);
    }
  };

  const findEasyPlayerAssets = (): string | null => {
    try {
      const sourcePaths = [
        resolve(root, 'public', 'assets', 'easyplayer'),
        resolve(root, 'dist', 'assets', 'easyplayer'),
      ];

      for (const path of sourcePaths) {
        if (existsSync(path)) {
          const files = readdirSync(path);
          if (files.some((f) => f.endsWith('.js') || f.endsWith('.wasm'))) {
            return path;
          }
        }
      }

      let currentDir = root;
      const maxDepth = 5;

      for (let depth = 0; depth < maxDepth; depth++) {
        const possiblePaths = [
          resolve(currentDir, 'node_modules', EASYPLAYER_MODULE, EASYPLAYER_ASSETS_PATH),
          resolve(currentDir, 'node_modules', EASYPLAYER_MODULE, 'dist', BUILD_ASSETS_PATH),
        ];

        for (const path of possiblePaths) {
          if (existsSync(path)) {
            const files = readdirSync(path);
            if (files.some((f) => f.endsWith('.js') || f.endsWith('.wasm'))) {
              return path;
            }
          }
        }

        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
          break;
        }
        currentDir = parentDir;
      }
    } catch (error) {
      log(`Error finding EasyPlayer assets: ${error}`);
    }

    return null;
  };

  const findCSSPath = (): string | null => {
    try {
      const cssFileName = 'easyplayer-vue3.css';
      
      const localDistCSSPath = resolve(root, 'dist', cssFileName);
      if (existsSync(localDistCSSPath)) {
        return localDistCSSPath;
      }
      
      let currentDir = root;
      const maxDepth = 5;

      for (let depth = 0; depth < maxDepth; depth++) {
        const possiblePaths = [
          resolve(currentDir, 'node_modules', EASYPLAYER_MODULE, 'dist', cssFileName),
          resolve(currentDir, 'node_modules', EASYPLAYER_MODULE, cssFileName),
        ];

        for (const path of possiblePaths) {
          if (existsSync(path)) {
            return path;
          }
        }

        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
          break;
        }
        currentDir = parentDir;
      }
      
      const parentDistCSSPath = resolve(currentDir, 'dist', cssFileName);
      if (existsSync(parentDistCSSPath)) {
        return parentDistCSSPath;
      }
    } catch (error) {
      log(`Error finding CSS: ${error}`);
    }

    return null;
  };

  return {
    name: VITE_PLUGIN_NAME,
    enforce: 'pre',

    configResolved(config) {
      root = config.root || process.cwd();
      publicDir = resolve(root, config.publicDir || 'public');
      command = config.command;
      log(`Config resolved - root: ${root}, publicDir: ${publicDir}, command: ${command}`);
    },

    async buildStart() {
      if (!enabled) {
        return;
      }

      if (command !== 'build') {
        return;
      }

      const sourceDir = findEasyPlayerAssets();

      if (!sourceDir) {
        if (verbose) {
          log(
            `EasyPlayer runtime assets not found. Make sure ${EASYPLAYER_MODULE} is installed.`
          );
        }
        return;
      }

      const destDir = resolve(root, 'dist', BUILD_ASSETS_PATH);

      try {
        log(`Copying EasyPlayer runtime from: ${sourceDir}`);
        copyDirectory(sourceDir, destDir);
        log(`EasyPlayer runtime copied to: ${destDir}`);
      } catch (error) {
        console.error(`[${VITE_PLUGIN_NAME}] Failed to copy assets:`, error);
      }
    },

    configureServer(server) {
      if (!enabled) {
        return;
      }

      const sourceDir = findEasyPlayerAssets();

      if (!sourceDir) {
        if (verbose) {
          log(
            `EasyPlayer runtime assets not found. Make sure ${EASYPLAYER_MODULE} is installed or assets are in ${resolve(root, 'public', 'assets', 'easyplayer')}`
          );
        }
        return;
      }

      if (!existsSync(publicDir)) {
        mkdirSync(publicDir, { recursive: true });
      }

      const destDir = join(publicDir, 'assets', 'easyplayer');

      try {
        log(`Linking EasyPlayer runtime for dev server from: ${sourceDir}`);
        copyDirectory(sourceDir, destDir);
        log(`EasyPlayer runtime linked to: ${destDir}`);
      } catch (error) {
        console.error(`[${VITE_PLUGIN_NAME}] Failed to link assets:`, error);
      }

      server.watcher.add(publicDir);
    },
  };
}
