<script setup lang="ts">
import { ref } from 'vue';
import type { PlayerMode } from '@/types';
import { EasyPlayer } from '@/index';
import type { EventHistory } from '@/types';

import PlayerConfig from '../components/PlayerConfig.vue';
import EventLog from '../components/EventLog.vue';
import StatusBadge from '../components/StatusBadge.vue';

const liveSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
// const vodSource = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
// const vodSource = 'http://localhost:3000/xgplayer-demo.mp4';
const vodSource = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const flvHint = 'ws://localhost:8080/live.flv';

const url = ref(vodSource);
const mode = ref<PlayerMode>('vod');
const poster = ref('');
const mse = ref(false);
const wcs = ref(false);
const wasm = ref(false);
const wasmSimd = ref(true);
const gpuDecoder = ref(false);
const webGpu = ref(false);
const canvasRender = ref(false);
const stretch = ref(false);
const isLive = ref(false);
const isMute = ref(false);
const hasAudio = ref(true);
const bufferTime = ref(1);
const loadTimeOut = ref(10);
const loadTimeReplay = ref(3);
const debug = ref(false);
const quality = ref<string[]>([]);
const defaultQuality = ref('');
const watermark = ref<any>(undefined);
const fallbackUrl = ref('');

const playerRef = ref<any>(null);
const eventHistory = ref<EventHistory[]>([]);

const usePreset = (preset: 'vod' | 'live' | 'flv') => {
  if (preset === 'live') {
    url.value = liveSource;
    mode.value = 'live';
    return;
  }

  if (preset === 'flv') {
    url.value = flvHint;
    mode.value = 'live';
    return;
  }

  url.value = vodSource;
  mode.value = 'vod';
};

const callApi = (action: string) => {
  const player = playerRef.value;
  if (!player) {
    console.warn('Player not ready');
    return;
  }

  switch (action) {
    case 'play':
      player.play(url.value);
      break;
    case 'pause':
      player.pause();
      break;
    case 'snapshot': {
      const result = player.screenshot();
      console.log('Snapshot taken:', typeof result);
      break;
    }
    case 'fullscreen':
      player.setFullscreen();
      break;
    case 'destroy':
      player.destroy();
      break;
  }
};

const handlePlayerReady = (player: any) => {
  console.log('Player ready', player);
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handlePlay = () => {
  console.log('Player started playing');
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleError = (error: any) => {
  console.error('Player error:', error);
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleTimeout = () => {
  console.warn('Player timeout');
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleLiveEnd = () => {
  console.log('Live stream ended');
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleVideoInfo = (info: any) => {
  console.log('Video info:', info);
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleAudioInfo = (info: any) => {
  console.log('Audio info:', info);
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleKBps = (speed: number) => {
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const handleTimestamps = (time: number) => {
  if (playerRef.value) {
    const history = playerRef.value.getEventHistory();
    eventHistory.value = [...history];
  }
};

const clearHistory = () => {
  if (playerRef.value) {
    playerRef.value.clearEventHistory();
  }
  eventHistory.value = [];
};
</script>

<template>
  <section class="feature-showcase">
    <div class="player-preview">
      <div class="player-header">
        <div class="player-status">
          <StatusBadge :label="mode" tone="sky" />
          <StatusBadge :label="stretch ? 'stretch' : 'contain'" tone="emerald" />
          <StatusBadge :label="isMute ? 'mute' : 'sound'" tone="rose" />
        </div>
        <div class="preset-buttons">
          <button class="preset-btn amber" @click="usePreset('vod')">MP4</button>
          <button class="preset-btn sky" @click="usePreset('live')">HLS</button>
          <button class="preset-btn rose" @click="usePreset('flv')">WS-FLV</button>
        </div>
      </div>
      <EasyPlayer
        ref="playerRef"
        :url="url"
        :mode="mode"
        :poster="poster"
        :mse="mse"
        :wcs="wcs"
        :wasm="wasm"
        :wasm-simd="wasmSimd"
        :gpu-decoder="gpuDecoder"
        :web-gpu="webGpu"
        :canvas-render="canvasRender"
        :stretch="stretch"
        :is-live="isLive"
        :is-mute="isMute"
        :has-audio="hasAudio"
        :buffer-time="bufferTime"
        :load-time-out="loadTimeOut"
        :load-time-replay="loadTimeReplay"
        :debug="debug"
        :quality="quality.length ? quality : undefined"
        :default-quality="defaultQuality || undefined"
        :watermark="watermark"
        :fallback-url="fallbackUrl || undefined"
        @player-ready="handlePlayerReady"
        @play="handlePlay"
        @error="handleError"
        @timeout="handleTimeout"
        @live-end="handleLiveEnd"
        @video-info="handleVideoInfo"
        @audio-info="handleAudioInfo"
        @k-bps="handleKBps"
        @timestamps="handleTimestamps"
      />
    </div>

    <div class="controls-section">
      <div class="controls-main">
        <PlayerConfig
          v-model:url="url"
          v-model:mode="mode"
          v-model:poster="poster"
          v-model:mse="mse"
          v-model:wcs="wcs"
          v-model:wasm="wasm"
          v-model:wasm-simd="wasmSimd"
          v-model:gpu-decoder="gpuDecoder"
          v-model:web-gpu="webGpu"
          v-model:canvas-render="canvasRender"
          v-model:stretch="stretch"
          v-model:is-live="isLive"
          v-model:is-mute="isMute"
          v-model:has-audio="hasAudio"
          v-model:buffer-time="bufferTime"
          v-model:load-time-out="loadTimeOut"
          v-model:load-time-replay="loadTimeReplay"
          v-model:debug="debug"
          v-model:quality="quality"
          v-model:default-quality="defaultQuality"
          v-model:watermark="watermark"
          v-model:fallback-url="fallbackUrl"
        />
      </div>

      <div class="controls-sidebar">
        <div class="instance-methods">
          <h3 class="section-title">Instance Methods</h3>
          <div class="method-grid">
            <button class="method-btn" @click="callApi('play')">play()</button>
            <button class="method-btn" @click="callApi('pause')">pause()</button>
            <button class="method-btn" @click="callApi('snapshot')">screenshot()</button>
            <button class="method-btn" @click="callApi('fullscreen')">setFullscreen()</button>
            <button class="method-btn" @click="callApi('destroy')">destroy()</button>
          </div>
        </div>

        <EventLog
          :events="eventHistory"
          :max-logs="50"
          @clear="clearHistory"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-showcase {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.player-preview {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.player-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.player-status {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preset-buttons {
  display: flex;
  gap: 8px;
}

.preset-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #0f172a;
}

.preset-btn.amber {
  background: rgba(251, 191, 36, 0.9);
}

.preset-btn.amber:hover {
  background: rgba(251, 191, 36, 1);
}

.preset-btn.sky {
  background: rgba(56, 189, 248, 0.9);
}

.preset-btn.sky:hover {
  background: rgba(56, 189, 248, 1);
}

.preset-btn.rose {
  background: rgba(251, 113, 133, 0.9);
}

.preset-btn.rose:hover {
  background: rgba(251, 113, 133, 1);
}

.controls-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

@media (max-width: 1200px) {
  .controls-section {
    grid-template-columns: 1fr;
  }
}

.controls-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.controls-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.instance-methods {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 16px 0;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.method-btn {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.method-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
}

.method-btn:active {
  transform: scale(0.98);
}
</style>
