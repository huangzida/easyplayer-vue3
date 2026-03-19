# Getting Started

`easyplayer-vue3` is a Vue 3 wrapper around EasyPlayerPro with a clean API, typed instance methods, and a docs-plus-playground workflow.

## What this package focuses on

- Live and replay playback with a Vue-friendly prop surface.
- Typed imperative controls such as `play()`, `screenshot()`, and `setFullscreen()`.
- Comprehensive event system for player state changes.
- Reusable docs/demo setup for GitHub Pages and local iteration.

## Quick preview

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
</script>

<template>
  <EasyPlayer
    url="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    :is-live="false"
  />
</template>
```
