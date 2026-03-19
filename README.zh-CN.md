# easyplayer-vue3

[English](./README.md) | [中文](./README.zh-CN.md)

基于 EasyPlayerPro 的 Vue 3 组件封装，提供类型化的 props、事件和实例方法。

## 特性

- **多格式支持**: HLS、FLV、MP4、WebM 等
- **丰富的控制**: 播放、暂停、截图、全屏、静音等
- **类型化 API**: 完整的 TypeScript 支持
- **事件系统**: 全面的播放器状态变化事件
- **自动加载运行时**: 自动加载 EasyPlayer 运行时资源
- **灵活部署**: 支持自定义 CDN 资源路径

## 安装

```bash
npm install easyplayer-vue3
# 或
yarn add easyplayer-vue3
# 或
pnpm add easyplayer-vue3
```

## 快速开始

### 基础用法

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
</script>

<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
  />
</template>
```

### 事件处理

```vue
<script setup lang="ts">
const handlePlay = () => {
  console.log('播放器开始播放');
};

const handleError = (error: any) => {
  console.error('播放器错误:', error);
};
</script>

<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    @play="handlePlay"
    @error="handleError"
  />
</template>
```

### 使用实例方法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const takeSnapshot = () => {
  if (playerRef.value) {
    playerRef.value.screenshot('截图', 'png', 0.92, 'download');
  }
};
</script>

<template>
  <div>
    <EasyPlayer
      ref="playerRef"
      url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      :is-live="true"
    />
    <button @click="takeSnapshot">截图</button>
  </div>
</template>
```

## API 参考

### Props 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string` | 必填 | 视频流或文件地址 |
| `isLive` | `boolean` | `true` | 直播模式 |
| `hasAudio` | `boolean` | `true` | 解析音频轨道 |
| `isMute` | `boolean` | `true` | 初始静音 |
| `stretch` | `boolean` | `false` | 拉伸填充容器 |
| `poster` | `string` | - | 封面图片地址 |
| `bufferTime` | `number` | `0.1` | 缓冲时长（秒） |
| `MSE` | `boolean` | `false` | MSE 解码模式 |
| `WCS` | `boolean` | `false` | WCS 解码模式 |
| `WASM` | `boolean` | `false` | WASM 解码模式 |
| `WASMSIMD` | `boolean` | `true` | WASM SIMD 模式 |
| `gpuDecoder` | `boolean` | - | 硬件解码 |
| `webGPU` | `boolean` | - | WebGPU 渲染 |
| `canvasRender` | `boolean` | - | Canvas 渲染 |
| `debug` | `boolean` | `false` | 调试模式 |
| `noSignalText` | `string` | `''` | 无信号提示文字 |
| `class` | `string` | `''` | 自定义类名 |
| `style` | `CSSProperties` | `{}` | 自定义样式 |
| `assetBaseUrl` | `string` | `''` | 运行时资源基础路径 |

### Events 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `play` | - | 开始播放时触发 |
| `pause` | - | 暂停播放时触发 |
| `error` | `any` | 播放器错误时触发 |
| `timeout` | - | 加载超时时触发 |
| `liveEnd` | - | 直播结束时触发 |
| `videoInfo` | `any` | 视频信息 |
| `audioInfo` | `any` | 音频信息 |
| `playerReady` | `EasyPlayerPro` | 播放器实例就绪 |

### Instance Methods 实例方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `getPlayer()` | - | 获取底层播放器实例 |
| `play(url)` | `url: string` | 开始播放指定地址 |
| `playback(url)` | `url: string` | 开始点播 |
| `pause()` | - | 暂停播放 |
| `screenshot()` | `filename?, format?, quality?, type?` | 截图 |
| `setFullscreen()` | - | 进入全屏 |
| `exitFullscreen()` | - | 退出全屏 |
| `setMute(mute)` | `mute: boolean` | 设置静音状态 |
| `destroy()` | - | 销毁播放器 |

## 支持的格式

- **HLS** (`.m3u8`) - HTTP Live Streaming
- **FLV** (`.flv`) - 通过 WebSocket 的 Flash 视频
- **MP4** (`.mp4`) - 标准视频文件
- **WebM** (`.webm`) - WebM 视频文件

## 运行时资源

组件会自动加载 EasyPlayer 运行时资源：
- `EasyPlayer-lib.js` - 基础库
- `EasyPlayer-pro.js` - 专业版播放器
- `EasyPlayer-pro.wasm` - WebAssembly 模块

资源文件应放在部署目录的 `public/assets/easyplayer/` 下。可以自定义基础路径：

```vue
<EasyPlayer
  url="https://example.com/stream.m3u8"
  asset-base-url="https://cdn.example.com/easyplayer"
/>
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动演示
pnpm dev

# 启动文档
pnpm dev:docs

# 构建库和演示
pnpm build

# 构建文档
pnpm build:docs
```

## 构建和验证

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build:docs
pnpm publint
```

## 许可证

MIT
