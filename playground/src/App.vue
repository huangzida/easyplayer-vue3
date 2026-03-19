<script setup lang="ts">
import FeatureShowcase from './demos/FeatureShowcase.vue';
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-slate-100 md:px-10 lg:px-16">
    <section class="mx-auto flex max-w-7xl flex-col gap-8">
      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div class="space-y-5">
          <p class="inline-flex rounded-full border border-amber-400/30 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-amber-200">
            easyplayer-vue3 playground
          </p>
          <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Vue 3 video streaming demo space with EasyPlayer and GitHub Pages-ready docs.
          </h1>
          <p class="max-w-2xl text-lg leading-8 text-slate-300">
            This playground demonstrates the EasyPlayer Vue 3 component with support for HLS, FLV, and various streaming protocols.
          </p>
        </div>
        <div class="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div class="grid gap-3 text-sm text-slate-200">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Package target</span>
              <span class="font-medium text-amber-200">npm + GitHub Pages</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Core wrapper</span>
              <span class="font-medium text-sky-200">EasyPlayerPro</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Mode</span>
              <span class="font-medium text-emerald-200">Tailwind + VitePress</span>
            </div>
          </div>
        </div>
      </div>

      <FeatureShowcase />
    </section>
  </main>
</template>
