import type { CSSProperties } from 'vue';

export type PlayerMode = 'vod' | 'live' | 'custom';

export interface WatermarkTextConfig {
  content: string;
  color?: string;
  opacity?: number;
  fontSize?: string;
}

export interface WatermarkConfig {
  text: WatermarkTextConfig;
  right?: number;
  top?: number;
}

export interface FullWatermarkConfig {
  text: string;
  angle?: number;
  color?: string;
  fontSize?: string;
  opacity?: number;
}

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

export interface EasyPlayerConfig {
  mse?: boolean;
  wcs?: boolean;
  wasm?: boolean;
  wasmSimd?: boolean;
  gpuDecoder?: boolean;
  webGpu?: boolean;
  canvasRender?: boolean;
  isLive?: boolean;
  hasAudio?: boolean;
  isMute?: boolean;
  stretch?: boolean;
  poster?: string;
  bufferTime?: number;
  loadTimeOut?: number;
  loadTimeReplay?: number;
  debug?: boolean;
  quality?: string[];
  defaultQuality?: string;
  watermark?: WatermarkConfig;
  fullWatermark?: FullWatermarkConfig;
  retry?: RetryConfig;
  controlsVisible?: boolean;
}

export interface EasyPlayerProps extends EasyPlayerConfig {
  url?: string;
  mode?: PlayerMode;
  noSignalText?: string;
  fallbackUrl?: string;
  class?: string;
  style?: CSSProperties;
  assetBaseUrl?: string;
}

export interface EventHistory {
  timestamp: number;
  event: string;
  data?: any;
}

export interface EasyPlayerAssetUrls {
  lib: string;
  pro: string;
  wasm: string;
}

export interface EasyPlayerProConfig {
  isLive?: boolean;
  hasAudio?: boolean;
  isMute?: boolean;
  stretch?: boolean;
  poster?: string;
  bufferTime?: number;
  loadTimeOut?: number;
  loadTimeReplay?: number;
  MSE?: boolean;
  WCS?: boolean;
  WASM?: boolean;
  WASMSIMD?: boolean;
  gpuDecoder?: boolean;
  webGPU?: boolean;
  canvasRender?: boolean;
  debug?: boolean;
  [key: string]: any;
}

declare global {
  interface Window {
    EasyPlayerPro: new (
      element: HTMLDivElement,
      config: EasyPlayerProConfig,
    ) => EasyPlayerPro;
  }
}

export interface EasyPlayerPro {
  play: (url: string) => Promise<void>;
  playback: (url: string) => Promise<void>;
  pause: () => void;
  isPause: () => boolean;
  setMute: (mute: boolean) => void;
  isMute: () => boolean;
  screenshot: (
    filename?: string,
    format?: 'jpeg' | 'png' | 'webp',
    quality?: number,
    type?: 'base64' | 'blob' | 'download',
  ) => Blob | string | undefined;
  setFullscreen: () => void;
  exitFullscreen: () => void;
  setQuality: (quality: string) => void;
  setRate: (rate: number) => void;
  seekTime: (time: number) => void;
  getVideoInfo: () => any;
  getAudioInfo: () => any;
  setMic: (enable: boolean) => void;
  destroy: () => Promise<void>;
  on: (event: string, callback: (e?: any) => void) => void;
  off?: (event: string, callback?: (e?: any) => void) => void;
}

export interface EasyPlayerEmits {
  playerReady: [player: EasyPlayerPro];
  play: [];
  pause: [];
  error: [error: any];
  timeout: [];
  liveEnd: [];
  timestamps: [time: number];
  videoInfo: [info: any];
  audioInfo: [info: any];
  kBps: [speed: number];
}

export interface EasyPlayerInstance {
  getPlayer: () => EasyPlayerPro | null;
  play: (url: string) => void;
  playback: (url: string) => void;
  pause: () => void;
  screenshot: (
    filename?: string,
    format?: 'jpeg' | 'png' | 'webp',
    quality?: number,
    type?: 'base64' | 'blob' | 'download',
  ) => Blob | string | undefined;
  setFullscreen: () => void;
  exitFullscreen: () => void;
  setMute: (mute: boolean) => void;
  setQuality: (quality: string) => void;
  seekTime: (time: number) => void;
  destroy: () => void;
  retry: () => void;
  getEventHistory: () => EventHistory[];
  clearEventHistory: () => void;
}
