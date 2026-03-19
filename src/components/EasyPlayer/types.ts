import type { CSSProperties } from 'vue';

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

export interface EasyPlayerProps extends EasyPlayerProConfig {
  url: string;
  noSignalText?: string;
  style?: CSSProperties;
  class?: string;
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
  destroy: () => void;
}
