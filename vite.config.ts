import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    dts({
      include: ['src/index.ts', 'src/vite-plugin.ts'],
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
        hoistTransitiveImports: false,
      },
      treeshake: {
        moduleSideEffects: (id) => {
          if (id.includes('auto-import')) {
            return true;
          }
          return false;
        },
      },
    },
    cssCodeSplit: false,
  },
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : undefined,
  },
}));
