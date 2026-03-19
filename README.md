# easyplayer-vue3

`easyplayer-vue3` is a Vue 3 npm package that wraps EasyPlayerPro with a clean public API, typed instance methods, VitePress documentation, and a local playground.

## Highlights

- Clean props like `url`, `isLive`, `isMute`, and `stretch`.
- Emits events like `play`, `pause`, `error`, `timeout`, and `liveEnd`.
- Exposes typed imperative methods such as `play()`, `pause()`, `screenshot()`, and `setFullscreen()`.
- Supports HLS, FLV, MP4 and various streaming protocols.
- Publishes docs to GitHub Pages and packages to npm from GitHub Actions.

## Installation

```bash
npm install easyplayer-vue3
# or
yarn add easyplayer-vue3
# or
pnpm add easyplayer-vue3
```

## Quick Start

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

## Development

```bash
pnpm install
pnpm dev
pnpm dev:docs
```

## Build and verify

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm build:docs
pnpm publint
```

## Features

- **Multi-format support**: HLS, FLV, MP4, WebM
- **Rich API**: Playback control, screenshots, fullscreen, audio management
- **Typed**: Full TypeScript support with detailed type definitions
- **Events**: Comprehensive event system for player state changes

## Files worth editing in a fresh repo

- `package.json`
- `docs/.vitepress/config.ts`
- `playground/src/demos/FeatureShowcase.vue`
- `.github/workflows/pages.yml`
- `.github/workflows/release.yml`

## License

MIT
