<script setup lang="ts">
import { ref } from 'vue';
import type { PlayerMode } from '@/types';

interface ConfigProps {
  url: string;
  mode: PlayerMode;
  poster?: string;
  mse: boolean;
  wcs: boolean;
  wasm: boolean;
  wasmSimd: boolean;
  gpuDecoder: boolean;
  webGpu: boolean;
  canvasRender: boolean;
  stretch: boolean;
  isLive: boolean;
  isMute: boolean;
  hasAudio: boolean;
  bufferTime: number;
  loadTimeOut: number;
  loadTimeReplay: number;
  debug: boolean;
  quality?: string[];
  defaultQuality?: string;
  watermark?: any;
  fallbackUrl?: string;
  controlsVisible: boolean;
}

const props = defineProps<ConfigProps>();
const emit = defineEmits<{
  (e: 'update:url', value: string): void;
  (e: 'update:mode', value: PlayerMode): void;
  (e: 'update:poster', value?: string): void;
  (e: 'update:mse', value: boolean): void;
  (e: 'update:wcs', value: boolean): void;
  (e: 'update:wasm', value: boolean): void;
  (e: 'update:wasmSimd', value: boolean): void;
  (e: 'update:gpuDecoder', value: boolean): void;
  (e: 'update:webGpu', value: boolean): void;
  (e: 'update:canvasRender', value: boolean): void;
  (e: 'update:stretch', value: boolean): void;
  (e: 'update:isLive', value: boolean): void;
  (e: 'update:isMute', value: boolean): void;
  (e: 'update:hasAudio', value: boolean): void;
  (e: 'update:bufferTime', value: number): void;
  (e: 'update:loadTimeOut', value: number): void;
  (e: 'update:loadTimeReplay', value: number): void;
  (e: 'update:debug', value: boolean): void;
  (e: 'update:quality', value?: string[]): void;
  (e: 'update:defaultQuality', value?: string): void;
  (e: 'update:watermark', value?: any): void;
  (e: 'update:fallbackUrl', value?: string): void;
  (e: 'update:controlsVisible', value: boolean): void;
}>();

const activeTab = ref<'basic' | 'decode' | 'render' | 'playback' | 'advanced' | 'feature'>('basic');

const presets = [
  { label: 'Vod', mode: 'vod' as PlayerMode },
  { label: 'Live', mode: 'live' as PlayerMode },
  { label: 'Custom', mode: 'custom' as PlayerMode },
];

const usePreset = (mode: PlayerMode) => {
  emit('update:mode', mode);
  
  if (mode === 'vod') {
    emit('update:controlsVisible', true);
  } else if (mode === 'live') {
    emit('update:controlsVisible', false);
  }
};
</script>

