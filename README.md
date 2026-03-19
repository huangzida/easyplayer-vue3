# easyplayer-vue3

A Vue 3 component wrapper for EasyPlayerPro with typed props, events, and instance methods.

## Features

- **Multi-format support**: HLS, FLV, MP4, WebM and more
- **Rich controls**: Play, pause, screenshot, fullscreen, mute, and more
- **Typed API**: Full TypeScript support with complete type definitions
- **Event system**: Comprehensive events for player state changes
- **Auto runtime loading**: Automatically loads EasyPlayer runtime assets
- **Flexible deployment**: Supports custom asset base URLs for CDN hosting

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
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
  />
</template>
```

### With Event Handlers

```vue
<script setup lang="ts">
const handlePlay = () => {
  console.log('Player started');
};

const handleError = (error: any) => {
  console.error('Player error:', error);
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

### Using Instance Methods

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const takeSnapshot = () => {
  if (playerRef.value) {
    playerRef.value.screenshot('snapshot', 'png', 0.92, 'download');
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
    <button @click="takeSnapshot">Take Snapshot</button>
  </div>
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | required | Video stream or file URL |
| `isLive` | `boolean` | `true` | Live streaming mode |
| `hasAudio` | `boolean` | `true` | Parse audio track |
| `isMute` | `boolean` | `true` | Start muted |
| `stretch` | `boolean` | `false` | Stretch video to fill container |
| `poster` | `string` | - | Poster image URL |
| `bufferTime` | `number` | `0.1` | Buffer duration in seconds |
| `MSE` | `boolean` | `false` | MSE decoding mode |
| `WCS` | `boolean` | `false` | WCS decoding mode |
| `WASM` | `boolean` | `false` | WASM decoding mode |
| `WASMSIMD` | `boolean` | `true` | WASM SIMD mode |
| `gpuDecoder` | `boolean` | - | Hardware decoding |
| `webGPU` | `boolean` | - | WebGPU rendering |
| `canvasRender` | `boolean` | - | Canvas rendering |
| `debug` | `boolean` | `false` | Debug mode |
| `noSignalText` | `string` | `''` | No signal text |
| `class` | `string` | `''` | Custom class |
| `style` | `CSSProperties` | `{}` | Custom styles |
| `assetBaseUrl` | `string` | `''` | Runtime assets base URL |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `play` | - | Fired when playback starts |
| `pause` | - | Fired when playback pauses |
| `error` | `any` | Fired on player error |
| `timeout` | - | Fired on load timeout |
| `liveEnd` | - | Fired when live stream ends |
| `videoInfo` | `any` | Video metadata info |
| `audioInfo` | `any` | Audio metadata info |
| `playerReady` | `EasyPlayerPro` | Player instance ready |

### Instance Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `getPlayer()` | - | Get the underlying player instance |
| `play(url)` | `url: string` | Start playing a URL |
| `playback(url)` | `url: string` | Start VOD playback |
| `pause()` | - | Pause playback |
| `screenshot()` | `filename?, format?, quality?, type?` | Take a screenshot |
| `setFullscreen()` | - | Enter fullscreen |
| `exitFullscreen()` | - | Exit fullscreen |
| `setMute(mute)` | `mute: boolean` | Set mute state |
| `destroy()` | - | Destroy the player |

## Supported Formats

- **HLS** (`.m3u8`) - HTTP Live Streaming
- **FLV** (`.flv`) - Flash Video via WebSocket
- **MP4** (`.mp4`) - Standard video files
- **WebM** (`.webm`) - WebM video files

## Runtime Assets

The component automatically loads EasyPlayer runtime assets:
- `EasyPlayer-lib.js` - Base library
- `EasyPlayer-pro.js` - Professional player
- `EasyPlayer-pro.wasm` - WebAssembly module

Assets are expected at `public/assets/easyplayer/` relative to your deployment. You can customize the base URL:

```vue
<EasyPlayer
  url="https://example.com/stream.m3u8"
  asset-base-url="https://cdn.example.com/easyplayer"
/>
```

## Development

```bash
# Install dependencies
pnpm install

# Start playground
pnpm dev

# Start docs
pnpm dev:docs

# Build library and playground
pnpm build

# Build docs
pnpm build:docs
```

## Build & Verify

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
