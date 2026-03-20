# easyplayer-vue3

[English](./README.md) | [中文](./README.zh-CN.md)

Vue 3 component wrapper for EasyPlayerPro with typed props, events, and instance methods.

## Features

- **Multi-format support**: HLS, FLV, MP4, WebM, etc.
- **Rich controls**: Play, pause, screenshot, fullscreen, mute, etc.
- **Mode presets**: Built-in `vod` and `live` mode presets
- **Smart naming**: CamelCase API matching modern Vue/TypeScript conventions
- **Error retry**: Built-in exponential backoff retry strategy
- **Event history**: Records all events during playback
- **Full TypeScript support**: Complete type definitions
- **Flexible deployment**: Custom CDN resource path support

## Installation

```bash
npm install easyplayer-vue3
# or
yarn add easyplayer-vue3
# or
pnpm add easyplayer-vue3
```

## Quick Start

### Basic Usage

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
</script>

<template>
  <EasyPlayer url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
</template>
```

### Mode Presets

```vue
<!-- Live scenario - default to live mode -->
<EasyPlayer url="live.m3u8" mode="live" />

<!-- VOD scenario -->
<EasyPlayer url="video.mp4" mode="vod" />

<!-- Custom parameters -->
<EasyPlayer
  url="live.m3u8"
  mode="custom"
  :mse="true"
  :debug="true"
/>
```

### Live with Watermark

```vue
<EasyPlayer
  url="live.m3u8"
  mode="live"
  :watermark="{
    text: { content: 'Watermark' },
    right: 10,
    top: 10
  }"
/>
```

### Quality Switching

```vue
<EasyPlayer
  url="video.mp4"
  mode="vod"
  :quality="['SD', 'HD', 'FHD']"
  default-quality="HD"
/>
```

### Error Retry Configuration

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
      <p>Playback failed: {{ error }}</p>
      <button @click="retry">Retry</button>
    </div>
  </template>
</EasyPlayer>
```

## API Reference

### Props

#### Mode Presets

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'vod' \| 'live' \| 'custom'` | `'live'` | Playback mode preset |

**Mode preset parameters**:

- **vod**: `isLive: false, bufferTime: 1, controlsVisible: true`
- **live**: `isLive: true, bufferTime: 0.2, controlsVisible: false` (default)

#### Basic Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | required | Video stream or file URL |
| `poster` | `string` | - | Cover image URL |
| `noSignalText` | `string` | `''` | No signal text |

#### Decode Parameters (CamelCase)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mse` | `boolean` | `false` | MSE decode mode |
| `wcs` | `boolean` | `false` | WCS decode mode |
| `wasm` | `boolean` | `false` | WASM decode mode |
| `wasmSimd` | `boolean` | `true` | WASM SIMD mode |
| `gpuDecoder` | `boolean` | - | Hardware decode |

#### Render Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `webGpu` | `boolean` | - | WebGPU render |
| `canvasRender` | `boolean` | - | Canvas render |
| `stretch` | `boolean` | `false` | Stretch to fill |
| `controlsVisible` | `boolean` | `false` | Show/hide control bar (true = show, false = hide) |

#### Playback Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLive` | `boolean` | `false` | Live mode (overridden by mode preset) |
| `isMute` | `boolean` | `false` | Initial mute state |
| `hasAudio` | `boolean` | `true` | Parse audio track |
| `bufferTime` | `number` | `1` | Buffer duration in seconds (overridden by mode preset) |

#### Advanced Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loadTimeOut` | `number` | - | Load timeout in seconds |
| `loadTimeReplay` | `number` | - | Reconnect attempts |
| `debug` | `boolean` | `false` | Debug mode |

#### Feature Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quality` | `string[]` | - | Quality levels |
| `defaultQuality` | `string` | - | Default quality |
| `watermark` | `WatermarkConfig` | - | Watermark config |
| `fullWatermark` | `FullWatermarkConfig` | - | Fullscreen watermark |
| `fallbackUrl` | `string` | - | Fallback URL |

#### Retry Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `retry.maxRetries` | `number` | `3` | Max retry attempts |
| `retry.retryDelay` | `number` | `1000` | Retry delay in ms |
| `retry.exponentialBackoff` | `boolean` | `true` | Exponential backoff |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `play` | - | Fired when playback starts |
| `pause` | - | Fired when playback pauses |
| `error` | `any` | Fired on player error |
| `timeout` | - | Fired on load timeout |
| `liveEnd` | - | Fired when live stream ends |
| `videoInfo` | `any` | Video information |
| `audioInfo` | `any` | Audio information |
| `playerReady` | `EasyPlayerPro` | Player instance ready |
| `kBps` | `number` | Current network speed |
| `timestamps` | `number` | Current playback timestamp |

### Instance Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `getPlayer()` | - | Get underlying player instance |
| `play(url)` | `url: string` | Start playing specified URL |
| `playback(url)` | `url: string` | Start VOD playback |
| `pause()` | - | Pause playback |
| `screenshot()` | `filename?, format?, quality?, type?` | Take screenshot |
| `setFullscreen()` | - | Enter fullscreen |
| `exitFullscreen()` | - | Exit fullscreen |
| `setMute(mute)` | `mute: boolean` | Set mute state |
| `setQuality(quality)` | `quality: string` | Set quality level |
| `seekTime(time)` | `time: number` | Seek to time |
| `retry()` | - | Manual retry |
| `getEventHistory()` | - | Get event history |
| `clearEventHistory()` | - | Clear event history |
| `destroy()` | - | Destroy player |

### Slots

| Name | Scoped | Description |
|------|--------|-------------|
| `error` | `{ error, retry }` | Error state slot |

## Naming Convention

EasyPlayer.js native parameters use PascalCase/ALL_CAPS, Vue component converts to camelCase:

| EasyPlayer.js | Vue Props |
|---------------|-----------|
| MSE | `mse` |
| WCS | `wcs` |
| WASM | `wasm` |
| WASMSIMD | `wasmSimd` |
| webGPU | `webGpu` |
| loadTimeOut | `loadTimeOut` |
| loadTimeReplay | `loadTimeReplay` |

## Supported Formats

- **HLS** (`.m3u8`) - HTTP Live Streaming
- **FLV** (`.flv`) - Flash Video via WebSocket
- **MP4** (`.mp4`) - Standard video file
- **WebM** (`.webm`) - WebM video file

## Runtime Resources

The component automatically loads EasyPlayer runtime resources:
- `EasyPlayer-lib.js` - Base library
- `EasyPlayer-decode.js` - MSE Decode library
- `EasyPlayer-pro.js` - Pro player
- `EasyPlayer-pro.wasm` - WebAssembly module

Resource files should be placed in `public/assets/easyplayer/` of your deployment. You can customize the base path:

```vue
<EasyPlayer
  url="https://example.com/stream.m3u8"
  assetBaseUrl="https://cdn.example.com/easyplayer"
/>
```

## Development

```bash
# Install dependencies
pnpm install

# Start demo
pnpm dev

# Start docs
pnpm dev:docs

# Build library and demo
pnpm build

# Build docs
pnpm build:docs
```

## Build & Validate

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build:docs
pnpm publint
```

## License

MIT