<template>
  <div class="player-config">
    <div class="config-header">
      <div class="config-tabs">
        <button
          v-for="tab in ['basic', 'decode', 'render', 'playback', 'advanced', 'feature']"
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="activeTab = tab as any"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <div class="config-content">
      <div v-show="activeTab === 'basic'" class="config-section">
        <h3 class="section-title">Basic Parameters</h3>
        <div class="config-grid">
          <div class="config-item">
            <label>URL</label>
            <input
              type="text"
              :value="props.url"
              placeholder="Enter video URL"
              @input="emit('update:url', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="config-item">
            <label>Mode</label>
            <div class="mode-buttons">
              <button
                v-for="preset in presets"
                :key="preset.label"
                :class="['mode-btn', { active: props.mode === preset.mode }]"
                @click="usePreset(preset.mode)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
          <div class="config-item">
            <label>Poster</label>
            <input
              type="text"
              :value="props.poster || ''"
              placeholder="Cover image URL"
              @input="emit('update:poster', ($event.target as HTMLInputElement).value || undefined)"
            />
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'decode'" class="config-section">
        <h3 class="section-title">Decode Parameters</h3>
        <div class="config-grid">
          <div class="config-item switch">
            <label>MSE Decode</label>
            <input
              type="checkbox"
              :checked="props.mse"
              @change="emit('update:mse', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>WCS Decode</label>
            <input
              type="checkbox"
              :checked="props.wcs"
              @change="emit('update:wcs', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>WASM Decode</label>
            <input
              type="checkbox"
              :checked="props.wasm"
              @change="emit('update:wasm', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>WASM SIMD</label>
            <input
              type="checkbox"
              :checked="props.wasmSimd"
              @change="emit('update:wasmSimd', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>GPU Decoder</label>
            <input
              type="checkbox"
              :checked="props.gpuDecoder"
              @change="emit('update:gpuDecoder', ($event.target as HTMLInputElement).checked)"
            />
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'render'" class="config-section">
        <h3 class="section-title">Render Parameters</h3>
        <div class="config-grid">
          <div class="config-item switch">
            <label>WebGPU Render</label>
            <input
              type="checkbox"
              :checked="props.webGpu"
              @change="emit('update:webGpu', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>Canvas Render</label>
            <input
              type="checkbox"
              :checked="props.canvasRender"
              @change="emit('update:canvasRender', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>Stretch</label>
            <input
              type="checkbox"
              :checked="props.stretch"
              @change="emit('update:stretch', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>Controls Visible</label>
            <input
              type="checkbox"
              :checked="props.controlsVisible"
              @change="emit('update:controlsVisible', ($event.target as HTMLInputElement).checked)"
            />
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'playback'" class="config-section">
        <h3 class="section-title">Playback Parameters</h3>
        <div class="config-grid">
          <div class="config-item switch">
            <label>Is Live</label>
            <input
              type="checkbox"
              :checked="props.isLive"
              @change="emit('update:isLive', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>Is Mute</label>
            <input
              type="checkbox"
              :checked="props.isMute"
              @change="emit('update:isMute', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item switch">
            <label>Has Audio</label>
            <input
              type="checkbox"
              :checked="props.hasAudio"
              @change="emit('update:hasAudio', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item">
            <label>Buffer Time</label>
            <input
              type="number"
              :value="props.bufferTime"
              step="0.1"
              min="0"
              @input="emit('update:bufferTime', parseFloat(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'advanced'" class="config-section">
        <h3 class="section-title">Advanced Parameters</h3>
        <div class="config-grid">
          <div class="config-item">
            <label>Load Timeout (s)</label>
            <input
              type="number"
              :value="props.loadTimeOut"
              min="1"
              @input="emit('update:loadTimeOut', parseInt(($event.target as HTMLInputElement).value))"
            />
          </div>
          <div class="config-item">
            <label>Retry Count</label>
            <input
              type="number"
              :value="props.loadTimeReplay"
              min="-1"
              @input="emit('update:loadTimeReplay', parseInt(($event.target as HTMLInputElement).value))"
            />
          </div>
          <div class="config-item switch">
            <label>Debug Mode</label>
            <input
              type="checkbox"
              :checked="props.debug"
              @change="emit('update:debug', ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div class="config-item">
            <label>Fallback URL</label>
            <input
              type="text"
              :value="props.fallbackUrl || ''"
              placeholder="Backup video URL"
              @input="emit('update:fallbackUrl', ($event.target as HTMLInputElement).value || undefined)"
            />
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'feature'" class="config-section">
        <h3 class="section-title">Feature Parameters</h3>
        <div class="config-grid">
          <div class="config-item">
            <label>Quality Levels</label>
            <input
              type="text"
              :value="props.quality?.join(', ') || ''"
              placeholder="普清, 高清, 超清"
              @input="emit('update:quality', ($event.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean))"
            />
          </div>
          <div class="config-item">
            <label>Default Quality</label>
            <input
              type="text"
              :value="props.defaultQuality || ''"
              placeholder="高清"
              @input="emit('update:defaultQuality', ($event.target as HTMLInputElement).value || undefined)"
            />
          </div>
          <div class="config-item">
            <label>Watermark Config</label>
            <textarea
              :value="props.watermark ? JSON.stringify(props.watermark) : ''"
              placeholder="{&quot;text&quot;:{&quot;content&quot;:&quot;水印&quot;},&quot;right&quot;:10,&quot;top&quot;:10}"
              rows="3"
              @input="emit('update:watermark', ($event.target as HTMLTextAreaElement).value ? JSON.parse(($event.target as HTMLTextAreaElement).value) : undefined)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-config {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.config-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.config-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.tab-btn.active {
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.5);
  color: #fbbf24;
}

.config-content {
  padding: 20px;
}

.config-section {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 16px 0;
}

.config-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-item input[type='text'],
.config-item input[type='number'],
.config-item textarea {
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.config-item input[type='text']:focus,
.config-item input[type='number']:focus,
.config-item textarea:focus {
  border-color: rgba(251, 191, 36, 0.5);
}

.config-item input[type='text']::placeholder,
.config-item textarea::placeholder {
  color: #64748b;
}

.config-item input[type='number'] {
  width: 100%;
}

.config-item textarea {
  resize: vertical;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.config-item.switch {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.config-item.switch label {
  text-transform: none;
  letter-spacing: normal;
  font-size: 14px;
  color: #e2e8f0;
}

.config-item.switch input[type='checkbox'] {
  width: 48px;
  height: 26px;
  appearance: none;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 13px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.config-item.switch input[type='checkbox']::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #94a3b8;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.config-item.switch input[type='checkbox']:checked {
  background: rgba(251, 191, 36, 0.3);
  border-color: rgba(251, 191, 36, 0.5);
}

.config-item.switch input[type='checkbox']:checked::before {
  background: #fbbf24;
  transform: translateX(22px);
}

.mode-buttons {
  display: flex;
  gap: 8px;
}

.mode-btn {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.mode-btn.active {
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.5);
  color: #38bdf8;
}
</style>
