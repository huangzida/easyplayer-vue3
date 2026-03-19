# easyplayer-vue3

[English](./README.md) | 中文

面向 Vue 3 的播放器封装组件，基于 EasyPlayerPro，提供：

- 类型完善的 props、事件与实例方法
- 自动化 runtime 资源加载
- VitePress 文档与本地 playground
- 基于 CI 的 npm 发布与 GitHub Release 流程

## 安装

```bash
pnpm add easyplayer-vue3
```

Peer 依赖：

- vue ^3.5.0

## 快速开始

### 方式一：作为插件注册

```ts
import { createApp } from 'vue';
import App from './App.vue';
import EasyPlayerVue3 from 'easyplayer-vue3';
import 'easyplayer-vue3/style.css';

const app = createApp(App);
app.use(EasyPlayerVue3);
app.mount('#app');
```

### 方式二：按组件直接引入

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
import 'easyplayer-vue3/style.css';
</script>

<template>
  <EasyPlayer
    url="https://example.com/live.m3u8"
    :is-live="true"
  />
</template>
```

## Runtime 资源加载机制

组件会在需要时自动加载 runtime 脚本：

- 默认脚本地址：BASE_URL/assets/easyplayer/EasyPlayer-lib.js
- 可通过 assetBaseUrl 指定自定义静态资源地址（如 CDN）
- 加载器内置去重、超时处理

使用自定义 CDN 示例：

```vue
<EasyPlayer
  url="https://example.com/live.m3u8"
  asset-base-url="https://cdn.example.com/easyplayer"
/>
```

## 组件 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| url | string | 必填 | 播放地址 |
| isLive | boolean | true | 是否直播模式 |
| hasAudio | boolean | true | 是否解析音频 |
| isMute | boolean | true | 是否静音 |
| stretch | boolean | false | 画面拉伸 |
| poster | string | undefined | 封面图 |
| bufferTime | number | 0.1 | 缓冲时长（秒） |
| MSE | boolean | false | MSE 解码模式 |
| WCS | boolean | false | WCS 解码模式 |
| WASM | boolean | false | WASM 解码模式 |
| WASMSIMD | boolean | true | WASM SIMD 模式 |
| gpuDecoder | boolean | undefined | 硬件解码 |
| debug | boolean | false | 调试模式 |
| noSignalText | string | '' | 无信号提示文字 |
| class | string | '' | 外层容器 class |
| style | CSSProperties | {} | 外层容器 style |
| assetBaseUrl | string | '' | runtime 资源根路径 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| play | 无 | 开始播放 |
| pause | 无 | 暂停播放 |
| error | error | 加载/运行时错误 |
| timeout | 无 | 加载超时 |
| liveEnd | 无 | 直播结束 |
| videoInfo | info | 视频信息 |
| audioInfo | info | 音频信息 |
| timestamps | time | 当前播放时间 |
| kBps | speed | 网速（KB/秒） |

### 暴露方法

通过模板 ref 调用：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const takeSnapshot = () => {
  playerRef.value?.screenshot('snapshot', 'png', 0.92, 'download');
};
</script>

<template>
  <EasyPlayer ref="playerRef" url="https://example.com/video.mp4" />
  <button @click="takeSnapshot">截图</button>
</template>
```

可用方法：

- getPlayer()
- play(url: string)
- playback(url: string)
- pause()
- screenshot()
- setFullscreen()
- exitFullscreen()
- setMute(mute: boolean)
- destroy()

## 开发

```bash
pnpm install
pnpm dev
pnpm dev:docs
```

## 构建与校验

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm build:docs
pnpm publint
```

一键校验：

```bash
pnpm verify
```

## 发布自动化

GitHub Actions：

- Prepare Release 工作流使用 bumpp + changelogithub
- 手动选择版本类型：patch / minor / major
- 执行 pnpm verify，更新版本与 CHANGELOG，自动提交并打 tag
- tag 推送后触发 .github/workflows/release.yml，发布 npm 并创建 GitHub Release

本地发布命令：

```bash
pnpm release
```

## 文档与演示

- 文档站：pnpm dev:docs
- 本地演示：pnpm dev

常用文件：

- docs/.vitepress/config.ts
- playground/src/demos/FeatureShowcase.vue
- .github/workflows/release.yml
