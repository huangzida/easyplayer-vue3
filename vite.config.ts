import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    dts({
      include: ['src/index.ts', 'src/vite-plugin.ts', 'src/auto-import.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'vite-plugin': 'src/vite-plugin.ts',
        'auto-import': 'src/auto-import.ts',
      },
      name: 'EasyPlayerVue3',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vite',
        /^node:.*/,
      ],
      output: {
        assetFileNames: 'easyplayer-vue3.css',
      },
      treeshake: {
        moduleSideEffects: () => true,
      },
    },
    cssCodeSplit: false,
  },
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : undefined,
  },
}));
