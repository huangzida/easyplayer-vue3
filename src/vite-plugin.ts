import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, copyFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import type { Connect, Plugin } from 'vite';

const PLUGIN_NAME = 'vite-plugin-easyplayer-vue3';
const RUNTIME_PACKAGE = 'easyplayer-vue3';
const RUNTIME_SOURCE_DIR = 'dist/assets/easyplayer';
const PUBLIC_TARGET_DIR = 'assets/easyplayer';
const SERVE_PREFIX = `/${PUBLIC_TARGET_DIR}/`;

/**
 * 文件扩展名到 MIME 的映射
 */
const MIME_MAP: Record<string, string> = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

export interface EasyPlayerVue3PluginOptions {
  enabled?: boolean;
}

/**
 * 递归拷贝目录
 */
function copyDirRecursive(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      mkdirSync(dirname(destPath), { recursive: true });
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 在 node_modules 中查找 easyplayer-vue3 的运行时资源目录
 * 支持向上查找（monorepo 场景）
 */
function findRuntimeAssets(root: string, maxDepth = 5): string | null {
  let current = root;
  for (let i = 0; i < maxDepth; i += 1) {
    const candidate = resolve(current, 'node_modules', RUNTIME_PACKAGE, RUNTIME_SOURCE_DIR);
    if (existsSync(candidate) && readdirSync(candidate).some((f) => f.endsWith('.js') || f.endsWith('.wasm'))) {
      return candidate;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/**
 * 根据文件扩展名获取 MIME 类型
 */
function getMimeType(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return MIME_MAP[ext] ?? 'application/octet-stream';
}

/**
 * 创建 dev server middleware：拦截 /assets/easyplayer/** 请求，
 * 直接从 node_modules 实时返回文件内容，不依赖 public 目录落盘。
 *
 * 这样即使 public 目录被删除或不存在，dev server 也能正常响应。
 */
function createAssetsMiddleware(assetsDir: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    const url = req.url ?? '';
    if (!url.startsWith(SERVE_PREFIX)) {
      next();
      return;
    }

    // 提取文件名（去掉 query string 和前缀）
    const fileName = decodeURIComponent(url.split('?')[0]!.slice(SERVE_PREFIX.length));
    if (!fileName || fileName.includes('..')) {
      next();
      return;
    }

    const filePath = join(assetsDir, fileName);
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      next();
      return;
    }

    try {
      const content = readFileSync(filePath);
      res.setHeader('Content-Type', getMimeType(filePath));
      res.setHeader('Cache-Control', 'no-cache');
      res.statusCode = 200;
      res.end(content);
    } catch {
      next();
    }
  };
}

/**
 * Vite 插件：
 * - dev：拦截 /assets/easyplayer/** 请求，从 node_modules 实时返回（不落盘到 public）
 * - build：拷贝运行时资源到 outDir/assets/easyplayer/
 *
 * 注意：拷贝必须在 writeBundle 而非 buildStart 中进行。
 * Vite 的 emptyOutDir 清空 outDir 发生在 buildStart 之后、bundle.write() 之前，
 * 在 buildStart 拷贝会导致文件被清空。writeBundle 在产物写入完成后触发，
 * 此时 emptyOutDir 已执行完，文件能保留到最终产物中。
 *
 * @example
 * // vite.config.ts
 * import { easyplayerVue3Plugin } from 'easyplayer-vue3/vite-plugin';
 *
 * export default defineConfig({
 *   plugins: [easyplayerVue3Plugin()],
 * });
 */
export function easyplayerVue3Plugin(options: EasyPlayerVue3PluginOptions = {}): Plugin {
  const { enabled = true } = options;

  let projectRoot: string;
  let outDir: string;
  let command: string;
  let cachedAssetsDir: string | null = null;
  let copied = false;

  const getAssetsDir = () => {
    if (cachedAssetsDir === null) {
      cachedAssetsDir = findRuntimeAssets(projectRoot);
      if (!cachedAssetsDir) {
        console.warn(
          `[${PLUGIN_NAME}] easyplayer-vue3 runtime assets not found. ` +
            `Make sure ${RUNTIME_PACKAGE} is installed.`,
        );
      }
    }
    return cachedAssetsDir;
  };

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    configResolved(config) {
      projectRoot = config.root || process.cwd();
      outDir = resolve(projectRoot, config.build.outDir || 'dist');
      command = config.command;
    },
    configureServer(server) {
      if (!enabled) return;

      const assetsDir = getAssetsDir();
      if (!assetsDir) return;

      // 注册 middleware，拦截 /assets/easyplayer/** 请求
      server.middlewares.use(createAssetsMiddleware(assetsDir));
      console.log(`[${PLUGIN_NAME}] Dev middleware serving runtime assets from: ${assetsDir}`);
    },
    configurePreviewServer(server) {
      if (!enabled) return;

      const assetsDir = getAssetsDir();
      if (!assetsDir) return;

      server.middlewares.use(createAssetsMiddleware(assetsDir));
    },
    // 使用 copied 标记避免多 output 场景下重复拷贝
    writeBundle() {
      if (!enabled || command !== 'build' || copied) return;

      const assetsDir = getAssetsDir();
      if (!assetsDir) return;

      const targetDir = resolve(projectRoot, outDir, PUBLIC_TARGET_DIR);
      try {
        copyDirRecursive(assetsDir, targetDir);
        copied = true;
        console.log(`[${PLUGIN_NAME}] Runtime assets copied to: ${targetDir}`);
      } catch (err) {
        console.error(`[${PLUGIN_NAME}] Failed to copy runtime assets:`, err);
      }
    },
  };
}
