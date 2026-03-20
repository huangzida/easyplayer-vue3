<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import type {
  EasyPlayerEmits,
  EasyPlayerInstance,
  EasyPlayerProps,
  EventHistory,
  RetryConfig,
} from '../../types';
import type { EasyPlayerPro } from '../../types';

import { isUndefined, omitBy } from 'es-toolkit';

import { ensureEasyPlayerRuntime } from '../../runtime/asset-loader';

defineOptions({ name: 'EasyPlayer' });

const props = withDefaults(defineProps<EasyPlayerProps>(), {
  wasmSimd: true,
  wasm: false,
  mse: false,
  wcs: false,
  bufferTime: 0.2,
  stretch: false,
  isLive: true,
  hasAudio: true,
  isMute: false,
  noSignalText: '',
  mode: 'live',
  class: '',
  style: () => ({}),
  assetBaseUrl: '',
  controlsVisible: false,
});

const emit = defineEmits<EasyPlayerEmits>();

const playerRef = ref<HTMLDivElement>();
const playerInstanceRef = ref<EasyPlayerPro | null>(null);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

const retryCount = ref(0);
const retryTimer = ref<number | null>(null);
const currentUrl = ref('');

const eventHistory = ref<EventHistory[]>([]);
const playerTimer = ref<number | null>(null);

const vodPreset = {
  isLive: false,
  bufferTime: 1,
  controlsVisible: true,
};

const livePreset = {
  isLive: true,
  bufferTime: 0.2,
  controlsVisible: false,
};

const recordEvent = (event: string, data?: any) => {
  eventHistory.value = [
    {
      timestamp: Date.now(),
      event,
      data,
    },
    ...eventHistory.value,
  ].slice(0, 100);
};

const getEventHistory = (): EventHistory[] => {
  return eventHistory.value;
};

const clearEventHistory = () => {
  eventHistory.value = [];
};

const effectiveConfig = computed(() => {
  const modePreset =
    props.mode === 'live'
      ? livePreset
      : props.mode === 'custom'
        ? {}
        : vodPreset;

  const userOverrides = omitBy(
    {
      isLive: props.isLive,
      bufferTime: props.bufferTime,
    },
    isUndefined,
  );

  return {
    ...modePreset,
    ...userOverrides,
  };
});

const transformToNativeConfig = (config: any) => {
  const nativeConfig: any = { ...config };

  if (config.mse !== undefined) {
    nativeConfig.MSE = config.mse;
    delete nativeConfig.mse;
  }
  if (config.wcs !== undefined) {
    nativeConfig.WCS = config.wcs;
    delete nativeConfig.wcs;
  }
  if (config.wasm !== undefined) {
    nativeConfig.WASM = config.wasm;
    delete nativeConfig.wasm;
  }
  if (config.wasmSimd !== undefined) {
    nativeConfig.WASMSIMD = config.wasmSimd;
    delete nativeConfig.wasmSimd;
  }
  if (config.webGpu !== undefined) {
    nativeConfig.webGPU = config.webGpu;
    delete nativeConfig.webGpu;
  }

  return nativeConfig;
};

const playerConfig = computed(() => {
  const config = omitBy(
    {
      ...effectiveConfig.value,
      hasAudio: props.hasAudio,
      isMute: props.isMute,
      stretch: props.stretch,
      poster: props.poster,
      loadTimeOut: props.loadTimeOut,
      loadTimeReplay: props.loadTimeReplay,
      debug: props.debug,
      mse: props.mse,
      wcs: props.wcs,
      wasm: props.wasm,
      wasmSimd: props.wasmSimd,
      gpuDecoder: props.gpuDecoder,
      webGpu: props.webGpu,
      canvasRender: props.canvasRender,
      watermark: props.watermark,
      fullWatermark: props.fullWatermark,
      quality: props.quality,
    },
    isUndefined,
  );

  return transformToNativeConfig(config);
});

const getRetryConfig = (): RetryConfig => {
  return (
    props.retry || {
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
    }
  );
};

const retry = (skipInitialRetry = false) => {
  if (skipInitialRetry && retryCount.value === 0) {
    console.warn('Skipping initial retry as requested');
    return;
  }

  const retryConfig = getRetryConfig();
  const maxRetries = retryConfig.maxRetries ?? 3;

  if (retryCount.value >= maxRetries) {
    console.warn('Max retries reached');
    hasError.value = true;
    emit('error', new Error('Max retries reached'));
    return;
  }

  retryCount.value++;
  const delay = retryConfig.exponentialBackoff
    ? (retryConfig.retryDelay ?? 1000) * Math.pow(2, retryCount.value - 1)
    : retryConfig.retryDelay ?? 1000;

  console.log(
    `Retrying in ${delay}ms (attempt ${retryCount.value}/${maxRetries})`,
  );

  retryTimer.value = window.setTimeout(async () => {
    if (props.fallbackUrl && retryCount.value > 1) {
      await playUrl(props.fallbackUrl);
    } else {
      await playUrl(currentUrl.value);
    }
  }, delay);
};

