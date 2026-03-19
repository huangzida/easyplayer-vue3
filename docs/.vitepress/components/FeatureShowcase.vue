<script setup lang="ts">
import { ref } from 'vue';

import { EasyPlayer } from '../../src/index';
import type { EasyPlayerInstance } from '../../src/types';

const liveSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const vodSource = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const source = ref(vodSource);
const isLive = ref(false);
const isMute = ref(true);

const usePreset = (preset: 'vod' | 'live') => {
  if (preset === 'live') {
    source.value = liveSource;
    isLive.value = true;
    return;
  }
  source.value = vodSource;
  isLive.value = false;
};
</script>

<template>
  <div class="feature-showcase">
    <div class="player-wrapper">
      <EasyPlayer
        :url="source"
        :is-live="isLive"
        :is-mute="isMute"
        :has-audio="true"
      />
    </div>
    <div class="controls">
      <button @click="usePreset('vod')">MP4 Demo</button>
      <button @click="usePreset('live')">HLS Live</button>
    </div>
  </div>
</template>

<style scoped>
.feature-showcase {
  padding: 1rem;
  background: #1a1a2e;
  border-radius: 12px;
  margin-top: 1rem;
}
.player-wrapper {
  width: 100%;
  max-width: 640px;
  height: 360px;
  margin: 0 auto;
}
.controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}
.controls button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: white;
  cursor: pointer;
}
</style>
