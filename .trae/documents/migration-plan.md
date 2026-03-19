# EasyPlayer 迁移计划

## 目标
将 `/root/git/screen-recording/apps/web-antd/src/components/EasyPlayer/` 组件迁移到当前项目（`/root/git/easyplayer-vue3/`），新包名为 `easyplayer-vue3`，替换原有的 LivePlayer 功能。

## 用户额外要求
1. **同步更新 docs 和 playground** 为新组件
2. **重置版本号** 为 0.0.0
3. **绑定远程地址** 为 `https://github.com/huangzida/easyplayer-vue3.git`

## 当前项目结构分析
```
src/
├── components/
│   └── LivePlayer.vue          # 当前播放器组件（将被替换）
├── index.ts                      # 入口文件（需更新）
├── types.ts                      # 类型定义（需更新）
├── style.css                     # 样式文件（需更新）
├── shims-liveplayer.d.ts        # 类型声明（需更新/删除）
└── runtime/                      # 运行时加载器（需删除）
    ├── asset-loader.ts
    ├── auto-loader.ts
    └── load-player.ts
```

## 迁移步骤

### 步骤 1: 创建新的 EasyPlayer 组件目录和文件
- [ ] 创建 `src/components/EasyPlayer/` 目录
- [ ] 创建 `src/components/EasyPlayer/index.vue` - 从源项目迁移组件代码
- [ ] 创建 `src/components/EasyPlayer/index.scss` - 从源项目迁移样式
- [ ] 创建 `src/components/EasyPlayer/types.ts` - 从源项目迁移类型定义

### 步骤 2: 更新类型定义文件
- [ ] 更新 `src/types.ts` - 添加 EasyPlayer 相关的类型定义
- [ ] 更新 `src/shims-liveplayer.d.ts` - 改为 EasyPlayer 类型声明（或合并到 types.ts）

### 步骤 3: 更新入口文件
- [ ] 更新 `src/index.ts` - 导出 EasyPlayer 组件，移除 LivePlayer 导出

### 步骤 4: 更新样式
- [ ] 更新 `src/style.css` - 添加/更新 EasyPlayer 相关样式

### 步骤 5: 清理旧文件
- [ ] 删除 `src/components/LivePlayer.vue` - 旧组件不再需要
- [ ] 删除 `src/runtime/` 目录 - 旧运行时加载器不再需要
- [ ] 删除 `src/shims-liveplayer.d.ts` - 类型声明将合并到 types.ts

### 步骤 6: 更新 playground（重要）
- [ ] 更新 `playground/src/App.vue` - 更新标题和描述为 easyplayer-vue3
- [ ] 更新 `playground/src/demos/FeatureShowcase.vue` - 使用 EasyPlayer 替换 LivePlayer
  - 导入改为 `import { EasyPlayer } from '@/index'`
  - 类型改为 `EasyPlayerInstance`
  - Props 映射：`:src="source"` → `:url="source"`, `:mode="mode"` → `:is-live="mode === 'live'"`, `:muted="muted"` → `:is-mute="muted"`
  - 更新事件处理

### 步骤 7: 更新文档（重要）
- [ ] 更新 `docs/index.md` - 首页标题和描述改为 easyplayer-vue3
- [ ] 更新 `docs/api-reference.md` - API 文档更新为 EasyPlayer 的 props 和方法
- [ ] 更新 `docs/basic-usage.md` - 基本使用示例更新
- [ ] 更新 `docs/examples.md` - 示例更新
- [ ] 更新 `docs/.vitepress/config.ts` - 标题、描述、GitHub 链接
- [ ] 更新 `docs/public/assets/liveplayer/` - 替换为 EasyPlayer 相关资源（如有）

### 步骤 8: 更新配置和文档
- [ ] 更新 `package.json` - 包名改为 `easyplayer-vue3`，版本改为 `0.0.0`，移除旧依赖 `@liveqing/liveplayer-v3`
- [ ] 更新 `README.md` - 更新项目描述、名称、仓库链接
- [ ] 更新 `.github/workflows/pages.yml` - 如有必要
- [ ] 更新 `.github/workflows/release.yml` - 如有必要
- [ ] 更新 `vite.config.ts` - 如有必要
- [ ] 更新 `tsconfig.json` - 如有必要

### 步骤 9: Git 远程配置
- [ ] 更新 git 远程地址为 `https://github.com/huangzida/easyplayer-vue3.git`
- [ ] 验证远程配置

### 步骤 10: 验证
- [ ] 运行 `pnpm install` - 重新安装依赖
- [ ] 运行 `pnpm typecheck` - 检查类型
- [ ] 运行 `pnpm lint` - 检查代码规范
- [ ] 运行 `pnpm build` - 构建项目
- [ ] 运行 `pnpm dev` - 启动开发服务器测试

## 关键文件内容概要

### 源组件特点 (EasyPlayer)
- 基于 `EasyPlayerPro` 封装
- 支持 FLV/HLS 等视频流
- Props: url, isLive, hasAudio, isMute, stretch, poster 等
- Emits: play, pause, error, timeout, liveEnd, videoInfo, audioInfo 等
- 暴露方法: play, playback, pause, screenshot, setFullscreen, exitFullscreen, setMute, destroy

### 需要修改的映射关系
| 旧属性 (LivePlayer) | 新属性 (EasyPlayer) | 说明 |
|-------------------|-------------------|------|
| src | url | 视频源 |
| muted | isMute | 静音状态 |
| mode='live' | isLive=true | 直播模式 |
| mode='vod' | isLive=false | 点播模式 |
| fit='fill' | stretch=true | 填充模式 |
| controls | (内置) | EasyPlayer 自带控制条 |
| autoplay | (自动) | 自动播放 |
| - | hasAudio | 是否解析音频 |
| - | bufferTime | 缓冲时长 |
| - | MSE/WCS/WASM | 解码模式 |

### Playground 组件属性映射
```typescript
// 旧 LivePlayer
<LivePlayer
  :src="source"
  :mode="mode"          // 'live' | 'vod'
  :fit="fit"            // 'contain' | 'fill'
  :muted="muted"
  :autoplay="autoplay"
  :controls="true"
  title="Demo stream"
/>

// 新 EasyPlayer
<EasyPlayer
  :url="source"
  :is-live="mode === 'live'"
  :stretch="fit === 'fill'"
  :is-mute="muted"
  :has-audio="true"
/>
```

## 注意事项
1. 保持代码风格一致
2. 确保类型定义完整
3. 不改变现有 API 暴露方式（保持兼容性）
4. 更新所有引用旧组件的地方
5. 移除 `@liveqing/liveplayer-v3` 依赖，改用 EasyPlayerPro
6. Git 远程地址要正确更新
