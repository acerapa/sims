<template>
  <div
    class="bg-white shadow h-15 px-5 flex justify-between items-center sticky top-0 z-20"
  >
    <p class="text-xl font-bold">Ram Tech Ventures</p>
    <button class="relative mr-5 px-3">
      <span
        v-if="notifications.length"
        class="absolute bg-red-500 text-white px-2 -top-1.5 right-0 rounded-lg"
      >
        {{ notifications.length }}
      </span>
      <img class="w-8" :src="NotificationBell" alt="notification-icon.png" />
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NotificationBell from '@/assets/icons/notification-bell.png'

const appStore = useAppStore()
const route = useRoute()

const notifications = [1]

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
