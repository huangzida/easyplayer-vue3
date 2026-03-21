# 本地测试指南

本指南说明如何使用 `pnpm link` 在本地其他项目中测试 `easyplayer-vue3` 的构建产物。

## 场景

当你修改了 `easyplayer-vue3` 的代码并构建后，希望在另一个实际项目（比如你的业务项目）中测试效果，而不需要发布到 npm。

## 方法一：使用 pnpm link（推荐）

### 步骤 1：构建 easyplayer-vue3

```bash
# 在 easyplayer-vue3 项目中
cd /path/to/easyplayer-vue3
pnpm build
```

### 步骤 2：创建全局链接

```bash
# 在 easyplayer-vue3 项目目录中
pnpm link --global
```

这会在全局 node_modules 中创建一个指向你项目的链接。

### 步骤 3：在目标项目中链接

```bash
# 在你的业务项目目录中
cd /path/to/your-project
pnpm link --global easyplayer-vue3
```

这会在你的项目的 `node_modules` 中创建一个指向全局链接的符号链接。

### 步骤 4：验证链接

```bash
# 在你的业务项目中
ls -la node_modules/easyplayer-vue3
```

你应该会看到符号链接指向全局 node_modules 中的 easyplayer-vue3。

### 步骤 5：使用

现在你可以在业务项目中使用：

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3';
import 'easyplayer-vue3/style.css';
</script>
```

或者使用自动导入版本：

```vue
<script setup lang="ts">
import { EasyPlayer } from 'easyplayer-vue3/auto';
</script>
```

### 步骤 6：更新测试

当你修改了 `easyplayer-vue3` 代码后：

```bash
# 1. 重新构建
cd /path/to/easyplayer-vue3
pnpm build

# 2. 由于是符号链接，你的业务项目自动使用最新版本
# 无需重新 link！
```

### 步骤 7：取消链接

测试完成后，取消链接：

```bash
# 在你的业务项目中
pnpm unlink --global easyplayer-vue3
```

## 方法二：使用 pnpm workspace

如果你有多个相关项目，可以使用 pnpm workspace。

### 创建 workspace 配置

在你的父目录中创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### 组织项目结构

```
my-monorepo/
├── pnpm-workspace.yaml
├── packages/
│   └── easyplayer-vue3/  # 你的播放器包
└── apps/
    └── my-app/           # 你的业务应用
```

### 安装依赖

```bash
cd my-monorepo
pnpm install
```

pnpm 会自动在 workspace 中链接包，你的业务应用可以直接引用 `easyplayer-vue3`。

## 方法三：使用相对路径（简单测试）

如果你只是快速测试，可以在业务项目中直接引用构建产物：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { easyplayerVue3Plugin } from '/path/to/easyplayer-vue3/dist/vite-plugin.js';

export default defineConfig({
  plugins: [
    vue(),
    easyplayerVue3Plugin(),
  ],
});
```

然后在业务项目中：

```typescript
// 直接从构建目录导入
import EasyPlayer from '/path/to/easyplayer-vue3/dist/index.js';
import '/path/to/easyplayer-vue3/dist/index.css';
```

**注意**：这种方式不适合生产环境，仅用于本地测试。

## 常见问题

### 1. 链接后还是使用旧版本？

```bash
# 清除缓存并重新构建
cd /path/to/easyplayer-vue3
rm -rf dist
pnpm build

# 如果还不行，清除业务项目的缓存
cd /path/to/your-project
rm -rf node_modules/.vite
pnpm dev
```

### 2. TypeScript 类型不生效？

确保 `dist` 目录中有正确的 `.d.ts` 文件：

```bash
ls /path/to/easyplayer-vue3/dist/*.d.ts
```

### 3. 资源文件（wasm, js）找不到？

确保运行了 `easyplayerVue3Plugin()`，它会自动复制资源文件。

或者手动复制：

```bash
# 从 easyplayer-vue3 复制到你的项目
cp -r /path/to/easyplayer-vue3/public/assets/easyplayer /path/to/your-project/public/assets/
```

### 4. pnpm link 命令不存在？

确保你使用的是 pnpm v6+，旧版本可能需要不同的命令。

```bash
# 检查 pnpm 版本
pnpm --version
```

### 5. Windows 用户？

在 Windows 上，`pnpm link` 可能需要管理员权限。尝试使用 PowerShell 或 Git Bash。

## 测试清单

在测试新版本时，确保检查：

- [ ] 组件能正常渲染
- [ ] 视频能正常播放（HLS/FLV/MP4）
- [ ] 控制栏正常工作
- [ ] 截图功能正常
- [ ] 全屏功能正常
- [ ] 样式正确加载
- [ ] TypeScript 类型正确
- [ ] 没有控制台错误

## 发布前验证

在正式发布到 npm 之前：

```bash
# 1. 构建生产版本
pnpm build

# 2. 运行所有检查
pnpm lint
pnpm typecheck
pnpm test

# 3. 验证构建产物
ls -la dist/

# 4. 本地测试（使用 pnpm link）
# 按照上面的步骤测试

# 5. 检查包内容
pnpm pack --pack-destination .artifacts
tar -tzf .artifacts/easyplayer-vue3-*.tgz | head -20
```

## 自动化测试脚本

创建一个测试脚本 `test-local.sh`：

```bash
#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

EASYPLAYER_DIR="/path/to/easyplayer-vue3"
TEST_PROJECT_DIR="/path/to/your-test-project"

echo -e "${YELLOW}1. Building easyplayer-vue3...${NC}"
cd $EASYPLAYER_DIR
pnpm build

echo -e "${YELLOW}2. Creating global link...${NC}"
pnpm link --global

echo -e "${YELLOW}3. Linking to test project...${NC}"
cd $TEST_PROJECT_DIR
pnpm unlink --global easyplayer-vue3 2>/dev/null
pnpm link --global easyplayer-vue3

echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "Test project is now using your local easyplayer-vue3"
echo -e "Run: cd $TEST_PROJECT_DIR && pnpm dev"
```

赋予执行权限并运行：

```bash
chmod +x test-local.sh
./test-local.sh
```

## 总结

- **推荐**：使用 `pnpm link --global` 方法，最简单且维护性好
- **临时测试**：使用相对路径导入，但不要用于生产
- **长期测试**：使用 pnpm workspace，适合 monorepo 项目

有任何问题，欢迎提 issue！
