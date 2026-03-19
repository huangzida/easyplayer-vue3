<script setup lang="ts">
const props = defineProps<{
  label: string;
  tone?: 'amber' | 'sky' | 'emerald' | 'rose';
}>();

const toneClasses = {
  amber: 'border-amber-300/70 bg-amber-100 text-amber-800 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100',
  sky: 'border-sky-300/70 bg-sky-100 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/10 dark:text-sky-100',
  emerald: 'border-emerald-300/70 bg-emerald-100 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100',
  rose: 'border-rose-300/70 bg-rose-100 text-rose-800 dark:border-rose-300/30 dark:bg-rose-300/10 dark:text-rose-100',
};
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]"
    :class="toneClasses[props.tone ?? 'amber']"
  >
    {{ props.label }}
  </span>
</template>