const destroyPlayer = async () => {
  if (playerTimer.value) {
    clearInterval(playerTimer.value);
    playerTimer.value = null;
  }

  if (retryTimer.value) {
    clearTimeout(retryTimer.value);
    retryTimer.value = null;
  }

  if (playerInstanceRef.value) {
    try {
      await playerInstanceRef.value.destroy();
      playerInstanceRef.value = null;
      console.log('EasyPlayer destroyed');
    } catch (error) {
      console.error('EasyPlayer destroy error:', error);
    }
  }
};

const handleEvents = (player: EasyPlayerPro) => {
  player.on('play', () => {
    recordEvent('play');
    emit('play');
    retryCount.value = 0;
    hasError.value = false;
  });

  player.on('pause', () => {
    recordEvent('pause');
    emit('pause');
  });

  player.on('error', (error: any) => {
    console.error('EasyPlayer error:', error);
    recordEvent('error', error);
    
    const isNotAllowedError = error?.message?.includes('NotAllowedError') || error?.name === 'NotAllowedError';
    const isOOMError = error?.message?.includes('OOM') || String(error).includes('Aborted(OOM)');
    
    if (isNotAllowedError) {
      errorMessage.value = '需要用户交互才能播放音频/视频，请点击页面或播放按钮';
      console.warn('Autoplay blocked - user interaction required');
    } else if (isOOMError) {
      errorMessage.value = '播放器内存不足，请尝试关闭其他标签页或刷新页面';
      console.warn('WASM out of memory error');
    } else {
      errorMessage.value = String(error);
    }
    
    hasError.value = true;
    emit('error', error);

    if (isNotAllowedError) {
      return;
    }

    const retryConfig = getRetryConfig();
    if (retryConfig.maxRetries && retryConfig.maxRetries > 0) {
      retry(false);
    }
  });

  player.on('timeout', () => {
    console.warn('EasyPlayer timeout');
    recordEvent('timeout');
    emit('timeout');

    const retryConfig = getRetryConfig();
    if (retryConfig.maxRetries && retryConfig.maxRetries > 0) {
      retry();
    }
  });

  player.on('liveEnd', () => {
    console.log('EasyPlayer live ended');
    recordEvent('liveEnd');
    emit('liveEnd');
  });

  player.on('videoInfo', (info) => {
    recordEvent('videoInfo', info);
    emit('videoInfo', info);
  });

  player.on('audioInfo', (info) => {
    recordEvent('audioInfo', info);
    emit('audioInfo', info);
  });

  player.on('kBps', (speed) => {
    recordEvent('kBps', speed);
    emit('kBps', speed);
  });

  playerTimer.value = window.setInterval(() => {
    if (playerInstanceRef.value) {
      try {
        const videoInfo = playerInstanceRef.value.getVideoInfo?.();
        if (videoInfo && videoInfo.timestamp !== undefined) {
          recordEvent('timestamps', videoInfo.timestamp);
          emit('timestamps', videoInfo.timestamp);
        }
      } catch {
        // Ignore errors in timer
      }
    }
  }, 1000);
};

const createPlayer = async () => {
  if (!playerRef.value || !currentUrl.value) return;

  if (!(window as any).EasyPlayerPro) {
    isLoading.value = true;
    try {
      await ensureEasyPlayerRuntime(props.assetBaseUrl || '');
    } catch (error) {
      console.error('EasyPlayer runtime load error:', error);
      errorMessage.value = String(error);
      hasError.value = true;
      emit('error', error);
      isLoading.value = false;
      return;
    }
    isLoading.value = false;
  }

  await destroyPlayer();

  try {
    console.log('EasyPlayer playerConfig:', playerConfig.value);
    const player = new window.EasyPlayerPro(playerRef.value, {
      ...playerConfig.value,
      isMute: !playerConfig.value.isMute,
      stretch: !playerConfig.value.stretch,
    });
    playerInstanceRef.value = player;
    if(props.mode !== 'vod') {
      await player.play(currentUrl.value);
    }

    handleEvents(player);
    emit('playerReady', player);
    recordEvent('playerReady');
    console.log('EasyPlayer created and playing:', currentUrl.value);
  } catch (error: any) {
    console.error('EasyPlayer create error:', error);
    
    if (error?.message?.includes('NotAllowedError') || error?.name === 'NotAllowedError') {
      errorMessage.value = '需要用户交互才能播放音频/视频，请点击播放按钮';
      console.warn('Autoplay blocked - user interaction required');
    } else if (error?.message?.includes('OOM') || String(error).includes('Aborted(OOM)')) {
      errorMessage.value = '播放器内存不足，请尝试关闭其他标签页或刷新页面';
      console.warn('WASM out of memory - try closing other tabs');
    } else {
      errorMessage.value = String(error);
    }
    
    hasError.value = true;
    emit('error', error);
  }
};

