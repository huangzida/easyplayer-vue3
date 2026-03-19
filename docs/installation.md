# Installation

```bash
pnpm add easyplayer-vue3 vue
```

## Import styles

```ts
import 'easyplayer-vue3/style.css';
```

## Runtime assets

The package expects the EasyPlayer runtime assets under `assets/easyplayer/` relative to the built package output. When you use the provided build scripts, those files are copied automatically.

If you need to override the asset host, pass `assetBaseUrl`:

```vue
<EasyPlayer asset-base-url="/my-cdn/easyplayer" />
```
