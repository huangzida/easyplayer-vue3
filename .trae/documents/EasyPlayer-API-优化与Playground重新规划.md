# EasyPlayer API 优化与 Playground 重新规划

## 一、需求概述

1. **API 设计优化**：
   - 增加 `mode` 预设系统（`vod` | `live` | `custom`）
   - 默认模式为 `vod`，简化基础使用
   - 解码参数命名转换为小驼峰
2. **Playground 重新规划**：视频全宽一行显示，所有参数可视化调试

## 二、API 设计优化

### 2.1 新增 `mode` 属性

```typescript
type PlayerMode = 'vod' | 'live' | 'custom';
```

### 2.2 模式预设参数

**优化点**：因为 `stretch` 和 `isMute` 在两个模式下相同，所以不纳入预设，仅预设关键差异参数。

#### VOD 点播模式预设
```typescript
const vodPreset = {
  isLive: false,        // 点播模式
  bufferTime: 1,        // 缓冲 1 秒保证流畅
};
```

#### LIVE 直播模式预设
```typescript
const livePreset = {
  isLive: true,         // 直播模式
  bufferTime: 0.2,      // 低延迟缓冲
};
```

**参数优先级**: mode预设 < 用户直接传入参数 < custom模式完全自定义

### 2.3 默认行为

- **不传 mode**：默认使用 `vod` 模式（安全、保守）
- **传 mode="vod"**：明确使用点播配置
- **传 mode="live"**：明确使用直播配置
- **传 mode="custom"**：完全使用用户自定义参数

```vue
<!-- 最简使用 - 默认 vod 模式 -->
<EasyPlayer url="video.mp4" />

<!-- 明确点播 -->
<EasyPlayer url="video.mp4" mode="vod" />

<!-- 明确直播 -->
<EasyPlayer url="live.m3u8" mode="live" />
```

### 2.4 命名转换（方案 B）

**转换规则**：`EasyPlayer.js` 原生参数 → `Vue` 组件参数（小驼峰）

| EasyPlayer.js | Vue Props | 说明 |
|---------------|-----------|------|
| MSE | `mse` | Media Source Extensions |
| WCS | `wcs` | WebCodec |
| WASM | `wasm` | WebAssembly |
| WASMSIMD | `wasmSimd` | SIMD 加速 |
| gpuDecoder | `gpuDecoder` | 保持原样 |
| webGPU | `webGpu` | 转小驼峰 |
| loadTimeOut | `loadTimeOut` | 保持原样 |
| loadTimeReplay | `loadTimeReplay` | 保持原样 |

**实现机制**：在 `index.vue` 中接收小驼峰命名，内部转换为 EasyPlayer.js 需要的原生命名

### 2.5 类型定义修改

**文件**: `src/types.ts`

```typescript
export type PlayerMode = 'vod' | 'live' | 'custom';

// 小驼峰命名的配置接口
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
}

export interface EasyPlayerProps extends EasyPlayerConfig {
  url: string;
  mode?: PlayerMode;
  noSignalText?: string;
}
```

## 三、扩展功能实现

### 3.1 实用功能封装

#### 3.1.1 清晰度切换
```typescript
interface EasyPlayerProps extends EasyPlayerConfig {
  quality?: string[];           // ['普清', '高清', '超清']
  defaultQuality?: string;      // 默认清晰度
}
```

#### 3.1.2 水印功能
```typescript
interface WatermarkConfig {
  text: {
    content: string;
    color?: string;
    opacity?: number;
    fontSize?: string;
  };
  right?: number;
  top?: number;
}

interface FullWatermarkConfig {
  text: string;
  angle?: number;
  color?: string;
  fontSize?: string;
  opacity?: number;
}

interface EasyPlayerProps extends EasyPlayerConfig {
  watermark?: WatermarkConfig;
  fullWatermark?: FullWatermarkConfig;
}
```

#### 3.1.3 事件历史记录
```typescript
interface EventHistory {
  timestamp: number;
  event: string;
  data?: any;
}

interface EasyPlayerInstance {
  // 新增方法
  getEventHistory(): EventHistory[];
  clearEventHistory(): void;
}
```

