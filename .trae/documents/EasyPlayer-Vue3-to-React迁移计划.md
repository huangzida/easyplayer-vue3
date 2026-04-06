# EasyPlayer Vue3 → React 迁移计划

## 概述
将 `easyplayer-vue3` 库完整迁移到 `easyplayer-react`，使用最新 React 版本，但打包后需支持 React >= 17 的第三方项目。

## 迁移范围
| 模块 | 状态 | 说明 |
|------|------|------|
| 核心组件 | ✅ 迁移 | EasyPlayer React 组件 |
| 类型定义 | ✅ 迁移 | TypeScript 类型（移除 Vue 依赖） |
| 运行时加载器 | ✅ 迁移 | asset-loader（复用） |
| 样式文件 | ✅ 迁移 | CSS/SCSS（复用） |
| Playground | ✅ 保留 | 转换为 React + TypeScript |
| package.json scripts | ✅ 迁移 | 更新为 React 版本 |
| GitHub Actions | ✅ 迁移 | CI/CD 工作流 |
| README 文档 | ✅ 迁移 | 更新为 React 版本 |

---

## 1. 项目结构

```
easyplayer-react/
├── src/
│   ├── components/
│   │   └── EasyPlayer/
│   │       ├── index.tsx          # React 组件（核心迁移）
│   │       └── index.scss         # 样式（复制）
│   ├── runtime/
│   │   └── asset-loader.ts        # 运行时加载器（复制）
│   ├── types.ts                   # 类型定义（适配 React）
│   ├── index.ts                   # 入口文件
│   └── style.css                 # 基础样式（复制）
├── playground/                     # 保留开发预览
│   ├── src/
│   │   ├── App.tsx               # React App
│   │   ├── main.tsx              # 入口
│   │   ├── index.css             # 全局样式
│   │   ├── components/           # 配置/日志组件
│   │   └── demos/
│   │       └── FeatureShowcase.tsx
│   ├── vite.config.ts            # Vite 配置
│   └── index.html
├── public/
│   └── assets/
│       └── easyplayer/           # 播放器资源
├── scripts/
│   └── sync-easyplayer-assets.mjs # 资源同步脚本
├── .github/
│   └── workflows/
│       ├── ci.yml                # CI 工作流
│       └── release.yml           # 发布工作流
├── .release-it.json              # release-it 配置
├── package.json
├── tsdown.config.ts              # tsdown 打包配置
├── tsconfig.json
├── vite.config.ts                # 库构建配置
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.mjs
├── vitest.config.ts
├── README.md
├── README.zh-CN.md
└── CHANGELOG.md
```

---

## 2. 核心文件配置

### 2.1 package.json 关键配置

```json
{
  "name": "easyplayer-react",
  "peerDependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  },
  "devDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.3",
    "tsdown": "^0.12.0",
    "vite": "^6.4.1",
    "@vitejs/plugin-react": "^4.4.0",
    "vitest": "^3.2.4",
    "eslint": "^9.30.1",
    "tailwindcss": "^3.4.18"
  }
}
```

### 2.2 tsdown.config.ts 配置

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
  jsx: {
    runtime: 'automatic',
  },
  shims: true,
});
```

### 2.3 vite.config.ts（库构建）

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src/index.ts'] }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EasyPlayerReact',
      fileName: 'index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', /^node:.*/],
      output: {
        assetFileNames: 'easyplayer-react.css',
      },
    },
    cssCodeSplit: false,
  },
});
```

---

## 3. Vue → React 转换映射

### 3.1 组件逻辑转换

| Vue3 特性 | React 实现 |
|-----------|-----------|
| `ref()` | `useRef()` + `useState()` |
| `computed()` | `useMemo()` |
| `watch(() => prop)` | `useEffect()` + deps |
| `defineProps()` | `EasyPlayerProps` interface |
| `defineEmits()` | `on*` props callbacks |
| `defineExpose()` | `forwardRef` + `useImperativeHandle` |
| `onMounted()` | `useEffect(() => {...}, [])` |
| `onUnmounted()` | `useEffect(() => { return () => {...} }, [])` |
| `defineOptions({ name })` | 直接函数名或 `displayName` |
| `$slots.error` | `renderError` prop / children |

### 3.2 React 组件 API

```tsx
interface EasyPlayerProps {
  // 基本属性
  url?: string;
  mode?: 'vod' | 'live' | 'custom';
  poster?: string;

  // 播放参数
  isLive?: boolean;
  isMute?: boolean;
  hasAudio?: boolean;
  bufferTime?: number;

  // 解码参数
  mse?: boolean;
  wcs?: boolean;
  wasm?: boolean;
  wasmSimd?: boolean;
  gpuDecoder?: boolean;

  // 渲染参数
  webGpu?: boolean;
  canvasRender?: boolean;
  stretch?: boolean;
  controls?: boolean;

  // 高级参数
  debug?: boolean;
  loadTimeOut?: number;
  loadTimeReplay?: number;
  quality?: string[];
  defaultQuality?: string;
  watermark?: WatermarkConfig;
  fullWatermark?: FullWatermarkConfig;
  fallbackUrl?: string;

  // 重试配置
  retry?: RetryConfig;

  // 样式
  className?: string;
  style?: React.CSSProperties;
  assetBaseUrl?: string;
  noSignalText?: string;

  // 事件回调
  onPlayerReady?: (player: EasyPlayerPro) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: any) => void;
  onTimeout?: () => void;
  onLiveEnd?: () => void;
  onVideoInfo?: (info: any) => void;
  onAudioInfo?: (info: any) => void;
  onKBps?: (speed: number) => void;
  onTimestamps?: (time: number) => void;

  // 自定义渲染
  children?: React.ReactNode;  // 替代 error slot
  renderError?: (props: { error: string; retry: () => void }) => React.ReactNode;
}
```

