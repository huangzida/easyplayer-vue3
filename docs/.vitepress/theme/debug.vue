<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Body classes:', document.body.className);
  console.log('HTML attributes:', document.documentElement.attributes);
  console.log('CSS vars:', getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-1'));
});
</script>

<template>
  <ClientOnly>
    <FeatureShowcase />
  </ClientOnly>
</template>