### 3.2 错误重试策略

```typescript
interface RetryConfig {
  maxRetries?: number;      // 最大重试次数，默认 3
  retryDelay?: number;      // 重试延迟（毫秒），默认 1000
  exponentialBackoff?: boolean;  // 指数退避，默认 true
}

interface EasyPlayerProps extends EasyPlayerConfig {
  retry?: RetryConfig;
}
```

**实现逻辑**：
1. 加载超时时自动重试
2. 支持指数退避策略
3. 超过最大重试次数后触发 `error` 事件
4. 用户可通过 `loadTimeReplay` 覆盖

### 3.3 错误边界

```vue
<!-- 使用错误边界 -->
<template>
  <EasyPlayer
    url="video.mp4"
    mode="vod"
    :fallback-url="fallbackUrl"
    @error="handleError"
  >
    <template #error="{ error }">
      <div class="player-error">
        <p>视频加载失败</p>
        <button @click="retry">重试</button>
      </div>
    </template>
  </EasyPlayer>
</template>
```

**实现特性**：
- 加载失败时显示错误插槽
- 自动尝试备用 URL（fallback-url）
- 提供重试按钮和手动重试方法
- 优雅降级，显示友好的错误提示

## 四、Playground 重新规划

### 4.1 布局结构调整

**新布局**:
```
┌─────────────────────────────────────────────────────────┐
│                   视频播放 (全宽)                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ URL 输入  │ 模式选择  │ 状态标签                        │
├─────────────────────────────────────────────────────────┤
│ 视频参数配置面板                                         │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 基础参数    │ │ 解码参数    │ │ 渲染参数    │        │
│ │ url, poster │ │ mse, wcs   │ │ webGpu     │        │
│ │ mode        │ │ wasm, gpu  │ │ canvas     │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 播放参数    │ │ 高级功能    │ │ 实用功能    │        │
│ │ bufferTime │ │ retry      │ │ watermark  │        │
│ │ isLive     │ │ loadTime   │ │ quality    │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
├─────────────────────────────────────────────────────────┤
│ 播放器实例方法  │ 事件日志 (含历史)                      │
│ play() pause  │ [时间] event: data                     │
│ screenshot()  │ [时间] event: data                     │
└─────────────────────────────────────────────────────────┘
```

### 4.2 功能模块

#### 4.2.1 视频预览区（全宽）
- EasyPlayer 播放器实例（16:9 比例）
- 顶部状态标签（mode、isLive、stretch、isMute）
- 顶部快捷操作按钮（预设切换）

#### 4.2.2 参数配置面板（6 个分组卡片）

**基础参数**:
- `url` - 视频地址
- `mode` - 模式选择（vod/live/custom）
- `poster` - 封面图

**解码参数**:
- `mse` - MSE 解码
- `wcs` - WebCodec 解码
- `wasm` - WASM 解码
- `wasmSimd` - SIMD 加速
- `gpuDecoder` - 硬件解码

**渲染参数**:
- `webGpu` - WebGPU 渲染
- `canvasRender` - Canvas 渲染
- `stretch` - 拉伸填充

**播放参数**:
- `isLive` - 直播模式
- `isMute` - 静音
- `hasAudio` - 解析音频
- `bufferTime` - 缓冲时长

**高级参数**:
- `loadTimeOut` - 加载超时
- `loadTimeReplay` - 重连次数
- `debug` - 调试模式

**实用功能**:
- `quality` - 清晰度列表
- `watermark` - 水印配置
- `fallbackUrl` - 备用地址

#### 4.2.3 实例方法区
- play(url?)
- pause()
- playback(url)
- screenshot()
- setFullscreen()
- setMute(mute)
- setQuality(quality)
- seekTime(time)
- destroy()
- retry()
- getEventHistory()
- clearEventHistory()

#### 4.2.4 事件日志区
- 实时显示播放器事件
- 显示事件参数详情
- 支持日志清空
- 支持历史记录导出
- 显示网络状态（kBps）

