# API Reference

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `url` | `string` | required | Stream or file URL |
| `isLive` | `boolean` | `true` | Live streaming mode |
| `hasAudio` | `boolean` | `true` | Parse audio track |
| `isMute` | `boolean` | `true` | Start muted |
| `stretch` | `boolean` | `false` | Stretch video to fill |
| `poster` | `string` | `undefined` | Poster image |
| `bufferTime` | `number` | `0.1` | Buffer duration in seconds |
| `loadTimeOut` | `number` | `undefined` | Load timeout in seconds |
| `loadTimeReplay` | `number` | `undefined` | Reconnection attempts (-1 for infinite) |
| `MSE` | `boolean` | `false` | MSE decoding mode |
| `WCS` | `boolean` | `false` | WCS decoding mode |
| `WASM` | `boolean` | `false` | WASM decoding mode |
| `WASMSIMD` | `boolean` | `true` | WASM SIMD mode |
| `gpuDecoder` | `boolean` | `undefined` | Hardware decoding |
| `webGPU` | `boolean` | `undefined` | WebGPU rendering |
| `canvasRender` | `boolean` | `undefined` | Canvas rendering |
| `debug` | `boolean` | `false` | Debug mode |
| `noSignalText` | `string` | `''` | No signal text |
| `class` | `string` | `''` | Custom class |
| `style` | `CSSProperties` | `{}` | Custom styles |

## Emits

| Event | Payload | Description |
| --- | --- | --- |
| `play` | - | Fired when playback starts |
| `pause` | - | Fired when playback pauses |
| `error` | `any` | Fired on player error |
| `timeout` | - | Fired on load timeout |
| `liveEnd` | - | Fired when live stream ends |
| `videoInfo` | `any` | Video metadata info |
| `audioInfo` | `any` | Audio metadata info |
| `timestamps` | `number` | Current playback time |
| `kBps` | `number` | Current network speed (KB/s) |
| `playerReady` | `EasyPlayerPro` | Player instance ready |

## Exposed methods

```ts
interface EasyPlayerInstance {
  getPlayer(): EasyPlayerPro | null;
  play(url: string): void;
  playback(url: string): void;
  pause(): void;
  screenshot(
    filename?: string,
    format?: 'jpeg' | 'png' | 'webp',
    quality?: number,
    type?: 'base64' | 'blob' | 'download',
  ): Blob | string | undefined;
  setFullscreen(): void;
  exitFullscreen(): void;
  setMute(mute: boolean): void;
  destroy(): void;
}
```

## Usage Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { EasyPlayer } from 'easyplayer-vue3';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);
const videoUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const handlePlay = () => {
  console.log('Player started playing');
};

const handleError = (error: any) => {
  console.error('Player error:', error);
};

const takeSnapshot = () => {
  if (playerRef.value) {
    const blob = playerRef.value.screenshot('snapshot', 'png', 0.92, 'download');
    console.log('Snapshot taken:', blob);
  }
};
</script>

<template>
  <EasyPlayer
    ref="playerRef"
    :url="videoUrl"
    :is-live="true"
    :is-mute="false"
    :has-audio="true"
    @play="handlePlay"
    @error="handleError"
  />

  <button @click="takeSnapshot">Take Snapshot</button>
</template>
```
