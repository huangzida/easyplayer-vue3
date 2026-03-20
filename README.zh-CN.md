# easyplayer-vue3

[English](./README.md) | [中文](./README.zh-CN.md)

基于 EasyPlayerPro 的 Vue 3 组件封装，提供类型化的 props、事件和实例方法。

## 特性

- **多格式支持**: HLS、FLV、MP4、WebM 等
- **丰富的控制**: 播放、暂停、截图、全屏、静音等
- **模式预设**: 支持 `vod` 点播和 `live` 直播模式预设
- **智能命名**: 小驼峰命名的 API，与现代 Vue/TypeScript 规范一致
- **错误重试**: 内置指数退避重试策略
- **事件历史**: 记录播放过程中的所有事件
- **类型化 API**: 完整的 TypeScript 支持
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
  <EasyPlayer url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
</template>
```

### 模式预设

```vue
<!-- 点播场景 - 默认使用 vod 模式 -->
<EasyPlayer url="video.mp4" mode="vod" />

<!-- 直播场景 -->
<EasyPlayer url="live.m3u8" mode="live" />

<!-- 自定义参数 -->
<EasyPlayer
  url="live.m3u8"
  mode="custom"
  :mse="true"
  :debug="true"
/>
```

### 带水印的直播

```vue
<EasyPlayer
  url="live.m3u8"
  mode="live"
  :watermark="{
    text: { content: '水印' },
    right: 10,
    top: 10
  }"
/>
```

### 带清晰度切换

```vue
<EasyPlayer
  url="video.mp4"
  mode="vod"
  :quality="['普清', '高清', '超清']"
  default-quality="高清"
/>
```

### 错误重试配置

```vue
<EasyPlayer
  url="video.mp4"
  mode="vod"
  :retry="{ maxRetries: 5, retryDelay: 1000 }"
  :fallback-url="backupUrl"
  @error="handleError"
>
  <template #error="{ error, retry }">
    <div class="player-error">
      <p>播放失败: {{ error }}</p>
      <button @click="retry">重试</button>
    </div>
  </template>
</EasyPlayer>
```

## API 参考

### Props 属性

#### 模式预设

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | `'vod' \| 'live' \| 'custom'` | `'vod'` | 播放模式预设 |

**模式预设参数**:

- **vod**: `isLive: false, bufferTime: 1`
- **live**: `isLive: true, bufferTime: 0.2`

#### 基础参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string` | 必填 | 视频流或文件地址 |
| `poster` | `string` | - | 封面图片地址 |
| `noSignalText` | `string` | `''` | 无信号提示文字 |

#### 解码参数（小驼峰命名）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mse` | `boolean` | `false` | MSE 解码模式 |
| `wcs` | `boolean` | `false` | WCS 解码模式 |
| `wasm` | `boolean` | `false` | WASM 解码模式 |
| `wasmSimd` | `boolean` | `true` | WASM SIMD 模式 |
| `gpuDecoder` | `boolean` | - | 硬件解码 |

#### 渲染参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `webGpu` | `boolean` | - | WebGPU 渲染 |
| `canvasRender` | `boolean` | - | Canvas 渲染 |
| `stretch` | `boolean` | `false` | 拉伸填充容器 |

#### 播放参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isLive` | `boolean` | `false` | 直播模式（mode 预设覆盖） |
| `isMute` | `boolean` | `false` | 初始静音 |
| `hasAudio` | `boolean` | `true` | 解析音频轨道 |
| `bufferTime` | `number` | `1` | 缓冲时长（秒，mode 预设覆盖） |

#### 高级参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadTimeOut` | `number` | - | 加载超时（秒） |
| `loadTimeReplay` | `number` | - | 重连次数 |
| `debug` | `boolean` | `false` | 调试模式 |

#### 实用功能

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `quality` | `string[]` | - | 清晰度列表 |
| `defaultQuality` | `string` | - | 默认清晰度 |
| `watermark` | `WatermarkConfig` | - | 水印配置 |
| `fullWatermark` | `FullWatermarkConfig` | - | 全屏水印配置 |
| `fallbackUrl` | `string` | - | 备用地址 |

#### 错误重试

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `retry.maxRetries` | `number` | `3` | 最大重试次数 |
| `retry.retryDelay` | `number` | `1000` | 重试延迟（毫秒） |
| `retry.exponentialBackoff` | `boolean` | `true` | 指数退避 |

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
| `kBps` | `number` | 当前网速 |
| `timestamps` | `number` | 当前播放时间戳 |

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
| `setQuality(quality)` | `quality: string` | 设置清晰度 |
| `seekTime(time)` | `time: number` | 跳转到指定时间 |
| `retry()` | - | 手动重试播放 |
| `getEventHistory()` | - | 获取事件历史记录 |
| `clearEventHistory()` | - | 清空事件历史 |
| `destroy()` | - | 销毁播放器 |

### Slots 插槽

| 名称 | 作用域 | 说明 |
|------|--------|------|
| `error` | `{ error, retry }` | 错误状态插槽 |

## 命名转换

EasyPlayer.js 原生参数使用大驼峰/全大写，Vue 组件层转换为小驼峰：

| EasyPlayer.js | Vue Props |
|---------------|-----------|
| MSE | `mse` |
| WCS | `wcs` |
| WASM | `wasm` |
| WASMSIMD | `wasmSimd` |
| webGPU | `webGpu` |
| loadTimeOut | `loadTimeOut` |
| loadTimeReplay | `loadTimeReplay` |

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
  assetBaseUrl="https://cdn.example.com/easyplayer"
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