const playUrl = async (targetUrl: string) => {
  if (!targetUrl) {
    await destroyPlayer();
    return;
  }

  currentUrl.value = targetUrl;
  retryCount.value = 0;
  hasError.value = false;
  errorMessage.value = '';

  if (playerInstanceRef.value) {
    try {
      await playerInstanceRef.value.play(targetUrl);
      console.log('EasyPlayer playing:', targetUrl);
      hasError.value = false;
    } catch (error: any) {
      console.error('EasyPlayer play error:', error);
      
      if (error?.message?.includes('NotAllowedError') || error?.name === 'NotAllowedError') {
        errorMessage.value = '需要用户交互才能播放';
      } else if (error?.message?.includes('Abort') || error?.message?.includes('OOM')) {
        errorMessage.value = '播放器初始化失败，尝试重新创建...';
        await createPlayer();
      } else {
        await createPlayer();
      }
    }
  } else {
    await createPlayer();
  }
};

watch(
  () => props.url,
  async (newUrl) => {
    if (newUrl) {
      await playUrl(newUrl);
    }
  },
);

watch(
  () => props.isMute,
  (newIsMute) => {
    if (playerInstanceRef.value && newIsMute !== undefined) {
      playerInstanceRef.value.setMute(newIsMute);
    }
  },
);

onMounted(async () => {
  if (props.url) {
    currentUrl.value = props.url;
    await createPlayer();
  }
});

onUnmounted(async () => {
  await destroyPlayer();
});

const getPlayer = (): EasyPlayerPro | null => playerInstanceRef.value;

const play = (url: string): void => {
  playUrl(url);
};

const playback = (url: string): void => {
  const player = playerInstanceRef.value;
  if (player && player.playback) {
    player.playback(url);
  }
};

const pause = (): void => {
  const player = playerInstanceRef.value;
  if (player && player.pause) {
    player.pause();
  }
};

const screenshot = (
  filename?: string,
  format?: 'jpeg' | 'png' | 'webp',
  quality?: number,
  type?: 'base64' | 'blob' | 'download',
): Blob | string | undefined => {
  const player = playerInstanceRef.value;
  if (player && player.screenshot) {
    return player.screenshot(filename, format, quality, type);
  }
  return undefined;
};

const setFullscreen = (): void => {
  const player = playerInstanceRef.value;
  if (player && player.setFullscreen) {
    player.setFullscreen();
  }
};

const exitFullscreen = (): void => {
  const player = playerInstanceRef.value;
  if (player && player.exitFullscreen) {
    player.exitFullscreen();
  }
};

const setMute = (mute: boolean): void => {
  const player = playerInstanceRef.value;
  if (player && player.setMute) {
    player.setMute(mute);
  }
};

const setQuality = (quality: string): void => {
  const player = playerInstanceRef.value;
  if (player && player.setQuality) {
    player.setQuality(quality);
  }
};

const seekTime = (time: number): void => {
  const player = playerInstanceRef.value;
  if (player && player.seekTime) {
    player.seekTime(time);
  }
};

const destroy = (): void => {
  destroyPlayer();
};

defineExpose<EasyPlayerInstance>({
  getPlayer,
  play,
  playback,
  pause,
  screenshot,
  setFullscreen,
  exitFullscreen,
  setMute,
  setQuality,
  seekTime,
  destroy,
  retry,
  getEventHistory,
  clearEventHistory,
});
</script>

<template>
  <div
    ref="playerRef"
    class="easy-player"
    :class="[
      props.class,
      { 'hide-controls': !props.controlsVisible }
    ]"
    :style="props.style"
    :data-url="props.url"
  >
    <div v-if="!props.url" class="easy-player__placeholder">
      <span>{{ props.noSignalText || 'No signal' }}</span>
    </div>
    <div v-else-if="isLoading" class="easy-player__loading">
      <span>Loading player...</span>
    </div>
    <div v-if="hasError && $slots.error" class="easy-player__error">
      <slot name="error" :error="errorMessage" :retry="retry" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
