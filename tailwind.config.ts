import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,vue}', './docs/**/*.{md,ts,vue}', './playground/**/*.{ts,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;