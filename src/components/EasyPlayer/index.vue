<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import type {
  EasyPlayerEmits,
  EasyPlayerInstance,
  EasyPlayerProps,
} from './types';
import type { EasyPlayerPro } from '../../types';

import { isUndefined, omitBy } from 'es-toolkit';

import { ensureEasyPlayerRuntime } from '../../runtime/asset-loader';

defineOptions({ name: 'EasyPlayer' });

const props = withDefaults(defineProps<EasyPlayerProps & {
  assetBaseUrl?: string;
}>(), {
  WASMSIMD: true,
  WASM: false,
  MSE: false,
  WCS: false,
  bufferTime: 0.1,
  stretch: false,
  isLive: true,
  hasAudio: true,
  isMute: true,
  noSignalText: '',
  class: '',
  style: () => ({}),
  assetBaseUrl: '',
});

const emit = defineEmits<EasyPlayerEmits>();

const playerRef = ref<HTMLDivElement>();
const playerInstanceRef = ref<EasyPlayerPro | null>(null);
const isLoading = ref(false);

const playerConfig = computed(() => ({
  ...omitBy(props, isUndefined),
}));

const destroyPlayer = async () => {
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
    emit('play');
  });

  player.on('pause', () => {
    emit('pause');
  });

  player.on('error', (error) => {
    console.error('EasyPlayer error:', error);
    emit('error', error);
  });

  player.on('timeout', () => {
    console.warn('EasyPlayer timeout');
    emit('timeout');
  });

  player.on('liveEnd', () => {
    console.log('EasyPlayer live ended');
    emit('liveEnd');
  });

  player.on('videoInfo', (info) => {
    emit('videoInfo', info);
  });

  player.on('audioInfo', (info) => {
    emit('audioInfo', info);
  });
};

const createPlayer = async () => {
  if (!playerRef.value || !props.url) return;

  if (!(window as any).EasyPlayerPro) {
    isLoading.value = true;
    try {
      await ensureEasyPlayerRuntime(props.assetBaseUrl);
    } catch (error) {
      console.error('EasyPlayer runtime load error:', error);
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

    await player.play(props.url);

    handleEvents(player);
    console.log('EasyPlayer created and playing:', props.url);
  } catch (error) {
    console.error('EasyPlayer create error:', error);
    emit('error', error);
  }
};

const playUrl = async (targetUrl: string) => {
  if (!targetUrl) {
    await destroyPlayer();
    return;
  }

  if (playerInstanceRef.value) {
    try {
      await playerInstanceRef.value.play(targetUrl);
      console.log('EasyPlayer playing:', targetUrl);
    } catch (error) {
      console.error('EasyPlayer play error:', error);
      await createPlayer();
    }
  } else {
    await createPlayer();
  }
};

watch(
  () => props.url,
  async (newUrl) => {
    await playUrl(newUrl);
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
  await createPlayer();
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
  destroy,
});
</script>

<template>
  <div
    ref="playerRef"
    class="easy-player"
    :class="props.class"
    :style="props.style"
    :data-url="props.url"
  >
    <span v-if="!props.url" class="easy-player__placeholder">
      {{ props.noSignalText || 'No signal' }}
    </span>
    <span v-else-if="isLoading" class="easy-player__loading">
      Loading player...
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
