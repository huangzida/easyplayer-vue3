# Examples

## Live Streaming

### HLS Live Stream

```vue
<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    :is-mute="true"
    :has-audio="true"
  />
</template>
```

### WebSocket FLV Stream

```vue
<template>
  <EasyPlayer
    url="ws://your-server:8080/live.flv"
    :is-live="true"
    :is-mute="false"
  />
</template>
```

## Video on Demand (VOD)

### MP4 Playback

```vue
<template>
  <EasyPlayer
    url="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    :is-live="false"
    :is-mute="false"
  />
</template>
```

### With Poster Image

```vue
<template>
  <EasyPlayer
    url="https://example.com/video.mp4"
    :is-live="false"
    poster="https://example.com/poster.jpg"
  />
</template>
```

## Advanced Usage

### Custom Styling

```vue
<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    class="custom-player"
    :style="{ width: '800px', height: '450px' }"
  />
</template>

<style>
.custom-player {
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

### Error Handling

```vue
<script setup lang="ts">
const handleError = (error: any) => {
  console.error('Player error:', error);
  // Show error message to user
};

const handleTimeout = () => {
  console.warn('Player timeout');
  // Attempt reconnection or show message
};
</script>

<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    @error="handleError"
    @timeout="handleTimeout"
  />
</template>
```

### Screenshot Feature

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const takeSnapshot = (format: 'jpeg' | 'png' = 'png') => {
  if (playerRef.value) {
    // Download as file
    playerRef.value.screenshot(`snapshot.${format}`, format, 0.92, 'download');

    // Or get as base64
    const base64 = playerRef.value.screenshot(undefined, format, 0.92, 'base64');
    console.log(base64);

    // Or get as blob
    const blob = playerRef.value.screenshot(undefined, format, 0.92, 'blob');
    console.log(blob);
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

    <button @click="takeSnapshot('png')">PNG</button>
    <button @click="takeSnapshot('jpeg')">JPEG</button>
  </div>
</template>
```

### Fullscreen Control

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const enterFullscreen = () => {
  playerRef.value?.setFullscreen();
};

const exitFullscreen = () => {
  playerRef.value?.exitFullscreen();
};
</script>

<template>
  <div>
    <EasyPlayer
      ref="playerRef"
      url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      :is-live="true"
    />

    <button @click="enterFullscreen">Fullscreen</button>
    <button @click="exitFullscreen">Exit Fullscreen</button>
  </div>
</template>
```

## Try It Out

Visit our [playground](/examples) to experiment with different configurations and see the player in action!
