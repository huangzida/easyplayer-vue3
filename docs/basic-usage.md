# Basic Usage

## Installation

```bash
npm install easyplayer-vue3
# or
yarn add easyplayer-vue3
# or
pnpm add easyplayer-vue3
```

## Quick Start

### Basic Live Stream

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

### VOD Playback

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
</script>

<template>
  <EasyPlayer
    url="https://example.com/video.mp4"
    :is-live="false"
    :is-mute="false"
  />
</template>
```

### With Event Handlers

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';

const handlePlay = () => {
  console.log('Playback started');
};

const handleError = (error: any) => {
  console.error('Player error:', error);
};

const handleLiveEnd = () => {
  console.log('Live stream ended');
};
</script>

<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    @play="handlePlay"
    @error="handleError"
    @live-end="handleLiveEnd"
  />
</template>
```

### Using Player Instance Methods

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { EasyPlayer } from 'easyplayer-vue3';
import type { EasyPlayerInstance } from 'easyplayer-vue3';

const playerRef = ref<EasyPlayerInstance | null>(null);

const takeSnapshot = () => {
  if (playerRef.value) {
    const blob = playerRef.value.screenshot('snapshot', 'png', 0.92, 'download');
    console.log('Snapshot:', blob);
  }
};

const toggleMute = () => {
  if (playerRef.value) {
    playerRef.value.setMute(!playerRef.value.getPlayer()?.isMute());
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

    <button @click="takeSnapshot">Snapshot</button>
    <button @click="toggleMute">Toggle Mute</button>
  </div>
</template>
```

## Supported Formats

- **HLS** (`.m3u8`) - HTTP Live Streaming
- **FLV** (`.flv`) - Flash Video via WebSocket
- **MP4** (`.mp4`) - Standard video files
- **WebM** (`.webm`) - WebM video files

## Next Steps

- Check the [API Reference](/api-reference) for complete documentation
- See [Examples](/examples) for more use cases
