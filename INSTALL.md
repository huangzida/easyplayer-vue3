# Usage Guide

## Basic Usage (Recommended)

The package automatically loads the EasyPlayer runtime when needed. No manual setup required!

```typescript
import { createApp } from 'vue';
import EasyPlayer from 'easyplayer-vue3';
import 'easyplayer-vue3/style.css';

const app = createApp(App);
app.component('EasyPlayer', EasyPlayer);
```

**Or in SFC:**

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

## Global Plugin Installation

```typescript
import { createApp } from 'vue';
import EasyPlayer, { install } from 'easyplayer-vue3';
import 'easyplayer-vue3/style.css';

const app = createApp(App);
app.use(install);
```

## Manual Asset Loading (Advanced)

If you need to control where assets are hosted, you can provide a custom asset base URL:

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';

const customAssetBaseUrl = 'https://cdn.example.com/easyplayer-assets';
</script>

<template>
  <EasyPlayer
    url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :is-live="true"
    :asset-base-url="customAssetBaseUrl"
  />
</template>
```

## How It Works

1. **Automatic Detection**: When you import `easyplayer-vue3`, the component automatically loads runtime
2. **Runtime Loading**: Dynamically loads `EasyPlayer-lib.js` and `EasyPlayer-pro.js` before mounting
3. **Error Handling**: Logs errors to console if loading fails

## Browser Requirements

- Modern browsers with ES Module support
- JavaScript enabled
- Internet connection (for initial load)

## Troubleshooting

### Runtime Not Loading?

If you see errors like "Failed to load EasyPlayer runtime", check:

1. **Network Tab**: Ensure `EasyPlayer-lib.js` is being requested
2. **Console Errors**: Look for specific error messages
3. **Asset Path**: Verify assets are in `./assets/easyplayer/` relative to your deployment

### Custom Deployment?

If you deploy to a CDN or subdirectory, you may need to:

1. Copy the `assets/easyplayer/` folder to your deployment
2. Use the `assetBaseUrl` prop to point to the correct location

## CDN Usage

You can also use via CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/easyplayer-vue3/dist/index.css">
</head>
<body>
  <div id="app">
    <easy-player
      url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      :is-live="true"
    ></easy-player>
  </div>

  <script type="module">
    import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
    import EasyPlayer from 'https://unpkg.com/easyplayer-vue3/dist/index.js';

    const app = createApp({});
    app.component('easy-player', EasyPlayer);
    app.mount('#app');
  </script>
</body>
</html>
```

## API Reference

### Props

See [API Reference](https://github.com/huangzida/easyplayer-vue3/blob/main/docs/api-reference.md) for all available properties.

### Events

```vue
<EasyPlayer
  url="..."
  @ready="onReady"
  @error="onError"
  @play="onPlay"
  @pause="onPause"
  @live-end="onLiveEnd"
/>

<script setup>
const onReady = (player) => {
  console.log('Player ready!', player);
};

const onError = (error) => {
  console.error('Player error:', error);
};
</script>
```

### Methods

```vue
<script setup>
import { ref } from 'vue';
import { EasyPlayer } from 'easyplayer-vue3';

const playerRef = ref(null);

const play = () => playerRef.value?.play();
const pause = () => playerRef.value?.pause();
const screenshot = () => playerRef.value?.screenshot();
const fullscreen = () => playerRef.value?.setFullscreen();
</script>

<template>
  <EasyPlayer ref="playerRef" url="..." />
  <button @click="play">Play</button>
  <button @click="pause">Pause</button>
</template>
```