## 五、实施步骤

### 第一阶段：API 核心优化

1. **修改类型定义** (`src/types.ts`)
   - 添加 `PlayerMode` 类型
   - 添加小驼峰命名的 `EasyPlayerConfig` 接口
   - 添加扩展功能类型（水印、清晰度、重试等）

2. **实现参数转换逻辑** (`src/components/EasyPlayer/index.vue`)
   - 实现小驼峰 → 原生命名转换
   - 实现预设合并逻辑
   - 实现默认 mode 为 vod

3. **实现错误重试策略**
   - 实现重试计数器
   - 实现指数退避
   - 集成到播放器生命周期

4. **实现错误边界**
   - 实现 fallback-url 功能
   - 实现错误插槽
   - 实现重试方法

### 第二阶段：扩展功能

5. **实现清晰度切换**
   - 暴露 quality/defaultQuality 参数
   - 实现 setQuality 方法
   - 添加清晰度选择 UI

6. **实现水印功能**
   - 暴露 watermark/fullWatermark 参数
   - 透传给 EasyPlayer.js

7. **实现事件历史**
   - 记录播放过程中的事件
   - 提供 getEventHistory 方法
   - 提供 clearEventHistory 方法

### 第三阶段：Playground 重构

8. **创建参数配置组件** (`playground/src/components/PlayerConfig.vue`)
   - 实现 6 个分组配置面板
   - 实现参数双向绑定
   - 实现预设切换

9. **重构 FeatureShowcase.vue**
   - 调整布局为全宽视频 + 参数面板
   - 集成新的配置组件
   - 优化事件日志显示
   - 添加事件历史展示

### 第四阶段：文档与测试

10. **更新 README**
    - 添加 `mode` 属性说明
    - 更新 API 文档（包含新功能）
    - 添加使用示例

11. **验证功能**
    - 测试 vod 模式（默认行为）
    - 测试 live 模式
    - 测试 custom 模式参数透传
    - 测试错误重试
    - 测试错误边界
    - 测试新功能（清晰度、水印等）

## 六、文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/types.ts` | 修改 | 重构类型定义，小驼峰命名 |
| `src/components/EasyPlayer/types.ts` | 修改 | 同步类型定义 |
| `src/components/EasyPlayer/index.vue` | 修改 | 实现预设、转换、错误处理 |
| `playground/src/components/PlayerConfig.vue` | 新建 | 参数配置组件 |
| `playground/src/components/EventLog.vue` | 新建 | 事件日志组件 |
| `playground/src/demos/FeatureShowcase.vue` | 重构 | 新布局实现 |
| `playground/src/index.css` | 优化 | 样式调整 |
| `README.zh-CN.md` | 更新 | 文档同步 |
| `README.md` | 更新 | 英文文档 |

## 七、预期效果

### API 使用示例

```vue
<!-- 基础使用 - 默认 vod 模式 -->
<EasyPlayer url="video.mp4" />

<!-- 直播场景 -->
<EasyPlayer url="live.m3u8" mode="live" />

<!-- 带水印的直播 -->
<EasyPlayer
  url="live.m3u8"
  mode="live"
  :watermark="{ text: { content: '水印' }, right: 10, top: 10 }"
/>

<!-- 带清晰度切换 -->
<EasyPlayer
  url="video.mp4"
  mode="vod"
  :quality="['普清', '高清', '超清']"
  default-quality="高清"
/>

<!-- 错误重试配置 -->
<EasyPlayer
  url="video.mp4"
  mode="vod"
  :retry="{ maxRetries: 5, retryDelay: 1000 }"
  :fallback-url="backupUrl"
  @error="handleError"
>
  <template #error="{ error }">
    <div class="error-ui">
      <p>播放失败: {{ error.message }}</p>
      <button @click="$refs.player.retry()">重试</button>
    </div>
  </template>
</EasyPlayer>
```

### Playground 功能
- 所有参数可视化配置
- 实时预览参数修改
- 完整事件日志 + 历史记录
- 网络状态实时显示
- 错误处理演示
