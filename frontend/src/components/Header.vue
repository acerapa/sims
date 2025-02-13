<template>
  <div class="bg-white shadow h-15 pl-5 flex items-center sticky top-0 z-20">
    <p class="text-xl font-bold">Ram Tech Ventures</p>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const appStore = useAppStore()
const route = useRoute()

// currently changing the design, This part might to be usable in the next update
const title = computed(() => {
  let t = route.meta.title

  if (!t) {
    if (appStore.currentNav && appStore.currentNav.includes_active) {
      t = appStore.currentNav.includes_active.includes(route.name)
        ? t
        : appStore.currentNav.text
    } else if (appStore.currentNav && !appStore.currentNav.includes_active) {
      t = appStore.currentNav.text
    }
  }

  return t
})
</script>