### 3.3 ref 暴露方法

```tsx
// 使用 forwardRef + useImperativeHandle
interface EasyPlayerRef {
  getPlayer: () => EasyPlayerPro | null;
  play: (url: string) => void;
  playback: (url: string) => void;
  pause: () => void;
  screenshot: (...args: any[]) => any;
  setFullscreen: () => void;
  exitFullscreen: () => void;
  setMute: (mute: boolean) => void;
  setQuality: (quality: string) => void;
  seekTime: (time: number) => void;
  retry: () => void;
  getEventHistory: () => EventHistory[];
  clearEventHistory: () => void;
  destroy: () => void;
}
```

---

## 4. Playground 结构

### 4.1 React 版本的 Playground

```
playground/
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # 主应用（从 Vue 转换）
│   ├── index.css
│   ├── types.ts                # 共享类型
│   ├── index.ts                # 库入口
│   ├── components/
│   │   ├── PlayerConfig.tsx     # 配置面板
│   │   ├── EventLog.tsx        # 事件日志
│   │   └── StatusBadge.tsx
│   └── demos/
│       └── FeatureShowcase.tsx # 功能展示
├── vite.config.ts
├── index.html
└── public/
    └── assets/
        └── easyplayer/
```

### 4.2 配置组件转换

| Vue 组件 | React 组件 |
|---------|-----------|
| PlayerConfig.vue | PlayerConfig.tsx |
| EventLog.vue | EventLog.tsx |
| StatusBadge.vue | StatusBadge.tsx |
| FeatureShowcase.vue | FeatureShowcase.tsx |

---

## 5. 发布流程迁移

### 5.1 package.json scripts

```json
{
  "scripts": {
    "dev": "node scripts/sync-playground.mjs && vite --config playground/vite.config.ts",
    "build": "tsdown && vite build --config playground/vite.config.ts",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "release": "release-it",
    "pack:check": "pnpm build && pnpm pack --pack-destination .artifacts",
    "publint": "publint",
    "verify": "pnpm lint && pnpm typecheck && pnpm build && pnpm publint"
  }
}
```

### 5.2 GitHub Actions - CI

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.12.4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
```

### 5.3 GitHub Actions - Release

```yaml
name: Release Package

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.12.4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm verify
      - run: pnpm publish --access public --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 6. README 文档结构

```markdown
# easyplayer-react

[English](./README.md) | [中文](./README.zh-CN.md)

React component wrapper for EasyPlayerPro with typed props, events, and instance methods.

## Features
- Multi-format support: HLS, FLV, MP4, WebM
- Rich controls: Play, pause, screenshot, fullscreen, mute
- Mode presets: Built-in `vod` and `live` mode presets
- Full TypeScript support
- React >= 17 compatible

## Installation
npm install easyplayer-react

## Quick Start
import { EasyPlayer } from 'easyplayer-react';
import 'easyplayer-react/style.css';

<EasyPlayer url="https://example.com/stream.m3u8" />

## API Reference
(同 Vue3 版本，转换为 React Props 风格)
```

---

## 7. 文件清单

| 操作 | 文件路径 | 说明 |
|------|---------|------|
| 创建 | `package.json` | React 版本依赖 |
| 创建 | `tsdown.config.ts` | 打包配置 |
| 创建 | `vite.config.ts` | 库构建配置 |
| 创建 | `tsconfig.json` | TypeScript 配置 |
| 创建 | `src/index.ts` | 入口文件 |
| 创建 | `src/types.ts` | 类型定义 |
| 创建 | `src/components/EasyPlayer/index.tsx` | React 组件 |
| 复制 | `src/components/EasyPlayer/index.scss` | 样式 |
| 复制 | `src/runtime/asset-loader.ts` | 运行时加载 |
| 复制 | `src/style.css` | 基础样式 |
| 创建 | `playground/src/App.tsx` | Playground 主应用 |
| 创建 | `playground/src/main.tsx` | Playground 入口 |
| 创建 | `playground/src/components/*.tsx` | Playground 组件 |
| 创建 | `playground/src/demos/*.tsx` | 功能展示 |
| 创建 | `.github/workflows/ci.yml` | CI 工作流 |
| 创建 | `.github/workflows/release.yml` | 发布工作流 |
| 创建 | `.release-it.json` | release-it 配置 |
| 创建 | `README.md` / `README.zh-CN.md` | 文档 |
| 创建 | `.gitignore` | Git 忽略 |
| 创建 | `vitest.config.ts` | 测试配置 |
| 创建 | `eslint.config.mjs` | ESLint 配置 |

---

## 8. 验收标准

1. ✅ 组件可在 React 17+ 项目中使用
2. ✅ 所有播放器功能正常工作
3. ✅ TypeScript 类型完整无误
4. ✅ Playground 可正常运行
5. ✅ CI/CD 工作流正常
6. ✅ 发布流程可执行
7. ✅ 打包产物符合 npm 标准

---

## 9. 预计工作量

| 模块 | 时间 | 优先级 |
|------|------|--------|
| 项目初始化 | 15min | P1 |
| React 组件转换 | 60min | P1 |
| Playground 转换 | 45min | P2 |
| 配置调优 | 20min | P2 |
| CI/CD 配置 | 15min | P2 |
| 文档编写 | 15min | P3 |
| 测试验证 | 20min | P1 |
| **总计** | **~190min** | |
